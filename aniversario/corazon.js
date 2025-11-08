const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const finalText = document.getElementById("finalText");

let particles = [];
let stage = "heart";
let startTime = null;

function createHeart(scale = 10) {
    const points = [];
    for (let t = 0; t < Math.PI * 2; t += 0.05) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        points.push({ x: x * scale, y: y * scale });
    }
    return points;
}

function initHeart() {
    const heartPoints = createHeart(10);
    particles = heartPoints.map(p => ({
        x: canvas.width / 2 + p.x,
        y: canvas.height / 2 - p.y,
        baseX: canvas.width / 2 + p.x,
        baseY: canvas.height / 2 - p.y,
        size: Math.random() * 3 + 1,
        alpha: 0
    }));
}

function drawHeart(scaleFactor) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,132,193,${p.alpha})`;
        const newX = (p.baseX - canvas.width / 2) * scaleFactor + canvas.width / 2;
        const newY = (p.baseY - canvas.height / 2) * scaleFactor + canvas.height / 2;
        ctx.arc(newX, newY, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function animate(time) {
    if (!startTime) startTime = time;
    const elapsed = (time - startTime) / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (stage === "heart") {
        const scale = 1 + 0.05 * Math.sin(elapsed * 3);
        particles.forEach(p => { if (p.alpha < 1) p.alpha += 0.015; });
        drawHeart(scale);

        if (elapsed > 5) {  // después de 5 segundos cambia de etapa
            stage = "dissolve";
            particles.forEach(p => {
                p.vx = (Math.random() - 0.5) * 6;
                p.vy = (Math.random() - 0.5) * 6;
                p.alpha = 1;
            });
        }
    } else if (stage === "dissolve") {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.02;
        });
        particles = particles.filter(p => p.alpha > 0);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255,132,193,${p.alpha})`;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        if (particles.length === 0) {
            stage = "text";
            finalText.classList.add("show");
        }
    }
    requestAnimationFrame(animate);
}

initHeart();
requestAnimationFrame(animate);

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initHeart();
});

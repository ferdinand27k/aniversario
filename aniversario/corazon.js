// === CANVAS PRINCIPAL DEL CORAZÓN ===
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
        const y =
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t);
        points.push({ x: x * scale, y: y * scale });
    }
    return points;
}

function initHeart() {
    const heartPoints = createHeart(10);
    particles = heartPoints.map((p) => ({
        x: canvas.width / 2 + p.x,
        y: canvas.height / 2 - p.y,
        baseX: canvas.width / 2 + p.x,
        baseY: canvas.height / 2 - p.y,
        size: Math.random() * 3 + 1,
        alpha: 0,
        vx: 0,
        vy: 0,
    }));
}

function drawHeart(scaleFactor) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
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
        // ❤️ LATIDO
        const scale = 1 + 0.05 * Math.sin(elapsed * 3);
        particles.forEach((p) => {
            if (p.alpha < 1) p.alpha += 0.02;
        });
        drawHeart(scale);

        if (elapsed > 6) {
            // 💫 CAMBIO A DISOLUCIÓN
            stage = "dissolve";
            particles.forEach((p) => {
                p.vx = (Math.random() - 0.5) * 6;
                p.vy = (Math.random() - 0.5) * 6;
            });
        }
    } else if (stage === "dissolve") {
        // 💨 DISOLVER
        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.02;
        });
        particles = particles.filter((p) => p.alpha > 0);
        particles.forEach((p) => {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255,132,193,${p.alpha})`;
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        if (particles.length === 0) {
            stage = "text";
            finalText.classList.add("show");

            // 💌 Mostrar carta
            setTimeout(() => {
                const loveLetter = document.getElementById("loveLetter");
                if (loveLetter) loveLetter.style.opacity = "1";
            }, 7000);

            // ✍️ Mostrar firma
            setTimeout(() => {
                const signature = document.querySelector(".signature");
                if (signature) signature.style.opacity = "1";
            }, 10000);

            // 🌌 Iniciar constelaciones
            setTimeout(() => {
                startConstellations();
            }, 12000);
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

// === CONSTELACIONES ===
const constellationCanvas = document.getElementById("constellationCanvas");
const cctx = constellationCanvas.getContext("2d");
let stars = [];
let t = 0;
let explode = false;

function resizeCanvas() {
    constellationCanvas.width = window.innerWidth;
    constellationCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createConstellation() {
    stars = [];
    const scale = 12;
    for (let t = 0; t < Math.PI * 2; t += 0.2) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y =
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t);
        stars.push({
            x: constellationCanvas.width / 2 + x * scale,
            y: constellationCanvas.height / 2 - y * scale,
            alpha: 0,
            size: 2 + Math.random() * 1.5,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
        });
    }
}

function drawConstellation() {
    cctx.clearRect(0, 0, constellationCanvas.width, constellationCanvas.height);
    t += 0.05;
    const scale = 1 + 0.03 * Math.sin(t * 3);

    stars.forEach((s) => {
        if (!explode && s.alpha < 1) s.alpha += 0.02;

        const newX =
            (s.x - constellationCanvas.width / 2) * scale + constellationCanvas.width / 2;
        const newY =
            (s.y - constellationCanvas.height / 2) * scale + constellationCanvas.height / 2;

        cctx.beginPath();
        cctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        cctx.arc(newX, newY, s.size, 0, Math.PI * 2);
        cctx.fill();
    });

    // ✨ Conectar estrellas cercanas
    if (!explode) {
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const dx = stars[i].x - stars[j].x;
                const dy = stars[i].y - stars[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 50) {
                    cctx.strokeStyle = "rgba(255,255,255,0.1)";
                    cctx.beginPath();
                    cctx.moveTo(stars[i].x, stars[i].y);
                    cctx.lineTo(stars[j].x, stars[j].y);
                    cctx.stroke();
                }
            }
        }
    }

    // 💥 EFECTO DE EXPLOSIÓN FINAL
    if (explode) {
        stars.forEach((s) => {
            s.x += s.vx;
            s.y += s.vy;
            s.alpha -= 0.03;
        });
        stars = stars.filter((s) => s.alpha > 0);
    }

    if (stars.length > 0) requestAnimationFrame(drawConstellation);
}

function startConstellations() {
    createConstellation();
    drawConstellation();

    // 💫 Explosión suave tras 7 segundos
    setTimeout(() => {
        explode = true;
    }, 7000);
}

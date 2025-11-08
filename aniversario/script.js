// 🌠 Typewriter
const text = '“Entre las incertidumbres del universo, sólo una constante encontré: tú.” — Inspirado en Werner Heisenberg';
let index = 0;
function typeWriter() {
    if (index < text.length) {
        document.getElementById('typewriter').innerHTML += text.charAt(index);
        index++;
        setTimeout(typeWriter, 50);
    }
}
window.onload = typeWriter;

// 🌌 Star background
const stars = document.getElementById('stars');
for (let i = 0; i < 150; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.top = `${Math.random() * 100}%`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.animationDuration = `${2 + Math.random() * 3}s`;
    stars.appendChild(star);
}

const style = document.createElement('style');
style.innerHTML = `
.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  opacity: 0.8;
  animation: twinkle infinite;
}
@keyframes twinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
`;
document.head.appendChild(style);

// 🖼️ Slideshow
let slideIndex = 0;
const slides = document.querySelectorAll('.slideshow img');
setInterval(() => {
    slides[slideIndex].classList.remove('active');
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add('active');
}, 5000);

// 💖 Floating hearts
setInterval(() => {
    const heart = document.createElement('div');
    heart.innerHTML = '❤';
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = 3 + Math.random() * 5 + 's';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 8000);
}, 700);

// ✨ Click “Te amo”
document.body.addEventListener('click', (e) => {
    const msg = document.createElement('span');
    msg.textContent = '💫 Te amo';
    msg.className = 'love-msg';
    msg.style.left = e.pageX + 'px';
    msg.style.top = e.pageY + 'px';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
});

// 💞 Love Modal
document.addEventListener("DOMContentLoaded", () => {
    const loveButton = document.getElementById('loveButton');
    const loveModal = document.getElementById('loveModal');
    const closeModal = document.querySelector('.close');

    if (loveButton && loveModal && closeModal) {
        loveButton.addEventListener('click', () => {
            loveModal.style.display = 'flex';
        });

        closeModal.addEventListener('click', () => {
            loveModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === loveModal) {
                loveModal.style.display = 'none';
            }
        });
    }
});

// 🎵 Control musical aislado
(() => {
    const bgMusic = document.getElementById("bg-music");
    if (!bgMusic) return; // Evita error si el audio no existe

    let musicStarted = false;

    function playMusic() {
        if (!musicStarted) {
            musicStarted = true;
            bgMusic.volume = 0;
            bgMusic.play().catch(() => { }); // evita error de política de autoplay
            const fade = setInterval(() => {
                if (bgMusic.volume < 1) {
                    bgMusic.volume += 0.05;
                } else {
                    clearInterval(fade);
                }
            }, 200);
        }
    }

    window.addEventListener("click", playMusic, { once: true });
    window.addEventListener("touchstart", playMusic, { once: true });
})();

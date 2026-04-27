// --- 1. LOADER LOGIC ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 800);
    }, 1200);
});

// --- 2. NETFLIX STYLE STICKY NAVBAR ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- 3. DEEP LINKING SYSTEM ---
function openDeepLink(appUri, webFallbackUrl) {
    const start = Date.now();
    window.location.href = appUri;
    setTimeout(() => {
        if (Date.now() - start < 1500) {
            window.location.href = webFallbackUrl;
        }
    }, 1000);
}

// --- 4. SCROLL REVEAL ANIMATIONS ---
const revealElements = document.querySelectorAll('.reveal');
const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// --- 5. MICRO-INTERACTIONS (Copy Link) ---
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    });
}

// --- 6. DYNAMIC VIDEO LOADING ---
const videoIDs = ["femu3mA-NAw", "dmBHvMUfDL8", "u-G33yWO1X0", "Mv7_PDvbaxE"];
const videoGrid = document.getElementById('videoGrid');
if (videoGrid) {
    videoGrid.innerHTML = videoIDs.map(id => `
        <div class="video-container">
            <iframe height="250" src="https://www.youtube.com/embed/${id}?rel=0" frameborder="0" allowfullscreen></iframe>
        </div>
    `).join('');
}

// --- 7. OPTIMIZED PARTICLES (High Speed Canvas) ---
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particlesArray = [];

function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', initCanvas);
initCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.color = Math.random() > 0.5 ? '#00E5FF' : '#444'; // Subtle colors
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    particlesArray = [];
    // Reduced particle count for better mobile performance
    let numberOfParticles = (canvas.width * canvas.height) / 20000; 
    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animateParticles);
}
createParticles();
animateParticles();

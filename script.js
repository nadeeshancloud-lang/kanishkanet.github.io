// --- 1. LOADER LOGIC ---
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 800);
    }, 1200); // Wait for progress bar animation
});

// --- 2. DEEP LINKING SYSTEM (The "App Launch" Experience) ---
function openDeepLink(appUri, webFallbackUrl) {
    // Note: Modern browsers restrict iframe-based deep links. 
    // The most reliable JS method is attempting to change window.location 
    // and using a timeout to fallback if the app doesn't intercept it.
    const start = Date.now();
    
    // Attempt to open the App Intent URI
    window.location.href = appUri;

    // Fallback to Web URL if app is not installed
    setTimeout(() => {
        // If the app opened, the browser would have paused execution.
        // If execution continues rapidly, the app likely wasn't installed.
        if (Date.now() - start < 1500) {
            window.location.href = webFallbackUrl;
        }
    }, 1000);
}

// --- 3. SCROLL REVEAL ANIMATIONS ---
const revealElements = document.querySelectorAll('.reveal');
const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// --- 4. SMOOTH SCROLL ---
function scrollToHub() {
    document.getElementById('hub').scrollIntoView({ behavior: 'smooth' });
}

// --- 5. MICRO-INTERACTIONS (Copy Link) ---
function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    });
}

// --- 6. FLOATING PARTICLES (Canvas Background) ---
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
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = Math.random() > 0.5 ? '#00E5FF' : '#7B2EFF';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 15000;
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
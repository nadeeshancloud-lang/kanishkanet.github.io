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
// Dynamic Video IDs - ඔයාට ඕන වෙලාවක මේ IDs මාරු කරන්න පුළුවන්
const videoIDs = ["femu3mA-NAw", "dmBHvMUfDL8", "u-G33yWO1X0", "Mv7_PDvbaxE"];

const videoGrid = document.getElementById('videoGrid');
if (videoGrid) {
    videoGrid.innerHTML = videoIDs.map(id => `
        <div class="glass-card video-container reveal">
            <iframe width="100%" height="250" src="https://www.youtube.com/embed/${id}" frameborder="0" allowfullscreen></iframe>
        </div>
    `).join('');
}
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');

function handleEnter(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function startNewChat() {
    chatContainer.innerHTML = `
        <div class="message ai-message">
            <img src="logo.ico" alt="Kanishka" class="avatar">
            <div class="content">Aluth chat ekak patan gamu! Mokakda ada karanne? Thumbnail ekak hadamuda?</div>
        </div>
    `;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // User ගේ Message එක පෙන්නීම
    appendMessage('user', text);
    userInput.value = '';

    // Loading Effect එක දැමීම
    const loadingId = 'loading-' + Date.now();
    appendLoading(loadingId);

    try {
        // Vercel Backend එකට කතා කිරීම
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        
        // Loading එක අයින් කරලා Typewriter Effect එකෙන් උත්තරය දීම
        document.getElementById(loadingId).remove();
        typeWriterEffect(data.reply);

    } catch (error) {
        document.getElementById(loadingId).remove();
        typeWriterEffect("Apo yaluve, connection eke podi aulk. Poddak inna ayeth balanna.");
    }
}

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;
    
    if (sender === 'user') {
        msgDiv.innerHTML = `<div class="content">${text}</div>`;
    }
    
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function appendLoading(id) {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message';
    loadingDiv.id = id;
    loadingDiv.innerHTML = `
        <img src="logo.ico" alt="Kanishka" class="avatar">
        <div class="content loading-dots">
            <span></span><span></span><span></span>
        </div>
    `;
    chatContainer.appendChild(loadingDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// අකුරෙන් අකුර Type වෙන Effect එක
function typeWriterEffect(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message ai-message';
    
    const img = document.createElement('img');
    img.src = 'logo.ico';
    img.className = 'avatar';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    
    msgDiv.appendChild(img);
    msgDiv.appendChild(contentDiv);
    chatContainer.appendChild(msgDiv);

    let i = 0;
    function type() {
        if (i < text.length) {
            contentDiv.innerHTML += text.charAt(i);
            i++;
            chatContainer.scrollTop = chatContainer.scrollHeight;
            setTimeout(type, 15); // අකුරු වැටෙන වේගය (15ms)
        }
    }
    type();
}

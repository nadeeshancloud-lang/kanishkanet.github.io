// ==========================================
// 1. FIREBASE CONFIGURATION
// Replace this with your actual Firebase config
// ==========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail,
    signOut,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ==========================================
// 2. ROUTING & STATE MANAGEMENT
// ==========================================
const isLoginPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
const isDashboard = window.location.pathname.includes('dashboard.html');

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        if (isLoginPage) {
            window.location.href = 'dashboard.html';
        } else if (isDashboard) {
            populateDashboard(user);
        }
    } else {
        // User is signed out
        if (isDashboard) {
            window.location.href = 'index.html';
        }
    }
});

// ==========================================
// 3. UI EFFECTS (Particles, Tilt, Ripple)
// ==========================================

// Floating Particles
if (document.getElementById('particles')) {
    const particleContainer = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        let p = document.createElement('div');
        p.classList.add('particle');
        p.style.left = Math.random() * 100 + 'vw';
        p.style.width = p.style.height = (Math.random() * 5 + 2) + 'px';
        p.style.animationDuration = (Math.random() * 10 + 5) + 's';
        p.style.animationDelay = (Math.random() * 5) + 's';
        particleContainer.appendChild(p);
    }
}

// 3D Hover Tilt Effect
const tiltCard = document.getElementById('tilt-card');
if (tiltCard && window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        let xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        let yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        tiltCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    });
    // Reset on mouse out
    document.addEventListener('mouseleave', () => {
        tiltCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });
}

// Button Ripple Effect
document.querySelectorAll('.ripple').forEach(button => {
    button.addEventListener('click', function (e) {
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;
        const ripples = document.createElement('span');
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        ripples.classList.add('ripple-element');
        this.appendChild(ripples);
        setTimeout(() => ripples.remove(), 600);
    });
});

// ==========================================
// 4. LOGIN / SIGNUP LOGIC (index.html)
// ==========================================
if (isLoginPage) {
    let isLoginMode = true;
    
    const form = document.getElementById('auth-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const toggleAuth = document.getElementById('toggle-auth');
    const formTitle = document.getElementById('form-title');
    const errorText = document.getElementById('error-message');
    const toggleText = document.getElementById('toggle-text');
    const rememberMe = document.getElementById('remember');

    // Toggle Sign In / Sign Up
    toggleAuth.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        errorText.innerText = '';
        if (isLoginMode) {
            formTitle.innerText = "Sign in to continue";
            btnText.innerText = "Initialize Session";
            toggleText.innerHTML = `New to Nexus? <a href="#" id="toggle-auth" class="text-link">Establish an identity</a>`;
        } else {
            formTitle.innerText = "Create Identity";
            btnText.innerText = "Register System";
            toggleText.innerHTML = `Already classified? <a href="#" id="toggle-auth" class="text-link">Sign in here</a>`;
        }
        // Re-bind listener because innerHTML replaced it
        document.getElementById('toggle-auth').addEventListener('click', arguments.callee);
    });

    // Email/Password Submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoading(true);
        errorText.innerText = '';

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            // Handle Remember Me (Firebase uses local by default)
            const persistenceType = rememberMe.checked ? browserLocalPersistence : browserSessionPersistence;
            await setPersistence(auth, persistenceType);

            if (isLoginMode) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    });

    // Google OAuth
    document.getElementById('google-login').addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            handleAuthError(error);
        }
    });

    // Apple OAuth
    document.getElementById('apple-login').addEventListener('click', async () => {
        const provider = new OAuthProvider('apple.com');
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            handleAuthError(error);
        }
    });

    // Forgot Password
    document.getElementById('forgot-password').addEventListener('click', async (e) => {
        e.preventDefault();
        const email = emailInput.value;
        if (!email) {
            errorText.innerText = "Enter your email address above first.";
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            errorText.style.color = "var(--neon-cyan)";
            errorText.innerText = "Password reset protocol initiated. Check your email.";
            setTimeout(() => errorText.style.color = "var(--error)", 5000);
        } catch (error) {
            handleAuthError(error);
        }
    });

    // Helpers
    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    function handleAuthError(error) {
        console.error(error);
        let msg = "An error occurred. Protocol aborted.";
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            msg = "Invalid credentials. Access denied.";
        } else if (error.code === 'auth/email-already-in-use') {
            msg = "Identity already exists. Please sign in.";
        } else if (error.code === 'auth/weak-password') {
            msg = "Encryption too weak. Use at least 6 characters.";
        }
        errorText.innerText = msg;
    }
}

// ==========================================
// 5. DASHBOARD LOGIC (dashboard.html)
// ==========================================
if (isDashboard) {
    function populateDashboard(user) {
        const defaultAvatar = "https://ui-avatars.com/api/?name=" + (user.displayName || "O") + "&background=00f0ff&color=000";
        const photoURL = user.photoURL || defaultAvatar;
        const displayName = user.displayName || user.email.split('@')[0];
        
        // Populate DOM
        document.getElementById('nav-avatar').src = photoURL;
        document.getElementById('main-avatar').src = photoURL;
        document.getElementById('welcome-name').innerText = displayName;
        document.getElementById('drop-name').innerText = displayName;
        document.getElementById('drop-email').innerText = user.email;
        document.getElementById('main-email').innerText = user.email;
    }

    // Profile Dropdown Toggle
    const avatarBtn = document.getElementById('profile-avatar-btn');
    const dropdown = document.getElementById('dropdown');
    
    avatarBtn.addEventListener('click', () => {
        dropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!avatarBtn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        signOut(auth).then(() => {
            // Redirect happens automatically via onAuthStateChanged
        }).catch((error) => {
            console.error("Sign out error", error);
        });
    });
}

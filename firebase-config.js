// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAeERgDlc_KYCrLRCCc_fFbnKdPziuGOCM",
    authDomain: "kanishka-net.firebaseapp.com",
    projectId: "kanishka-net",
    storageBucket: "kanishka-net.firebasestorage.app",
    messagingSenderId: "667002787187",
    appId: "1:667002787187:web:faa321ad901fffadbde106",
    measurementId: "G-L7GLN61TZV"
};

// 2. Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// 3. Button Logic
window.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const statusMsg = document.getElementById('statusMsg');

    if (loginBtn) {
        loginBtn.onclick = function() {
            const email = document.getElementById('userEmail').value;
            if(!email) { 
                statusMsg.innerText = "Please enter your email!";
                statusMsg.style.color = "red";
                return; 
            }

            statusMsg.innerText = "Sending link...";
            statusMsg.style.color = "white";

            const actionCodeSettings = {
                url: 'https://nadeeshancloud-lang.github.io/kanishkanet.github.io/',
                handleCodeInApp: true,
            };

            auth.sendSignInLinkToEmail(email, actionCodeSettings)
                .then(() => {
                    window.localStorage.setItem('emailForSignIn', email);
                    // මෙතන තමයි කලින් වැරැද්ද තිබුණේ. දැන් මේක පේළි දෙකකට වුණත් වැඩ කරනවා.
                    statusMsg.innerHTML = "Success! Please check your Email Inbox.<br><small style='color:#ffcc00;'>*Check <b>Spam</b> folder if not found.</small>";
                    statusMsg.style.color = "#00f2ff";
                })
                .catch((error) => {
                    // Quota එක පැනපු වෙලාවට දෙන message එක
                    if (error.code === 'auth/quota-exceeded') {
                        statusMsg.innerText = "Daily limit reached. Please try again tomorrow!";
                    } else {
                        statusMsg.innerText = "Error: " + error.message;
                    }
                    statusMsg.style.color = "red";
                });
        };
    }

    // 4. Handle Login Link
    if (auth.isSignInWithEmailLink(window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            email = window.prompt('Please confirm your email for login:');
        }
        auth.signInWithEmailLink(email, window.location.href)
            .then((result) => {
                window.localStorage.removeItem('emailForSignIn');
                alert("සාර්ථකව Log වුණා: " + result.user.email);
                window.location.href = window.location.origin + window.location.pathname; 
            })
            .catch((error) => alert("Login Error: " + error.message));
    }
});

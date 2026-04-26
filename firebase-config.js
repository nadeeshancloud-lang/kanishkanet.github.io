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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 3. Page එක Load වුණාම Buttons වැඩ කරන්න ඕන නිසා මේ කොටස වැදගත්
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
                // ඔයාගේ සැබෑ URL එක මෙතන තියෙන්න ඕනේ
                url: 'https://nadeeshancloud-lang.github.io/kanishkanet.github.io/',
                handleCodeInApp: true,
            };

            auth.sendSignInLinkToEmail(email, actionCodeSettings)
                .then(() => {
                    window.localStorage.setItem('emailForSignIn', email);
                    statusMsg.innerText = "Success! Please check your Email Inbox. If it's not there,
                        don't forget to check your 'Spam' folder.";
                    statusMsg.style.color = "#00f2ff";
                })
                .catch((error) => {
                    statusMsg.innerText = "Error: " + error.message;
                    statusMsg.style.color = "red";
                });
        };
    }

    // 4. Email එකේ ලින්ක් එක ක්ලික් කරලා ආවම වැඩ කරන කොටස
    if (auth.isSignInWithEmailLink(window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            email = window.prompt('Please confirm your email for login:');
        }
        auth.signInWithEmailLink(email, window.location.href)
            .then((result) => {
                window.localStorage.removeItem('emailForSignIn');
                alert("සාර්ථකව Log වුණා: " + result.user.email);
                location.reload(); 
            })
            .catch((error) => alert(error.message));
    }
});

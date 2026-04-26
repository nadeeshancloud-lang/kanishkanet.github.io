// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAeERgDlc_KYCrLRCCc_fFbnKdPziuGOCM",
    authDomain: "kanishka-net.firebaseapp.com",
    projectId: "kanishka-net",
    storageBucket: "kanishka-net.firebasestorage.app",
    messagingSenderId: "667002787187",
    appId: "1:667002787187:web:faa321ad901fffadbde106",
    measurementId: "G-L7GLN61TZV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Redirect එකෙන් පස්සේ Login එක handle කිරීම
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

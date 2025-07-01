import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3F9eISWbNs6Q2q8N_5R9MSIqznaWxxbE",
  authDomain: "thread-hq.firebaseapp.com",
  projectId: "thread-hq",
  storageBucket: "thread-hq.firebasestorage.app",
  messagingSenderId: "308767276388",
  appId: "1:308767276388:web:3cb466ce98693381a58e71",
  measurementId: "G-M490XWV1C5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = signupForm.elements[0].value;
  const email = signupForm.elements[1].value;
  const password = signupForm.elements[2].value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      return updateProfile(userCredential.user, { displayName: name });
    })
    .then(() => {
      alert("Signed up successfully!");
      signupForm.reset();
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});

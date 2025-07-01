// login.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB3F9eISWbNs6Q2q8N_5R9MSIqznaWxxbE",
  authDomain: "thread-hq.firebaseapp.com",
  projectId: "thread-hq",
  storageBucket: "thread-hq.firebasestorage.app",
  messagingSenderId: "308767276388",
  appId: "1:308767276388:web:3cb466ce98693381a58e71",
  measurementId: "G-M490XWV1C5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login form logic
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = loginForm.elements[0].value;
  const password = loginForm.elements[1].value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Logged in successfully! ✅");
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});

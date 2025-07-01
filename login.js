import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Firebase config
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

// ✅ DOM elements
const loginForm = document.getElementById("loginForm");
const rememberMeCheckbox = document.getElementById("rememberMe");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm.elements[0].value;
  const password = loginForm.elements[1].value;
  const rememberMe = rememberMeCheckbox.checked;

  try {
    // ✅ Set Firebase persistence
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
console.log("Persistence set to:", rememberMe ? "LOCAL (Remember me ON)" : "SESSION (Remember me OFF)");

    // ✅ Now log the user in
    await signInWithEmailAndPassword(auth, email, password);

    // ✅ Redirect only after login success
    window.location.href = "dashboard.html";
  } catch (error) {
    alert("Login error: " + error.message);
  }
});

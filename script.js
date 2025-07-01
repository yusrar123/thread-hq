// Import Firebase functions from the SDK
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Initialize Firebase Auth
const auth = getAuth();

// Get form element
const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = signupForm.elements[0].value;
  const email = signupForm.elements[1].value;
  const password = signupForm.elements[2].value;

  // Sign up user
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Update the user's display name
      return updateProfile(user, {
        displayName: name
      });
    })
    .then(() => {
      alert("Signed up successfully! 🎉");
      signupForm.reset();
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
});

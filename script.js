// Get form element
const signupForm = document.getElementById("signupForm");

// Listen for form submit
signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form values
  const name = signupForm.elements[0].value;
  const email = signupForm.elements[1].value;
  const password = signupForm.elements[2].value;

  // Sign up user with Firebase Auth
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      // Optional: Save name to Firebase user profile
      return user.updateProfile({
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

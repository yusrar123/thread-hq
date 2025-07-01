const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = signupForm.elements[0].value;
  const email = signupForm.elements[1].value;
  const password = signupForm.elements[2].value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
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

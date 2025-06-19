const text = "Review brands. Expose scams. Empower creators.";
let i = 0;

function typeWriter() {
  if (i < text.length) {
    document.getElementById("typing-text").innerHTML += text.charAt(i);
    i++;
    setTimeout(typeWriter, 50);
  }
}

window.onload = typeWriter;
document.getElementById('review-form').addEventListener('submit', function(e) {
  e.preventDefault(); // stop form from refreshing page
  alert('Thanks for submitting your review! We will check it soon.');
  this.reset();
});
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".review-form");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // prevent real submission

    // You can add real saving here later
    alert("✅ Thank you! Your review has been submitted.");

    form.reset(); // clear form
  });
});

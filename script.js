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
document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const reviews = document.querySelectorAll(".review-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const filter = button.getAttribute("data-filter");

      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      reviews.forEach(card => {
        const type = card.getAttribute("data-type");

        if (filter === "all" || filter === type) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});

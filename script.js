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
  const form = document.getElementById("reviewForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      data: {
        type: form.type.value,
        name: form.name.value,
        review: form.review.value,
      },
    };

    fetch("https://sheetdb.io/api/v1/gan8vuamea1tj", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        alert("✅ Thank you! Your review was submitted.");
        form.reset();
      })
      .catch((error) => {
        alert("❌ Something went wrong. Please try again.");
        console.error(error);
      });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const reviewGrid = document.getElementById("reviewGrid");

  if (reviewGrid) {
    fetch("https://sheetdb.io/api/v1/YOUR_API_ID")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((review) => {
          const card = document.createElement("div");
          card.classList.add("review-card");
          card.setAttribute("data-type", review.type.toLowerCase());

          card.innerHTML = `
            <h3>${review.type === "influencer" ? "Influencer" : "Brand"}: ${review.name}</h3>
            <p>“${review.review}”</p>
          `;

          reviewGrid.appendChild(card);
        });
      })
      .catch((err) => {
        console.error("Error loading reviews:", err);
      });
  }
});


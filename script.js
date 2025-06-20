// 🧠 Typing animation
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

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("reviewForm");
  const reviewGrid = document.getElementById("reviewGrid");
  const nameButtons = document.querySelectorAll(".name-btn");

  // ✅ 1. Handle form submission to Google Sheets
  if (form) {
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
  }

  // ✅ 2. Load and filter reviews from Google Sheets
  let allReviews = [];

  if (reviewGrid) {
    fetch("https://sheetdb.io/api/v1/gan8vuamea1tj")
      .then((response) => response.json())
      .then((data) => {
        allReviews = data;
        renderReviews("all");
      })
      .catch((error) => {
        console.error("❌ Failed to fetch reviews:", error);
      });
  }

  function renderReviews(filterName) {
    reviewGrid.innerHTML = "";

    const filtered = filterName === "all"
      ? allReviews
      : allReviews.filter((r) => r.name.toLowerCase() === filterName.toLowerCase());

    filtered.forEach((review) => {
      const card = document.createElement("div");
      card.classList.add("review-card");
      card.setAttribute("data-type", review.type);

      card.innerHTML = `
        <h3>${review.type === "influencer" ? "Influencer" : "Brand"}: ${review.name}</h3>
        <p>“${review.review}”</p>
      `;

      reviewGrid.appendChild(card);
    });
  }

  // ✅ 3. Set up filter buttons
  nameButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      nameButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filterName = btn.getAttribute("data-name");
      renderReviews(filterName);
    });
  });
});




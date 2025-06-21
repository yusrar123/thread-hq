// Typing animation on homepage
const text = "Review brands. Expose scams. Empower creators.";
let i = 0;
function typeWriter() {
  if (i < text.length) {
    const typingEl = document.getElementById("typing-text");
    if (typingEl) {
      typingEl.innerHTML += text.charAt(i);
      i++;
      setTimeout(typeWriter, 50);
    }
  }
}
window.onload = typeWriter;

let allReviews = [];

fetch("https://sheetdb.io/api/v1/4a5jm1rk5creo") // Replace with your correct SheetDB ID if needed
  .then((res) => res.json())
  .then((data) => {
    allReviews = data;
    renderNameButtons();
    renderReviews("all");
    renderBrandCards(data);
  });

function renderNameButtons() {
  const nameButtons = document.getElementById("nameButtons");
  const uniqueNames = [...new Set(allReviews.map((r) => r.name.trim()))].sort();

  nameButtons.innerHTML = "";

  uniqueNames.forEach((name) => {
    const ratings = allReviews
      .filter((r) => r.name.trim() === name.trim() && r.rating)
      .map((r) => parseInt(r.rating));

    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : null;

    const btn = document.createElement("button");
    btn.classList.add("name-btn");
    btn.setAttribute("data-name", name);

    btn.innerHTML = `${name} ${
      avgRating ? `<span class="avg-stars">★ ${avgRating.toFixed(1)}</span>` : ""
    }`;

    btn.addEventListener("click", () => {
      window.location.href = `profile.html?name=${encodeURIComponent(name)}`;
    });

    nameButtons.appendChild(btn);
  });
}

function renderReviews(type) {
  const reviewGrid = document.getElementById("reviewGrid");
  const filtered =
    type === "all"
      ? allReviews
      : allReviews.filter((r) => r.type.toLowerCase() === type);

  reviewGrid.innerHTML = "";
  displayCards(filtered);
}

function displayCards(data) {
  const reviewGrid = document.getElementById("reviewGrid");
  reviewGrid.innerHTML = "";

  data.forEach((review) => {
    const initials = review.name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("")
      .substring(0, 2);

    const card = document.createElement("div");
    card.className = "review-card";
    card.innerHTML = `
      <div class="review-content" data-aos="fade-up">
        <div class="avatar">${initials}</div>
        <div>
          <h3>${review.type === "influencer" ? "Influencer" : "Brand"}: ${review.name}</h3>
          <p>“${review.review}”</p>
          ${
            review.rating
              ? `<div class="stars">Rating: ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div>`
              : ""
          }
        </div>
      </div>
    `;
    reviewGrid.appendChild(card);
  });
}

function renderBrandCards(data) {
  const cardGrid = document.getElementById("brandCardGrid");
  if (!cardGrid) return;

  cardGrid.innerHTML = "";

  const uniqueMap = new Map();

  data.forEach((r) => {
    const key = r.name.trim().toLowerCase();
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, []);
    }
    uniqueMap.get(key).push(r);
  });

  uniqueMap.forEach((reviews, key) => {
    const r = reviews[0];
    const imgURL = r.image || "https://via.placeholder.com/400x300?text=No+Image";
    const avgRating =
      reviews.filter((r) => r.rating).reduce((sum, r) => sum + parseInt(r.rating), 0) /
      reviews.filter((r) => r.rating).length || null;

    const card = document.createElement("div");
    card.className = "brand-card";

    card.innerHTML = `
      <img src="${imgURL}" alt="${r.name}" />
      <div class="content">
        <h3>${r.name}</h3>
        ${
          avgRating
            ? `<div class="avg-stars">★ ${avgRating.toFixed(1)}</div>`
            : `<div class="avg-stars">No ratings yet</div>`
        }
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `profile.html?name=${encodeURIComponent(r.name)}`;
    });

    cardGrid.appendChild(card);
  });
}

// Star selection for form
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("reviewForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const data = {
        data: {
          type: document.getElementById("type").value,
          name: document.getElementById("name").value,
          review: document.getElementById("review").value,
          rating: document.getElementById("rating").value,
        },
      };

      fetch("https://sheetdb.io/api/v1/4a5jm1rk5creo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then(() => {
          alert("Thank you for your review!");
          form.reset();
        });
    });
  }

  const stars = document.querySelectorAll(".star-rating span");
  const ratingInput = document.getElementById("rating");

  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const value = star.getAttribute("data-value");
      ratingInput.value = value;

      stars.forEach((s) => s.classList.remove("active"));
      star.classList.add("active");
      let sibling = star.previousElementSibling;
      while (sibling) {
        sibling.classList.add("active");
        sibling = sibling.previousElementSibling;
      }
    });
  });
});

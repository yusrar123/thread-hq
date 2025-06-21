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

// Form submission to SheetDB
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("reviewForm");

  if (!form) {
    console.error("❌ ERROR: reviewForm not found in DOM.");
    return;
  }

  console.log("✅ reviewForm FOUND");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const type = document.getElementById("type").value;
    const name = document.getElementById("name").value;
    const review = document.getElementById("review").value;

    console.log("📤 Submitting review:", { type, name, review });

    const data = {
      data: {
        type,
        name,
        review,
      },
    };

    fetch("https://sheetdb.io/api/v1/4a5jm1rk5creo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        console.log("📬 Response received from SheetDB:", res.status);
        return res.json();
      })
      .then((resData) => {
        alert("✅ Review submitted successfully!");
        form.reset();
        console.log("🎉 Submission success:", resData);
      })
      .catch((err) => {
        alert("❌ Error submitting review. Try again.");
        console.error("🚨 Submission failed:", err);
      });
  });
});
// Handle star rating selection
document.addEventListener("DOMContentLoaded", function () {
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

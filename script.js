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
    console.error("❌ reviewForm not found in DOM.");
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = {
      data: {
        type: document.getElementById("type").value,
        name: document.getElementById("name").value,
        review: document.getElementById("review").value,
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
        alert("✅ Review submitted successfully!");
        form.reset();
      })
      .catch((err) => {
        alert("❌ Error submitting review. Try again.");
        console.error(err);
      });
  });
});

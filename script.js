// Typing effect on homepage
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

// Handle form submission to SheetDB (Google Sheets)
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

    fetch("https://sheetdb.io/api/v1/rwq21uzl2dxrg, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        alert("✅ Review submitted successfully!");
        form.reset();
      })
      .catch((error) => {
        alert("❌ Something went wrong. Please try again.");
        console.error(error);
      });
  });
});

const API_URL = "https://sheetdb.io/api/v1/4a5jm1rk5creo";

// Utility: calculate average rating
function calculateAverage(reviews) {
  const sum = reviews.reduce((acc, r) => acc + parseInt(r.rating), 0);
  return (sum / reviews.length).toFixed(1);
}

// Utility: create star elements based on average rating
function getStars(rating) {
  const fullStars = Math.round(rating);
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += i <= fullStars ? "★" : "☆";
  }
  return stars;
}

// Render brand cards
function renderBrands(brandGroups, sortType = "alpha") {
  const container = document.getElementById("brandCards");
  container.innerHTML = "";
  allBrandCards = [];

  const sortedBrands = Object.keys(brandGroups).sort((a, b) => {
    if (sortType === "rating") {
      const aAvg = calculateAverage(brandGroups[a]);
      const bAvg = calculateAverage(brandGroups[b]);
      return bAvg - aAvg;
    }
    return a.localeCompare(b);
  });

  sortedBrands.forEach(brand => {
    const reviews = brandGroups[brand];
    const avg = calculateAverage(reviews);
    const stars = getStars(avg);

    const card = document.createElement("a");
    card.className = "brand-card";
    card.href = `profile.html?brand=${encodeURIComponent(brand)}`;
    card.setAttribute("data-brand", brand.toLowerCase());

  const brandImage = reviews[0].image?.trim();
const imageUrl = brandImage && brandImage !== "" 
  ? brandImage 
  : `https://via.placeholder.com/400x160.png?text=${encodeURIComponent(brand)}`;

card.innerHTML = `
  <img src="${imageUrl}" alt="${brand} Header">
  <div class="info">
    <h2>${brand}</h2>
    <div class="star-display">${stars} (${avg})</div>
  </div>
`;

    allBrandCards.push(card);
    container.appendChild(card);
  });
}


let allBrandCards = [];
let allBrandData = []; // full grouped data for sorting


// Fetch data from SheetDB
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    const brandGroups = {};

    data.forEach(entry => {
      const brand = entry.brand.trim();
      if (!brandGroups[brand]) brandGroups[brand] = [];
      brandGroups[brand].push(entry);
    });

    allBrandData = brandGroups;
    renderBrands(brandGroups); // default to A-Z
  });
document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const container = document.getElementById("brandCards");
  container.innerHTML = "";

  allBrandCards.forEach(card => {
    const brand = card.getAttribute("data-brand");
    if (brand.includes(query)) {
      container.appendChild(card);
    }
  });
});

document.getElementById("sortSelect").addEventListener("change", function () {
  const sortType = this.value;
  renderBrands(allBrandData, sortType);
});


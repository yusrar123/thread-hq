import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB3F9eISWbNs6Q2q8N_5R9MSIqznaWxxbE",
  authDomain: "thread-hq.firebaseapp.com",
  projectId: "thread-hq",
  storageBucket: "thread-hq.firebasestorage.app",
  messagingSenderId: "308767276388",
  appId: "1:308767276388:web:3cb466ce98693381a58e71",
  measurementId: "G-M490XWV1C5"
};

// ✅ Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const wishlistForm = document.getElementById("wishlistForm");
const wishlistItems = document.getElementById("wishlistItems");
let currentUser = null;

// ✅ Auth check
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loadWishlist();
  } else {
    window.location.href = "login.html";
  }
});

// ✅ Save product URL
wishlistForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = wishlistForm.elements[0].value;

  if (!url) {
    alert("Please enter a URL.");
    return;
  }

  try {
    // (Optional) Try to get initial price from product page
    let initialPrice = null;
    try {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      const html = data.contents;
      const match = html.match(/(?:Rs\.|PKR|₨)\s?([0-9,]+)/i);
      if (match) {
        initialPrice = parseInt(match[1].replace(/,/g, ""));
      }
    } catch (err) {
      console.log("Price fetch failed:", err.message);
    }

    await addDoc(collection(db, "wishlist"), {
      userId: currentUser.uid,
      email: currentUser.email,
      url: url,
      notify: false,
      lastKnownPrice: initialPrice
    });

    wishlistForm.reset();
    loadWishlist();
  } catch (error) {
    alert("Error saving item: " + error.message);
  }
});

// ✅ Load wishlist
async function loadWishlist() {
  wishlistItems.innerHTML = "";

  const q = query(collection(db, "wishlist"), where("userId", "==", currentUser.uid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    wishlistItems.innerHTML = "<li class='empty'>You haven’t saved anything yet.</li>";
    return;
  }

  querySnapshot.forEach((docSnap) => {
    const item = docSnap.data();
    const li = document.createElement("li");

    li.innerHTML = `
      <div class="wishlist-item">
        <a href="${item.url}" target="_blank">${item.url}</a><br/>
        <label>
          <input type="checkbox" ${item.notify ? "checked" : ""} data-id="${docSnap.id}" />
          Notify me if this item goes on sale / restocks
        </label>
        <button class="delete-btn" data-id="${docSnap.id}">🗑</button>
      </div>
    `;

    // ✅ Handle checkbox
    const checkbox = li.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", async () => {
      await updateDoc(doc(db, "wishlist", docSnap.id), {
        notify: checkbox.checked
      });
    });

    // ✅ Handle delete
    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", async () => {
      if (confirm("Delete this item?")) {
        await deleteDoc(doc(db, "wishlist", docSnap.id));
        loadWishlist();
      }
    });

    wishlistItems.appendChild(li);
  });
}
// ✅ Logout button functionality
const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    auth.signOut()
      .then(() => {
        window.location.href = "index.html"; // Or login.html if you prefer
      })
      .catch((error) => {
        alert("Logout error: " + error.message);
      });
  });
}

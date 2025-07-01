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

// ✅ Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB3F9eISWbNs6Q2q8N_5R9MSIqznaWxxbE",
  authDomain: "thread-hq.firebaseapp.com",
  projectId: "thread-hq",
  storageBucket: "thread-hq.firebasestorage.app",
  messagingSenderId: "308767276388",
  appId: "1:308767276388:web:3cb466ce98693381a58e71",
  measurementId: "G-M490XWV1C5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ DOM Elements
const wishlistForm = document.getElementById("wishlistForm");
const productUrl = document.getElementById("productUrl");
const wishlistItems = document.getElementById("wishlistItems");
const successMessage = document.getElementById("successMessage");

let currentUser = null;

// ✅ Wait for user to be logged in
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    currentUser = user;
    loadWishlist();
  }
});

// ✅ Submit Wishlist Form
wishlistForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = productUrl.value.trim();
  if (!url) return;

  try {
    await addDoc(collection(db, "wishlist"), {
      userId: currentUser.uid,
      url: url,
      notify: true,
      lastPrice: "9999"
    });

    successMessage.style.display = "block";
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 3000);

    productUrl.value = "";
    loadWishlist();
  } catch (error) {
    alert("Error saving item: " + error.message);
  }
});

// ✅ Load Wishlist Items
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

    // ✅ Toggle Notify
    const checkbox = li.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", async () => {
      await updateDoc(doc(db, "wishlist", docSnap.id), {
        notify: checkbox.checked
      });
    });

    // ✅ Delete Item
    const deleteButton = li.querySelector(".delete-btn");
    deleteButton.addEventListener("click", async () => {
      if (confirm("Are you sure you want to delete this item?")) {
        await deleteDoc(doc(db, "wishlist", docSnap.id));
        loadWishlist();
      }
    });

    wishlistItems.appendChild(li);
  });
}
// 🔓 Log Out and Redirect
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    auth.signOut().then(() => {
      window.location.href = "index.html";
    }).catch((error) => {
      alert("Error logging out: " + error.message);
    });
  });
}


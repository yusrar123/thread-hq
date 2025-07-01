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

const wishlistForm = document.getElementById("wishlistForm");
const wishlistItems = document.getElementById("wishlistItems");

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    loadWishlist();
  } else {
    window.location.href = "login.html";
  }
});

wishlistForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = wishlistForm.elements[0].value;

  try {
    await addDoc(collection(db, "wishlist"), {
      userId: currentUser.uid,
      url,
      notify: false
    });
function loadWishlist() {
  auth.onAuthStateChanged(user => {
    if (user) {
      db.collection("wishlist")
        .where("userId", "==", user.uid)
        .get()
        .then(snapshot => {
          const list = document.getElementById("wishlistItems");
          list.innerHTML = ""; // clear previous

          snapshot.forEach(doc => {
            const data = doc.data();
            const li = document.createElement("li");
            li.style.padding = "10px 0";
            li.innerHTML = `<a href="${data.url}" target="_blank" style="color: #000;">${data.url}</a>`;
            list.appendChild(li);
          });
        });
    }
  });
}

// Load on page load
loadWishlist();

    wishlistForm.reset();
    loadWishlist();
  } catch (error) {
    alert("Error saving item: " + error.message);
  }
});

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

    // Notify toggle
    const checkbox = li.querySelector("input[type='checkbox']");
    checkbox.addEventListener("change", async () => {
      await updateDoc(doc(db, "wishlist", docSnap.id), {
        notify: checkbox.checked
      });
    });

    // Delete button
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

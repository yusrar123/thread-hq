<!-- db.js -->
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>

<script>
  const firebaseConfig = {
    apiKey: "AIzaSyB3F9eISWbNs6Q2q8N_5R9MSIqznaWxxbE",
    authDomain: "thread-hq.firebaseapp.com",
    projectId: "thread-hq",
    storageBucket: "thread-hq.firebasestorage.app",
    messagingSenderId: "308767276388",
    appId: "1:308767276388:web:3cb466ce98693381a58e71",
    measurementId: "G-M490XWV1C5"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
</script>

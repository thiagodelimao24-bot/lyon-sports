// Configuração do Firebase - Lyon Sports
const firebaseConfig = {
    apiKey: "AIzaSyC3s_QB5D-krhFUMjXvzIg0nksLHMc8BmI",
    authDomain: "lyon-sports.firebaseapp.com",
    projectId: "lyon-sports",
    storageBucket: "lyon-sports.firebasestorage.app",
    messagingSenderId: "685301798191",
    appId: "1:685301798191:web:8a4941fad088b15071bdda",
    measurementId: "G-0XJVJQSTJW"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Firestore
const db = firebase.firestore();

// Authentication
const auth = firebase.auth();
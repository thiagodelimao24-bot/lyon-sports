// Configuração pública do Firebase da Lyon Sports.
// Estas chaves identificam o projeto; a segurança real fica nas regras do Firestore e no Authentication.
const firebaseConfig = {
  apiKey: "AIzaSyC3s_QB5D-krfFUMjXvzlG0nksLHMc8BmI",
  authDomain: "lyon-sports.firebaseapp.com",
  projectId: "lyon-sports",
  storageBucket: "lyon-sports.firebasestorage.app",
  messagingSenderId: "685301798191",
  appId: "1:685301798191:web:8a4941fad088b15071bdda",
  measurementId: "G-0XJVJQSTJW"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

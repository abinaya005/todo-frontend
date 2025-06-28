// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAnvN9SzaPp6ox1sAbkens1mtTRqQJNmLw",
  authDomain: "todo-task-df590.firebaseapp.com",
  projectId: "todo-task-df590",
  storageBucket: "todo-task-df590.firebasestorage.app",
  messagingSenderId: "492504265474",
  appId: "1:492504265474:web:a865f78b1b7ee5cb42881b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };

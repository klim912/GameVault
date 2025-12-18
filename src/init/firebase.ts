import { initializeApp } from "firebase/app";
import { getAuth, sendEmailVerification} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEbMtr-fRKCVvaK4ppnKzaZ4ZEts1Da2U",
  authDomain: "steam-clone-app.firebaseapp.com",
  projectId: "steam-clone-app",
  storageBucket: "steam-clone-app.firebasestorage.app",
  messagingSenderId: "755180130134",
  appId: "1:755180130134:web:1fd2a64f578c92aaded0f7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);


export { auth, sendEmailVerification};
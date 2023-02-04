import { FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const credentialsLogin = async (email, password) => {
  if (!email) throw new Error("E-mail empty");
  else if (!password) throw new Error("Password empty");
  else {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      throw err;
    }
  }
};

export const googleLogin = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    try {
      await updateDoc(doc(db, "users", res.user.uid), {
        photoURL: res.user.photoURL,
      });
    } catch (err) {
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

export const facebookLogin = async () => {
  try {
    await signInWithPopup(auth, facebookProvider);
  } catch (err) {
    throw err;
  }
};

export const logOut = () => {
  signOut(auth)
    .then(() => {
      console.log("User session destroyed.");
    })
    .catch((err) => {
      throw err;
    });
};
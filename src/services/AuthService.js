import { createUserWithEmailAndPassword, FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { DEFAULT_AVATAR_URL } from "../constants";
import { uploadFileToStorage } from "./Helpers";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const credentialsRegister = async (displayName, email, password, avatar) => {
  if (!displayName) throw new Error("Display name empty");
  else if (!email) throw new Error("Email empty");
  else if (!password) throw new Error("Password empty");
  else {
    try {
      // create user in firebase authentication
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // save user avatar or use default
      var downloadURL;
      if (avatar) {
        downloadURL = await uploadFileToStorage("userImages", res.user.uid, avatar);
      } else {
        downloadURL = DEFAULT_AVATAR_URL;
      }

      // update user avatar in firebase authentication
      await updateProfile(res.user, {
        displayName,
        photoURL: downloadURL,
      });

      // create user on firestore database
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        photoURL: downloadURL,
      });
    } catch (err) {
      throw err;
    }
  }
}

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
    // create user in firebase authentication
    const res = await signInWithPopup(auth, googleProvider);

    const docRef = doc(db, "users", res.user.uid);
    const docSnap = await getDoc(docRef);

    // if user doesn't exists on firestore database
    if (!docSnap.exists()) {
      // create user on firestore database
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: res.user.displayName,
        email: res.user.email,
        photoURL: res.user.photoURL,
      });
    }
  } catch (err) {
    throw err;
  }
};

export const facebookLogin = async () => {
  try {
    // create user in firebase authentication
    const res = await signInWithPopup(auth, facebookProvider);

    const docRef = doc(db, "users", res.user.uid);
    const docSnap = await getDoc(docRef);

    // if user doesn't exists on firestore database
    if (!docSnap.exists()) {
      // create user on firestore database
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: res.user.displayName,
        email: res.user.email,
        photoURL: res.user.photoURL,
      });
    }
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
import { FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from "../firebase";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const formatErrorCode = (errorCode) => {
  const errorMessage = errorCode.split('/')[1].replaceAll('-', ' ');
  return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
}

export const credentialsLogin = async (email, password) => {
  if(!email)
    throw new Error('E-mail empty');
  else if(!password)
    throw new Error('Password empty');
  else {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      throw err;
    }
  }
}
  
export const googleLogin = async  () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    try {
      console.log("Prl", res.user.photoURL)
    await updateDoc(doc(db, "users", res.user.uid), {
      photoURL: res.user.photoURL
  });
  } catch(err) {
    throw err;
  }
  }
  catch(err) {
    throw err;
  }
}

export const facebookLogin = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    console.log(result.user);
  }
  catch(err) {
    throw err;
  }
}

export const logOut = () => {
  signOut(auth).then(() => {
    console.log('Signed out!');
  }).catch((err) => {
    throw err;
  });
}


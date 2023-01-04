import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const formatErrorCode = (errorCode) => {
    const errorMessage = errorCode.split('/')[1].replaceAll('-', ' ');
    return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
}

export const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log(result.user);
  }
  catch(err) {
    console.log(err);
  }
}

export const facebookLogin = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    console.log(result.user);
  }
  catch(err) {
    console.log(err);
  }
}
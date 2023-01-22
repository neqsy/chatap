import { FacebookAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

class AuthService {
  formatErrorCode = (errorCode) => {
    const errorMessage = errorCode.split('/')[1].replaceAll('-', ' ');
    return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
  }

  credentialsLogin = async (email, password) => {
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
  
  googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result.user);
    }
    catch(err) {
      throw err;
    }
  }

  facebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      console.log(result.user);
    }
    catch(err) {
      throw err;
    }
  }
}

export const authService = new AuthService();
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from '../firebase';

export const uploadFileToStorage = async(path, filename, file) => {
  const storageRef = ref(storage, `${path}/${ filename }`);

  return await uploadBytesResumable(storageRef, file).then(() => getDownloadURL(storageRef));
}
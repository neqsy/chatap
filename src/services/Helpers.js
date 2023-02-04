import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";

export const formatErrorCode = (errorCode) => {
  const errorMessage = errorCode.split('/')[1].replaceAll('-', ' ');
  return errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1);
}

export const uploadFileToStorage = async(path, filename, file) => {
  const storageRef = ref(storage, `${path}/${ filename }`);

  return await uploadBytesResumable(storageRef, file).then(() => getDownloadURL(storageRef));
}

export const getMessageDate = (date) => {
  const currentDate = new Date();
  const messageDate = new Date(date * 1000);

  if (
    messageDate.getFullYear() === currentDate.getFullYear() &&
    messageDate.getMonth() === currentDate.getMonth() &&
    messageDate.getDate() === currentDate.getDate()
  )
    return `Today at ${String(
      messageDate.getHours()
      ).padStart(2,"0")}:${String(
        messageDate.getMinutes()
      ).padStart(2, "0")}`;
  else
    return `${String(messageDate.getDate()).padStart(2, "0")}.${String(
      messageDate.getMonth() + 1
    ).padStart(2, "0")}.${messageDate.getFullYear()}`;
};

export const searchChats = (keyword, chats) => {
  return chats.filter((chat) => chat.data.name.includes(keyword));
}

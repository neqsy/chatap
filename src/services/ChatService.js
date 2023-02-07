import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, orderBy, query, updateDoc, where } from "firebase/firestore";
import SpeechRecognition from "react-speech-recognition";
import MessageType from "../components/Message/MessageType";
import { CHAT_NOTIFICATIONS, DEFAULT_CHAT_IMAGE_URL } from "../constants";
import { db } from "../firebase";
import { uploadFileToStorage } from "./Helpers";

export const addNewChat = async (chatName, userId, chatImage) => {
  try {
    const chatRef = await addDoc(collection(db, "chats"), {
      name: chatName,
      userId: userId,
      created: new Date(),
      lastMessage: "",
      members: [],
    });

    await sendMessage(
      chatRef.id,
      CHAT_NOTIFICATIONS.CREATE_CHAT,
      MessageType.NOTIFICATION
    );

    // save chat image or use default
    var downloadURL;
    if (chatImage) {
      downloadURL = await uploadFileToStorage("chatImages", chatRef.id, chatImage);
    } else {
      downloadURL = DEFAULT_CHAT_IMAGE_URL;
    }
    await updateDoc(chatRef, {
      photoURL: downloadURL,
    });
  } catch (err) {
    throw err;
  }
};

export const joinChat = async (chatId, user) => {
  try {
    const docRef = doc(db, "chats", chatId);

    await updateDoc(docRef, {
      members: arrayUnion(user.uid),
    });

    await sendMessage(
      chatId,
      user.displayName + " " + CHAT_NOTIFICATIONS.USER_JOIN,
      MessageType.NOTIFICATION
    );
  } catch (err) {
    throw err;
  }
};

export const leaveChat = async (chatId, user) => {
  try {
    const docRef = doc(db, "chats", chatId);

    await updateDoc(docRef, {
      members: arrayRemove(user.uid)
    });

    await sendMessage(
      chatId,
      user.displayName + " " + CHAT_NOTIFICATIONS.USER_LEFT,
      MessageType.NOTIFICATION
    );
  } catch (err) {
    throw err;
  }
}

export const prepareGetChatsQueries = (userId) => {
  const getJoined = query(
      collection(db, "chats"),
      where("userId", "!=", userId),
      where("members", "array-contains", userId)
    ),
    getOthers = query(collection(db, "chats"), where("userId", "!=", userId)),
    getUser = query(collection(db, "chats"), where("userId", "==", userId));

  return { getJoined, getOthers, getUser };
};

export const prepareGetMessagesQuery = (chatId) => {
  const messagesRef = doc(db, "chatMessages", chatId);

  return query(collection(messagesRef, "messages"), orderBy("sentAt", "asc"));
};

export const startListening = () => {
  SpeechRecognition.startListening({ continuous: true });
};

export const stopListening = () => {
  SpeechRecognition.stopListening();
};

export const sendMessage = async (chatId, messageText, messageType, userId) => {
  const messagesRef = collection(db, "chatMessages", chatId, "messages");
  const chatRef = doc(db, "chats", chatId);

  try {
    // save message in firebase database
    const message = await addDoc(messagesRef, {
      sentAt: new Date(),
      sentBy: userId ? userId : "system",
      text: messageText,
      type: messageType,
    });

    // update chat last message in database
    await updateDoc(chatRef, {
      lastMessage: messageType === MessageType.IMAGE ? "Sent image" : messageText,
    });

    return message;
  } catch (err) {
    throw err;
  }
};

export const getUserById = async (userId) => {
  const docRef = doc(db, "users", userId);

  try {
    const doc = await getDoc(docRef);
    return doc;
  } catch (err) {
    throw err;
  }
};
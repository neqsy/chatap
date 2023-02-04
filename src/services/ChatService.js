import { addDoc, arrayUnion, collection, doc, getDoc, orderBy, query, updateDoc, where } from "firebase/firestore";
import SpeechRecognition from "react-speech-recognition";
import MessageType from "../components/Message/MessageType";
import { CHAT_NOTIFICATIONS } from "../constants";
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

    await uploadFileToStorage("chatImages", chatRef.id, chatImage).then(
      async (downloadURL) => {
        await updateDoc(chatRef, {
          photoURL: downloadURL,
        });
      }
    );
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
      user.displayName + CHAT_NOTIFICATIONS.USER_JOIN,
      MessageType.NOTIFICATION
    );
  } catch (err) {
    throw err;
  }
};

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

export const sendMessage = async (chatId, messageText, type, userId) => {
  const messagesRef = collection(db, "chatMessages", chatId, "messages");

  const chatRef = doc(db, "chats", chatId);

  try {
    await addDoc(messagesRef, {
      sentAt: new Date(),
      sentBy: userId ? userId : "system",
      text: messageText,
      type: type,
    });

    await updateDoc(chatRef, {
      lastMessage: messageText,
    });
  } catch (err) {
    throw err;
  }
};

export const sendImageMessage = async (
  messageImage,
  messageId,
  messageDocRef
) => {
  await uploadFileToStorage("chatImageMessages", messageId, messageImage).then(
    async (downloadURL) => {
      await updateDoc(messageDocRef, {
        photoURL: downloadURL,
      });
    }
  );
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
import { addDoc, collection, doc, getDoc, getDocFromCache, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase";

export const addNewChat = async (chatName, chatCreatorId, chatCreationDate) => {
  try {
    const chatRef = await addDoc(collection(db, "chats"), {
      name: chatName,
      userId: chatCreatorId,
      created: chatCreationDate,
      lastMessage: "",
      members: [] 
    });

    await addDoc(collection(db, "chatMessages", chatRef.id, "messages"), {
      sentAt: new Date(),
      text: 'Chat created!',
      type: 'notification'
    });

    console.log("Document written with ID: ", chatRef.id);
    return chatRef.id;
  } catch(err) {
    console.log(err)
    throw err;
  }
}

export const getAllChats = async () => {
  const q = query(collection(db, "chats"));
  let chats = [];
  onSnapshot(q, (querySnapshot) => {
    chats = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
    // return chats;
  });
  console.log("Current chats: ", chats);
  return chats;
    

  // try {
  //   const querySnapshot = await getDocs(q);
  //   console.log(querySnapshot)
  //   if(querySnapshot.empty)
  //     console.log("EMPTY")
  //   return querySnapshot;
  // } catch(err) {
  //   throw err;
  // }
}
export const getUserById = async (userId) => {
  const docRef = doc(db, "users", userId);
  try {
    const doc = await getDoc(docRef);
    console.log("user", doc.data());
    return doc;
    
  } catch(err) {
    throw err;
  }
}

export const getUserChats = async (userId) => {
  const q = query(collection(db, "chats"), where("userId", "==", userId));
  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot;
    
  } catch(err) {
    throw err;
  }
}

export const getChatMessages = async (chatId) => {
    const docRef = doc(db, "chatMessages", chatId);
    try {
      const doc = await getDoc(docRef);
      console.log("mess", doc.data());
      return doc;
      
    } catch(err) {
      throw err;
    }
  }

export const openChat = async (chatId) => {
  const docRef = doc(db, "chats", chatId);

  try {
    const doc = await getDoc(docRef);
    console.log(doc.data());
    return doc;
    
  } catch(err) {
    throw err;
  }
}

export const sendMessage = async () => (userId, chatId, messageText) => {

}
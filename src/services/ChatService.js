import { addDoc, collection, doc, getDoc, getDocFromCache, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

class ChatService {
  async addNewChat(chatName, chatCreatorId, chatCreationDate) {
    try {
      const docRef = await addDoc(collection(db, "chats"), {
        name: chatName,
        userId: chatCreatorId,
        created: chatCreationDate,
        lastMessage: "",
        members: [] 
      });
      console.log("Document written with ID: ", docRef.id);
    } catch(err) {
      console.log(err)
      throw err;
    }
  }

  async getAllChats() {
    const q = query(collection(db, "chats"));
  
    try {
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot)
      if(querySnapshot.empty)
        console.log("EMPTY")
      return querySnapshot;
    } catch(err) {
      throw err;
    }
  }

  async getUserChats(userId) {
    const q = query(collection(db, "chats"), where("userId", "==", userId));
  
    try {
      const querySnapshot = await getDocs(q);
      return querySnapshot;
      
    } catch(err) {
      throw err;
    }
  }

  async getChatMessages(chatId) {
    const docRef = doc(db, "chatMessages", chatId);
    try {
      const doc = await getDoc(docRef);
      console.log("mess", doc.data());
      return doc;
      
    } catch(err) {
      throw err;
    }
  }

  async openChat(chatId) {
    const docRef = doc(db, "chats", chatId);
  
    try {
      const doc = await getDoc(docRef);
      console.log(doc.data());
      return doc;
      
    } catch(err) {
      throw err;
    }
  }

  async sendMessage(userId, chatId, messageText) {

  }
}

export const chatService = new ChatService();
import { addDoc, arrayUnion, collection, doc, FieldValue, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebase';
import { formatErrorCode } from '../../services/AuthService';
import { addNewChat } from '../../services/ChatService';
import { uploadFileToStorage } from '../../services/Helpers';
import { ChatBar } from '../ChatBar/ChatBar';

export const JoinChatPopUp = ({ modalShow, handleClose, chats }) => {
  const authContext = useContext(AuthContext);

  const [availableChats, setAvailableChats] = useState([]);
  const [activeChat, setActiveChat] = useState({});

  const handleJoinChat = async (e) => {
    e.preventDefault();
    
    try {
      const docRef = doc(db, "chats", activeChat?.id);
      const res = await updateDoc(docRef, {
        members: arrayUnion(authContext?.currentUser?.uid)
      });

      await addDoc(collection(db, "chatMessages", docRef.id, "messages"), {
        sentAt: new Date(),
        text: `${authContext?.currentUser?.displayName} joined chat!`,
        type: 'notification'
      });
      console.log(res, "user added")
    } catch(err) {
      console.log(err);
      // setError(formatErrorCode(err.code));
    }
    // handleClose();
  }
  
  useEffect(() => {
    if(authContext.currentUser.uid) {
      console.log(chats)
      setAvailableChats(chats.filter((chat) =>  !chat?.data?.members.includes(authContext.currentUser.uid)));
      console.log(availableChats)
    }
  }, [chats])
  
  return (
    <Modal show={ modalShow } onHide={ handleClose }>
      <Modal.Header closeButton>
        <Modal.Title>Join chat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='scroll-accordion'>
        {availableChats?.map(chat =>
          <ChatBar key={ chat.id } chat={ chat } activeChat={ activeChat } setActiveChat={ setActiveChat } />
        )}
        </div>
        <Form onSubmit={ handleJoinChat }>
          <Button variant="secondary" onClick={ handleClose }>
            Cancel
          </Button>
          <Button type="submit" variant="primary" onClick={ handleClose }>
            Join
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

import { doc, updateDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../firebase';
import { formatErrorCode } from '../../services/AuthService';
import { addNewChat } from '../../services/ChatService';
import { uploadFileToStorage } from '../../services/Helpers';

export const NewChatPopUp = ({ modalShow, handleClose }) => {
  const authContext = useContext(AuthContext);

  const [error, setError] = useState('');

  const handleAddChat = async (e) => {
    e.preventDefault();
    
    const chatName = e.target[0].value;
    const chatImage = e.target[1].files[0];

    try {
      const chatId = await addNewChat(chatName, authContext.currentUser.uid, new Date(), chatImage);
      const chatRef = doc(db, "chats", chatId);
  
      await uploadFileToStorage("chatImages", chatId, chatImage).then(async (downloadURL) => {
        try {
          await updateDoc(chatRef, {
            photoURL: downloadURL
          });
        } catch (err) {
          throw err;
        }
      })
    } catch(err) {
      console.log(err);
      // setError(formatErrorCode(err.code));
    }
    // handleClose();
  }
  
  return (
  <Modal show={ modalShow } onHide={ handleClose }>
    <Modal.Header closeButton>
      <Modal.Title>Add new chat</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Form onSubmit={ handleAddChat }>
      <Form.Group className="mb-3">
          <Form.Label className="mb-2">Name</Form.Label>
          <Form.Control id="name" type="text" className="shadow-sm rounded-4" name="name" autoFocus/>
      </Form.Group>
      <Form.Group className="mb-3">
          <Form.Label className="mb-2">Image</Form.Label>
          <Form.Control id="image" type="file" className="form-control shadow-sm rounded-4" name="password"/>
      </Form.Group>
      <Button variant="secondary" onClick={ handleClose }>
        Cancel
      </Button>
      <Button type="submit" variant="primary" onClick={ handleClose }>
        Add
      </Button>
    </Form>
    </Modal.Body>
    <Modal.Footer>
      tst
    </Modal.Footer>
  </Modal>
  )
}

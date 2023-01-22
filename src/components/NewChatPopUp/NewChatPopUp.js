import React, { useContext, useState } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { AuthContext } from '../../context/AuthContext';
import { chatService } from '../../services/ChatService';

export const NewChatPopUp = ({ modalShow, handleClose }) => {
  const authContext = useContext(AuthContext);

  const handleAddChat = () => {
    chatService.addNewChat("test", authContext.currentUser.uid, new Date());
    handleClose();
  }
  return (
  <Modal show={modalShow} onHide={handleClose}>
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
    </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleAddChat}>
        Add
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

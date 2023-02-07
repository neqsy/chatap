import React, { useContext, useState } from "react";
import { Alert, Button, Col, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Row from 'react-bootstrap/Row';
import { AuthContext } from "../../context/AuthContext";
import { addNewChat } from "../../services/ChatService";

export const NewChatPopUp = ({ modalShow, handleClose }) => {
  const authContext = useContext(AuthContext);

  const [error, setError] = useState("");

  const handleAddChat = async (e) => {
    e.preventDefault();

    const chatName = e.target[0].value;
    const chatImage = e.target[1].files[0];

    try {
      await addNewChat(chatName, authContext.currentUser.uid, chatImage);
    } catch (error) {
      setError(error);
    }
  };

  return (
    <Modal show={ modalShow } onHide={ handleClose }>
      <Modal.Header closeButton>
        <Modal.Title>Add new chat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleAddChat}>
          <Form.Group className="mb-3">
            <Form.Label className="mb-2">Name</Form.Label>
            <Form.Control
              id="name"
              type="text"
              className="shadow-sm rounded-4"
              name="name"
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="mb-2">Image</Form.Label>
            <Form.Control
              id="image"
              type="file"
              className="form-control shadow-sm rounded-4"
              name="password"
            />
          </Form.Group>
          <Row>
            <Col className="d-flex gap-2">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" onClick={handleClose}>
                Add
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        { error &&
          <Alert variant="danger">
            { error }
          </Alert>
        }
      </Modal.Footer>
    </Modal>
  );
};
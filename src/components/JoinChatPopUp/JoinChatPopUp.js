import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Form from "react-bootstrap/Form";
import Row from 'react-bootstrap/Row';
import { ActiveChatContext } from "../../context/ActiveChatContext";
import { AuthContext } from "../../context/AuthContext";
import { joinChat } from "../../services/ChatService";
import { ChatBarJoin } from "../ChatBar/ChatBarJoin";

export const JoinChatPopUp = ({ modalShow, handleClose, othersChats }) => {
  const authContext = useContext(AuthContext);
  const activeChatContext = useContext(ActiveChatContext);

  const [error, setError] = useState("");
  const [availableChats, setAvailableChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState({});

  const handleJoinChat = async (e) => {
    e.preventDefault();

    try {
      await joinChat(selectedChat?.id, authContext.currentUser)
      .then(() => activeChatContext.setActiveChat(selectedChat));
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    if (authContext.currentUser.uid) {
      setAvailableChats(
        othersChats.filter(
          (chat) => !chat?.data?.members.includes(authContext.currentUser.uid)
        )
      );
    }
  }, [othersChats]);

  return (
    <Modal show={ modalShow } onHide={ handleClose }>
      <Modal.Header closeButton>
        <Modal.Title>Join chat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="scroll-accordion">
          { availableChats?.map((chat) => (
            <ChatBarJoin
              key={ chat.id }
              chat={ chat }
              selectedChat={ selectedChat }
              setSelectedChat={ setSelectedChat }
            />
          )) }
        </div>
        <Form onSubmit={ handleJoinChat }>
        <Row>
          <Col className="d-flex gap-2">
            <Button variant="secondary" onClick={ handleClose }>
              Cancel
            </Button>
            <Button type="submit" variant="primary" onClick={ handleClose }>
              Join
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
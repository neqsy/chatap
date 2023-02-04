import React, { useContext } from "react";
import { Col } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";
import Message from "../Message/Message";
import MessageType from "../Message/MessageType";
import "./style.css";

export const Chat = ({ messages }) => {
  const authContext = useContext(AuthContext);

  return (
    <Col xs lg="12" className="chat p-4">
      { messages.map((message) => (
        <Message
          key={ message.sentAt }
          message={ message }
          type={
            message?.type === "notification"
              ? MessageType.NOTIFICATION
              : authContext?.currentUser?.uid === message?.sentBy
              ? MessageType.MY
              : MessageType.USERS
          }
        />
      )) }
    </Col>
  );
};

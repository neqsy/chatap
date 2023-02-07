import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import Message from "../Message/Message";
import MessageType from "../Message/MessageType";
import "./style.css";

export const Chat = ({ messages }) => {
  const authContext = useContext(AuthContext);

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div>
      { messages.map((message, index) => (
        <div key={ message.sentAt.nanoseconds }>
          <Message
            message={ message }
            type={
              message?.type === "notification"
                ? MessageType.NOTIFICATION
                : authContext?.currentUser?.uid === message?.sentBy
                ? MessageType.MY
                : MessageType.USERS
            }
          />
          <span ref={ messagesEndRef } />
        </div>
      )) }
    </div>
  );
};

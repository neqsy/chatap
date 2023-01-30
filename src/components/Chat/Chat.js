import React, { useContext, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import Message from '../Message/Message';
import MessageType from '../Message/MessageType';

export const Chat = ({ chat, messages, setMessages }) => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    console.log(messages[0]?.type)
  }, [messages])
  
  return (
    <Col>
      { messages.map(message => 
        <Message 
          message={ message }
          type={ message?.type === "notification" ? MessageType.NOTIFICATION :  MessageType.MY }
        />
      )}
    </Col>
  )
}

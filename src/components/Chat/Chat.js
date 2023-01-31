import React, { useContext, useEffect } from 'react';
import { Col } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import Message from '../Message/Message';
import MessageType from '../Message/MessageType';
import './style.css';

export const Chat = ({ chat, messages, setMessages }) => {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    console.log(messages[0]?.type)
  }, [messages])
  
  return (
    <Col xs lg='12' className='chat p-4 overflow-scroll'>
      { messages.map(message => 
        <Message
          message={ message }
          type={ message?.type === "notification" ? MessageType.NOTIFICATION : (authContext?.currentUser?.uid === message?.sentBy ? MessageType.MY : MessageType.USERS) }
        />
      )}
    </Col>
  )
}

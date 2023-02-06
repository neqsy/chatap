import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { useSpeechRecognition } from 'react-speech-recognition';
import { ActiveChatContext } from "../../context/ActiveChatContext";
import { AuthContext } from '../../context/AuthContext';
import { sendMessage, startListening } from "../../services/ChatService";
import MessageType from '../Message/MessageType';

export const MessageInput = () => {
  const authContext = useContext(AuthContext);
  const activeChatContext = useContext(ActiveChatContext);

  const [textMessage, setTextMessage] = useState("");

    // Speech Recognition //
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    speechRecognitionStart,
    speechRecognitionStop
  } = useSpeechRecognition();
  
  const handleSetMessage = (e) => {
    resetTranscript();
    setTextMessage(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageText = e.target[0].value;

    const messageDocRef = await sendMessage(activeChatContext?.activeChat?.id, messageText, MessageType.MESSAGE, authContext?.currentUser?.uid);

    resetMessageInput();
  };

  const resetMessageInput = () => {
    if(transcript) 
      resetTranscript();
    setTextMessage("");
  }

  useEffect(() => {
    setTextMessage(transcript);
  }, [transcript]);

  return (
    <Form onSubmit={handleSendMessage} className="m-auto">
      <Col
        className="d-flex gap-4 justify-content-center align-items-center"
        style={{ height: "10vh" }}
      >
        <Form.Control
          id="message"
          type="text"
          className="shadow-sm rounded-4"
          name="name"
          placeholder="..."
          value={ textMessage }
          onChange={ handleSetMessage }
        />
        <Button
          disabled={ browserSupportsSpeechRecognition || isMicrophoneAvailable ? false : true }
          variant={ listening ? "success" : "info" }
          onTouchStart={ startListening }
          onMouseDown={ startListening }
          onTouchEnd={ speechRecognitionStart }
          onMouseUp={ speechRecognitionStop }
        >
          <i className="fa-solid fa-microphone"></i>
        </Button>
        <Button type="submit" variant="primary">
          Send
        </Button>
      </Col>
    </Form>
  );
};
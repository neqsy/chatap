import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { useSpeechRecognition } from 'react-speech-recognition';
import { ActiveChatContext } from "../../context/ActiveChatContext";
import { AuthContext } from '../../context/AuthContext';
import { sendMessage, startListening, stopListening } from "../../services/ChatService";
import { uploadFileToStorage } from "../../services/Helpers";
import MessageType from '../Message/MessageType';

export const MessageInput = () => {
  const authContext = useContext(AuthContext);
  const activeChatContext = useContext(ActiveChatContext);

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  // Speech Recognition //
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable
  } = useSpeechRecognition();

  useEffect(() => {
    setText(transcript);
  }, [transcript]);
  
  const handleSetText = (e) => {
    resetTranscript();
    setText(e.target.value);
  };

  const handleSetImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (image != null) {
      const imagePath = "chatImageMessages/" + authContext?.currentUser?.uid;
      const date = new Date();
      const imageName = date.toISOString();
      try {
      const imageURL = await uploadFileToStorage(imagePath, imageName, image);
      await sendMessage(activeChatContext.activeChat?.id, imageURL, MessageType.IMAGE, authContext?.currentUser?.uid)
      } catch (err) {
        console.log(err);
      }
    }
    if (text != "") {
      try {
        await sendMessage(activeChatContext.activeChat?.id, text, MessageType.TEXT, authContext?.currentUser?.uid);
      } catch (err) {
        console.log(err);
      }
    }
      
    resetInput();
  };

  const resetInput = () => {
    if(transcript) 
      resetTranscript();
    setText("");
    setImage(null);
  }

  return (
    <Form onSubmit={ handleSendMessage } className="d-flex w-100 px-2">
      <Col className="d-flex justify-content-center align-items-center gap-2">
        <Form.Control
          id="text"
          type="text"
          className="shadow-sm rounded-4"
          placeholder="Type something..."
          value={ text }
          onChange={ handleSetText }
        />
        <Button
          disabled={ browserSupportsSpeechRecognition && isMicrophoneAvailable ? false : true }
          variant={ listening ? "success" : "info" }
          onTouchStart={ startListening }
          onMouseDown={ startListening }
          onTouchEnd={ stopListening }
          onMouseUp={ stopListening }
        >
          <i className="fa-solid fa-microphone"></i>
        </Button>
        <Form.Group>
          <Form.Control
            id="image"
            type="file"
            accept="image/png, image/gif, image/jpeg"
            style={ { display: "none" } }
            onChange={ handleSetImage }
          />
          <Form.Label
            htmlFor="image"
            className={"btn btn-info my-0 " + (image ? "border-success" : "border-none")}
          >
            <i className="fa-solid fa-image"></i>
          </Form.Label>
        </Form.Group>
        <Button type="submit" variant="primary">
          Send
        </Button>
      </Col>
    </Form>
  );
};
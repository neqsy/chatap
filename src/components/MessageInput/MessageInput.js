import React from "react";
import { Button, Col, Form } from "react-bootstrap";

export const MessageInput = ({
  startListening,
  textMessage,
  setTextMessage,
  handleSendMessage,
  browserSupportsSpeechRecognition,
  isMicrophoneAvailable,
  listening,
  speechRecognitionStart,
  speechRecognitionStop,
  resetTranscript,
}) => {
  const handleSetMessage = (e) => {
    resetTranscript();
    setTextMessage(e.target.value);
  };

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
          disabled={ browserSupportsSpeechRecognition || isMicrophoneAvailable ? true : false }
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
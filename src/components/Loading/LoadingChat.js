import React from "react";
import { Col } from 'react-bootstrap';
import "./style.css";

export const LoadingChat = () => {
  return (
    <Col xs lg="12" className="d-flex align-items-center justify-content-center">
      <span className="chat-loader"></span>
    </Col>
    
  )
}

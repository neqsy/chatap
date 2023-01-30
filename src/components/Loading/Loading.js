import React from 'react';
import { Container } from 'react-bootstrap';
import './style.css';

export const Loading = () => {
  return (
    <Container fluid className='d-flex align-items-center vh-100'>
      <span className='loader'></span>
    </Container>
  )
}
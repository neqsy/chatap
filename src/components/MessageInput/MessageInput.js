import React from 'react';
import { Button, Col, Form } from 'react-bootstrap';

export const MessageInput = ({ handleSendMessage }) => {
  
  return (
    <Form onSubmit={ handleSendMessage } className='m-auto'>
      <Col className='d-flex gap-4 justify-content-center align-items-center' style={{ height: '10vh' }}>
          <Form.Control id="message" type="text" className="shadow-sm rounded-4" name="name" placeholder='...'/>
        <Button type="submit" variant="primary">
          Send
        </Button>     
      </Col>
    </Form>
  )
}

import React from 'react';
import { Button, Col, Form } from 'react-bootstrap';

export const MessageInput = ({ handleSendMessage }) => {
  
  return (
    <Form onSubmit={ handleSendMessage }>
      <Col className='d-flex gap-4'>
          <Form.Control id="message" type="text" className="shadow-sm rounded-4" name="name" placeholder='...'/>
        <Button type="submit" variant="primary">
          Send
        </Button>     
      </Col>
    </Form>
  )
}

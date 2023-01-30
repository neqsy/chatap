import { doc } from 'firebase/firestore';
import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { db } from '../../firebase';
import ButtonCustom from '../ButtonCustom/ButtonCustom';

export const MessageInput = ({ handleSendMessage }) => {
  
  return (
    <Row className='bg-white d-flex p-5 align-items-center'>
        <Form onSubmit={ handleSendMessage }>
          <Col className='d-flex flex-grow-1'>
              <Form.Control id="message" type="text" className="shadow-sm rounded-4" name="name"/>
          </Col>
          <Col className='d-flex justify-content-end'>
            <Button type="submit" variant="primary">
              Send
            </Button>     
          </Col>
        </Form>
    </Row>
  )
}

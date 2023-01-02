import React from 'react';
import { Col, Row } from 'react-bootstrap';
import RoundedImg from '../RoundedImg/RoundedImg';
import RoundedImgSize from '../RoundedImg/RoundedImgSIze';
import TextInfo from '../TextInfo/TextInfo';
import TextInfoType from '../TextInfo/TextInfoType';
import MessageType from './MessageType';
import './style.css';

export default function Message({ user, message, type }) {
  return (
    <Row className={ `d-flex p-2 ${type === MessageType.USERS && 'flex-row-reverse'}` }>
      <Col className='flex-grow-1'>
      </Col>
      <Col className={`d-flex flex-grow-1 gap-1 align-items-center ${type === MessageType.MY && 'flex-row-reverse'}`}>
        <Row className='d-flex m-4'>
          <RoundedImg 
            imgUrl={ 'test' } 
            size={ RoundedImgSize.LARGE }  
            altText={ 'test' } 
          />
        </Row>
        <Row className='flex-grow-1'>
        {
          type === MessageType.MY ?
          <div className='message-my p-2'>
            <p>{ message }</p>
          </div>
          :
          <div className='message-users p-2'>
            <p>{ message }</p>
          </div>
        }
        <small className='p-2'>Today 12:49 PM</small>
        </Row>
      </Col>
    </Row>
  )
}

import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { getUserById } from '../../services/ChatService';
import RoundedImg from '../RoundedImg/RoundedImg';
import RoundedImgSize from '../RoundedImg/RoundedImgSIze';
import TextInfo from '../TextInfo/TextInfo';
import TextInfoType from '../TextInfo/TextInfoType';
import MessageType from './MessageType';
import './style.css';

export default function Message({ message, type }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      return await getUserById(message?.sentBy);
    }

    fetchUser().then((data) => setUser(data));
  }, [message])
  

  return (
    <Row className={ `d-flex p-2 ${type === MessageType.USERS && 'flex-row-reverse'}` }>
      <Col className='flex-grow-1'>
      </Col>
      <Col className={`d-flex flex-grow-1 gap-1 align-items-center ${type === MessageType.MY && 'flex-row-reverse'}`}>
        <Row className='d-flex m-2'>
          <RoundedImg 
            imgUrl={ user?.photoURL } 
            size={ RoundedImgSize.LARGE }  
            altText={ user?.displayName } 
          />
        </Row>
        <Row className='flex-grow-1'>
        {
          type === MessageType.MY &&
          <div className='message-my p-2'>
            <p>{ message?.text }</p>
          </div>
        }
        { type === MessageType.USERS &&
          <div className='message-users p-2'>
            <p>{ message?.text }</p>
          </div>
        }
        { type === MessageType.NOTIFICATION &&
          <div className='message-notification p-2'>
            <p>{ message?.text }</p>
          </div>
        }
        <small className='p-2'>{ message?.date }</small>
        </Row>
      </Col>
    </Row>
  )
}

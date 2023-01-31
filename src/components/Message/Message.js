import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { getUserById } from '../../services/ChatService';
import RoundedImg from '../RoundedImg/RoundedImg';
import RoundedImgSize from '../RoundedImg/RoundedImgSIze';
import TextInfo from '../TextInfo/TextInfo';
import { TextInfoColor, TextInfoType } from '../TextInfo/TextInfoType';
import MessageType from './MessageType';
import './style.css';

export default function Message({ message, type }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      return await getUserById(message?.sentBy).then((res) => setUser(res.data()));
    }

    console.log(new Date(message?.sentAt?.seconds * 1000));

    fetchUser();
  }, [message])
  
  const getMessageDate = () => {
    const currentDate = new Date();
    const messageDate = new Date(message?.sentAt?.seconds * 1000);

    if(messageDate.getFullYear() === currentDate.getFullYear() && messageDate.getMonth() === currentDate.getMonth() && messageDate.getDate() === currentDate.getDate())
      return `Today at ${String(messageDate.getHours()).padStart(2, '0')}:${String(messageDate.getMinutes()).padStart(2, '0')}`
    else
      return `${String(messageDate.getDate()).padStart(2, '0')}.${String(messageDate.getMonth() + 1).padStart(2, '0')}.${messageDate.getFullYear()}`;
  }

  return (
    <Row className={ `d-flex p-2 ${type === MessageType.USERS && 'flex-row-reverse'}` }>
      {type === MessageType.NOTIFICATION ? 
        <div className='message-notification p-2'>
          <small className='message'>{ message?.text }</small>
        </div>
      :
      <>
        <Col className='flex-grow-1'>
        </Col>
        <Col className={`d-flex flex-grow-1 gap-5 align-items-center ${type === MessageType.MY && 'flex-row-reverse'}`}>
          <Row className='d-flex'>
            <Col>
              <RoundedImg 
                imgUrl={ user?.photoURL } 
                size={ RoundedImgSize.SMALL }  
                altText={ 'User avatar' } 
              />
            </Col>
          </Row>
          <Row className='flex-grow-1'>
          { type === MessageType.MY &&
            <>
              <div className='message-my p-2'>
                <p className='message'>{ message?.text }</p>
              </div>
              <div className='w-100 p-2 d-flex justify-content-between'>
                <small className='text-end'>{ getMessageDate() }</small>
                <small className='text-start'>{ `${user?.displayName}` }</small>
              </div>
            </>
          }
          { type === MessageType.USERS &&
          <>
            <div className='message-users p-2'>
              <p className='message'>{ message?.text }</p>
            </div>
            <div className='w-100 p-2 d-flex justify-content-between'>
                <small>{ `${user?.displayName}` }</small>
                <small>{ getMessageDate() }</small>
            </div>
          </>
          }
          </Row>
        </Col>
      </>
      }
    </Row>
  )
}

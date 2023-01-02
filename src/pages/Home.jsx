import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import ButtonCustom from '../components/ButtonCustom/ButtonCustom';
import { ButtonCustomColor, ButtonCustomType } from '../components/ButtonCustom/ButtonCustomProps';
import Message from '../components/Message/Message';
import MessageType from '../components/Message/MessageType';
import RoundedImg from '../components/RoundedImg/RoundedImg';
import RoundedImgSize from '../components/RoundedImg/RoundedImgSIze';
import SearchBar from '../components/SearchBar/SearchBar';
import TextInfo from '../components/TextInfo/TextInfo';
import TextInfoType from '../components/TextInfo/TextInfoType';

const Home = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState([]);
  
    return (
      <Container className='d-flex flex-column vh-100' fluid>
        <Row>
          <Col xs lg='3' className='bg-blue-dark d-flex align-items-center p-4'>
            <Col xs lg='4'>
              <h2 className='font-white'><strong>chatap</strong></h2>
            </Col>
            <Col className='d-flex align-items-center gap-2'>
              <RoundedImg 
                imgUrl={ 'test' } 
                size={ RoundedImgSize.SMALL } 
                altText={ 'test' } />
              <TextInfo
                textTop={ 'test top' }
                textBottom={ 'test bottom' }
                type={ TextInfoType.USER }
              />
            </Col>
            <Col xs lg='2'>
              <ButtonCustom
                text={ 'Logout' }
                type={ ButtonCustomType.SQUARED } 
                buttonColor={ ButtonCustomColor.GREY }
              />
            </Col>
          </Col>
          <Col className='bg-blue d-flex align-items-center p-4'>
            <h2 className='font-white'>{ 'current chat' }</h2>
          </Col>
        </Row>
        <Row className='d-flex flex-grow-1 h-100'>
          <Col xs lg='3' className='bg-blue d-flex flex-column p-4 h-100'>
            <Row>
              <Col>
                <SearchBar />
              </Col>
            </Row>
            <Row className='p-4 d-flex flex-grow-1'>
              <Col className='d-flex align-items-start gap-2'>
                <RoundedImg 
                  imgUrl={ 'test' } 
                  size={ RoundedImgSize.LARGE }  
                  altText={ 'test' } 
                />
                <TextInfo
                  textTop={ 'Chat name' }
                  textBottom={ 'last message...' }
                  type={ TextInfoType.CHAT }
                />
              </Col>
            </Row>
            <Row className='d-flex flex-column'>
              <Col>
                <ButtonCustom
                  text={ 'Add chat' }
                  type={ ButtonCustomType.SQUARED } 
                  buttonColor={ ButtonCustomColor.BLUE }
                />              
              </Col>
            </Row>
          </Col>
          <Col className='bg-blue-light d-flex flex-column'>
            <Row className='d-flex flex-grow-1'>
              <Col>
                <Message 
                  message={ 'test message my' }
                  type={ MessageType.MY }
                />
                <Message 
                  message={ 'test message users' }
                  type={ MessageType.USERS }
                />
              </Col>
            </Row>
            <Row className='bg-white d-flex p-5 align-items-center'>
              <Col className='d-flex flex-grow-1'>
                There will be the input for message
              </Col>
              <Col className='d-flex justify-content-end'>
                <ButtonCustom
                  text={ 'Send message' }
                  type={ ButtonCustomType.ROUNDED } 
                  buttonColor={ ButtonCustomColor.BLUE }
                />  
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
};

export default Home;

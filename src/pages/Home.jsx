import { signOut } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Accordion, Col, Container, Row } from 'react-bootstrap';
import ButtonCustom from '../components/ButtonCustom/ButtonCustom';
import { ButtonCustomColor, ButtonCustomType } from '../components/ButtonCustom/ButtonCustomProps';
import { ChatBar } from '../components/ChatBar/ChatBar';
import { JoinChatPopUp } from '../components/JoinChatPopUp/JoinChatPopUp';
import Message from '../components/Message/Message';
import MessageType from '../components/Message/MessageType';
import { NewChatPopUp } from '../components/NewChatPopUp/NewChatPopUp';
import RoundedImg from '../components/RoundedImg/RoundedImg';
import RoundedImgSize from '../components/RoundedImg/RoundedImgSIze';
import SearchBar from '../components/SearchBar/SearchBar';
import TextInfo from '../components/TextInfo/TextInfo';
import { TextInfoColor, TextInfoType } from '../components/TextInfo/TextInfoType';
import { AuthContext } from '../context/AuthContext';
import { auth, db } from '../firebase';
import { logOut } from '../services/AuthService';
import { openChat } from '../services/ChatService';
import './style.css';

const Home = () => {
  const authContext = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [availableChats, setAvailableChats] = useState([]);
  const [chats, setChats] = useState([]);
  const [userChats, setUserChats] = useState([]);
  const [activeChat, setActiveChat] = useState([]);
  const [user, setUser] = useState();
  const [modalShowAdd, setModalshowAddd] = useState(false);
  const [modalShowJoin, setModalshowJoin] = useState(false);

  // Handlers //
  // const handleModalClose = () => setModalshow(false);
  // const handleModalShow = () => setModalshow(true);
  // const handleOpenChat = (chatId) => {
  //   openChat(chatId).then(data => {
  //     setActiveChat(data);
  //   })
  // }

  const fetchData = async (fetchFunction) => {
    try {
      const data = await fetchFunction();
      console.log("res",data)
      return data;
    } catch(err) {
      throw err;
    }
  }

  useEffect(() => {
    if(authContext.currentUser.uid) {
    const
      getAvailableChatsQuery = query(collection(db, "chats"), where("userId", "!=", authContext.currentUser.uid ), where("members", "array-contains", authContext.currentUser.uid)),
      getAllChatsQuery = query(collection(db, "chats"), where("userId", "!=", authContext.currentUser.uid )),
      getUserChatsQuery = query(collection(db, "chats"), where("userId", "==", authContext.currentUser.uid ));
    
    onSnapshot(getAvailableChatsQuery, (querySnapshot) => {
      setAvailableChats(querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
    });

    onSnapshot(getAllChatsQuery, (querySnapshot) => {
      setChats(querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
    });

    onSnapshot(getUserChatsQuery, (querySnapshot) => {
      setUserChats(querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
    });

    setIsLoading(false);
  }
  }, [authContext]);
  
  return (
  isLoading ? <>Loading...</>:
    <>
      <NewChatPopUp modalShow={ modalShowAdd } handleClose={ () => setModalshowAddd(false) } />
      <JoinChatPopUp modalShow={ modalShowJoin } handleClose={ () => setModalshowJoin(false) } chats={ chats }></JoinChatPopUp>
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
                textTop={ authContext.currentUser.displayName }
                textBottom={ '' }
                type={ TextInfoType.USER }
                fontColor={ TextInfoColor.WHITE }
              />
            </Col>
            <Col xs lg='2'>
              <ButtonCustom
                text={ 'Logout' }
                type={ ButtonCustomType.SQUARED } 
                buttonColor={ ButtonCustomColor.GREY }
                onClick={ logOut }
              />
            </Col>
          </Col>
          <Col className='bg-blue d-flex align-items-center p-4'>
            <h2 className='font-white'>{ 'current chat' }</h2>
          </Col>
        </Row>
        <Row className='d-flex flex-grow-1'>
          <Col xs lg='3' className='bg-blue d-flex flex-column p-4'>
            <Row className='h-60'>
              <Col>
                <SearchBar />
              </Col>
            </Row>
            <Row className='pt-4 d-flex flex-grow-1'>
              <Col className='chats-container'>
              <Accordion defaultActiveKey={['0']} alwaysOpen>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>All Chats</Accordion.Header>
                  <Accordion.Body>
                    {availableChats?.map(chat =>
                      <ChatBar key={ chat.id } chat={ chat } activeChat={ activeChat } setActiveChat={ setActiveChat } />
                    )} 
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>My Chats</Accordion.Header>
                  <Accordion.Body>
                    {userChats?.map(chat =>
                      <ChatBar key={ chat.id } chat={ chat } activeChat={ activeChat } setActiveChat={ setActiveChat } />
                    )} 
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              </Col>
            </Row>
            <Row className='d-flex flex-row'>
              <Col>
                <ButtonCustom
                  text={ 'Add chat' }
                  type={ ButtonCustomType.SQUARED } 
                  buttonColor={ ButtonCustomColor.BLUE }
                  onClick={ () => setModalshowAddd(true) }
                />              
              </Col>
              <Col>
                <ButtonCustom
                  text={ 'Join chat' }
                  type={ ButtonCustomType.SQUARED } 
                  buttonColor={ ButtonCustomColor.BLUE }
                  onClick={ () => setModalshowJoin(true) }
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
    </>
  );
};

export default Home;

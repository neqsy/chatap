import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { Accordion, Col, Container, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Chat } from '../components/Chat/Chat';
import { ChatBar } from '../components/ChatBar/ChatBar';
import { JoinChatPopUp } from '../components/JoinChatPopUp/JoinChatPopUp';
import { Loading } from '../components/Loading/Loading';
import { MessageInput } from '../components/MessageInput/MessageInput';
import { NewChatPopUp } from '../components/NewChatPopUp/NewChatPopUp';
import RoundedImg from '../components/RoundedImg/RoundedImg';
import RoundedImgSize from '../components/RoundedImg/RoundedImgSIze';
import SearchBar from '../components/SearchBar/SearchBar';
import TextInfo from '../components/TextInfo/TextInfo';
import { TextInfoColor, TextInfoType } from '../components/TextInfo/TextInfoType';
import { APP_NAME } from '../constants';
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { logOut } from '../services/AuthService';
import { uploadFileToStorage } from '../services/Helpers';
import './style.css';

const Home = () => {
  const authContext = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [availableChats, setAvailableChats] = useState([]);
  const [chats, setChats] = useState([]);
  const [userChats, setUserChats] = useState([]);
  const [activeChat, setActiveChat] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [modalShowAdd, setModalshowAddd] = useState(false);
  const [modalShowJoin, setModalshowJoin] = useState(false);

  // Handlers //

  useEffect(() => {
    if(authContext.currentUser.uid) {
      console.log("currusr", authContext.currentUser)
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
  
  useEffect(() => {
    if(activeChat.id) {
      const messagesRef = doc(db, "chatMessages", activeChat?.id);
      const getChatMessages = query(collection(messagesRef, "messages"), orderBy("sentAt", "asc"));

      onSnapshot(getChatMessages, (querySnapshot) => {
        setChatMessages(querySnapshot.docs.map(doc => (doc.data() )));
      });      
    }
  }, [activeChat])

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageText = e.target[0].value;
    const messagePhoto = e.target[1].file;
    const messagesRef = collection(db, "chatMessages", activeChat?.id, "messages");

    console.log("SENDING")
    try {
      const res = await addDoc(messagesRef, {
        sentAt: new Date(),
        sentBy: authContext?.currentUser?.uid,
        text: messageText,
      })
      if(messagePhoto) {
      await uploadFileToStorage(`chatImageMessages`, res?.data?.uid, messagePhoto).then(async (downloadURL) => { 
        await updateDoc(res, {
          photoURL: downloadURL
        });
    
      });
    }
    } catch(err) {
      console.log(err);
    }
    e.target[0].value = '';
  }

  return (
    isLoading 
    ? 
    <Loading />
    :
    <>
      <NewChatPopUp 
        modalShow={ modalShowAdd } 
        handleClose={ () => setModalshowAddd(false) } 
      />
      <JoinChatPopUp 
        modalShow={ modalShowJoin } 
        handleClose={ () => setModalshowJoin(false) } 
        chats={ chats } 
      />
      <Container className='d-flex flex-column vh-100' fluid>
        <Row style={{ height: '10vh' }}>
          <Col xs lg='3' className='bg-blue-dark d-flex align-items-center p-4'>
            <Col xs lg='4'>
              <h2 className='font-white font-weight-bold'>
                { APP_NAME }
              </h2>
            </Col>
            <Col className='d-flex align-items-center justify-content-center gap-2'>
              <RoundedImg 
                imgUrl={ authContext?.currentUser?.photoURL } 
                size={ RoundedImgSize.SMALL } 
                altText={ 'User Avatar' } />
              <TextInfo
                textTop={ authContext?.currentUser?.displayName }
                textBottom={ '' }
                type={ TextInfoType.USER }
                fontColor={ TextInfoColor.WHITE }
              />
            </Col>
            <Col xs lg='2' className='d-flex align-items-end justify-content-end'>
              <Button
                variant='secondary'
                onClick={ logOut }
              >
                Logout
              </Button>
            </Col>
          </Col>
          <Col className='bg-blue d-flex align-items-center p-4'>
            <h2 className='font-white'>
              { activeChat?.data?.name }
            </h2>
          </Col>
        </Row >
        <Row style={{ height: '90vh' }}>
          <Col 
            xs 
            lg='3' 
            className='bg-blue d-flex flex-column p-4'
          >
            <Row>
              <Col>
                <SearchBar />
              </Col>
            </Row>
            <Row className='pt-4 d-flex'>
              <Col className='chats-container'>
              <Accordion
                defaultActiveKey={['0', '1']} 
                alwaysOpen
              >
                <Accordion.Item eventKey='0'>
                  <Accordion.Header>
                    All chats
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className='scroll-accordion'>
                      {availableChats?.map(chat =>
                        <ChatBar 
                          key={ chat.id } 
                          chat={ chat } 
                          activeChat={ activeChat } 
                          setActiveChat={ setActiveChat } 
                        />
                      )}
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey='1'>
                  <Accordion.Header>
                    My chats
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className='scroll-accordion'>
                      {userChats?.map(chat =>
                        <ChatBar 
                          key={ chat.id } 
                          chat={ chat } 
                          activeChat={ activeChat } 
                          setActiveChat={ setActiveChat } 
                        />
                      )} 
                    </div>
                  </Accordion.Body>
                </Accordion.Item>              
              </Accordion>
              </Col>
            </Row>
            <Row className='h-100'>
              <Col className='d-flex align-items-end justify-content-between'>
                <Button
                  variant='info'
                  className='bg-blue-accent border-0 font-white'
                  onClick={ () => setModalshowAddd(true) }
                >
                  Add chat
                </Button>             
                <Button
                  variant='info'
                  className='bg-blue-accent border-0 font-white '
                  onClick={ () => setModalshowJoin(true) }
                >
                  Join chat
                </Button>              
              </Col>
            </Row>
          </Col>
          <Col
            xs 
            lg='9' 
            className='bg-blue-light d-flex flex-column'
          >
            <Row className='d-flex flex-grow-1'>
              <Chat chat={ activeChat } messages={ chatMessages } />
            </Row>
            <Row className='bg-white d-flex align-items-center'>
              <MessageInput handleSendMessage={ handleSendMessage }/>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;

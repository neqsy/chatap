import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { Accordion, Col, Container, Row } from 'react-bootstrap';
import ButtonCustom from '../components/ButtonCustom/ButtonCustom';
import { ButtonCustomColor, ButtonCustomType } from '../components/ButtonCustom/ButtonCustomProps';
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
      const getChatMessages = query(collection(messagesRef, "messages"));

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
  }

  return (
    isLoading 
    ? 
    <Loading />
    :
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
                imgUrl={ authContext.currentUser.photoURL } 
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
            <h2 className='font-white'>{ activeChat?.data?.name }</h2>
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
              <Chat chat={ activeChat } messages={ chatMessages } />
              {/* <Col> */}
                {/* <Message 
                  message={ 'test message my' }
                  type={ MessageType.MY }
                />
                <Message 
                  message={ 'test message users' }
                  type={ MessageType.USERS }
                /> */}
              {/* </Col> */}
            </Row>
            <MessageInput handleSendMessage={ handleSendMessage }/>
            {/* <Row className='bg-white d-flex p-5 align-items-center'>
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
            </Row> */}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;

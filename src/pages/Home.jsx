import { onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Chat } from "../components/Chat/Chat";
import { ChatBar } from "../components/ChatBar/ChatBar";
import { JoinChatPopUp } from "../components/JoinChatPopUp/JoinChatPopUp";
import { Loading } from "../components/Loading/Loading";
import { LoadingChat } from '../components/Loading/LoadingChat';
import MessageType from "../components/Message/MessageType";
import { MessageInput } from "../components/MessageInput/MessageInput";
import { NewChatPopUp } from "../components/NewChatPopUp/NewChatPopUp";
import RoundedImg from "../components/RoundedImg/RoundedImg";
import RoundedImgSize from "../components/RoundedImg/RoundedImgSIze";
import SearchBar from "../components/SearchBar/SearchBar";
import TextInfo from "../components/TextInfo/TextInfo";
import { TextInfoColor, TextInfoType } from "../components/TextInfo/TextInfoType";
import { APP_NAME } from "../constants";
import { AuthContext } from "../context/AuthContext";
import { logOut } from "../services/AuthService";
import { leaveChat, prepareGetChatsQueries, prepareGetMessagesQuery, sendMessage, startListening } from "../services/ChatService";
import { searchChats } from "../services/Helpers";
import "./style.css";

const Home = () => {
  const authContext = useContext(AuthContext);
  
  // Speech Recognition //
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();
  
  // States //
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  const [joinedChats, setJoinedChats] = useState([]);
  const [filteredJoinedChats, setfilteredJoinedChats] = useState([]);
  const [userChats, setUserChats] = useState([]);
  const [filteredUserChats, setfilteredUserChats] = useState([]);
  const [othersChats, setOthersChats] = useState([]);
  const [activeChat, setActiveChat] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [modalShowAdd, setModalshowAddd] = useState(false);
  const [modalShowJoin, setModalshowJoin] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Effects //
  useEffect(() => {
    if (authContext.currentUser.uid) {
      getChats();
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if(joinedChats.length)
      setActiveChat(joinedChats[0]);
  }, [joinedChats])
  
  useEffect(() => {
    setIsLoadingChat(true);
    if (activeChat.id)
      onSnapshot(prepareGetMessagesQuery(activeChat.id), (querySnapshot) => {
        setChatMessages(querySnapshot.docs.map((doc) => doc.data()));
      });

      setIsLoadingChat(false);
  }, [activeChat]);

  useEffect(() => {
    setTextMessage(transcript);
  }, [transcript]);

  useEffect(() => {
    if(searchKeyword.length && joinedChats.length && userChats.length) {
      setfilteredJoinedChats(searchChats(searchKeyword, joinedChats));
      setfilteredUserChats(searchChats(searchKeyword, userChats));
    }
  }, [searchKeyword]);

  const getChats = () => {
    const queries = prepareGetChatsQueries(authContext.currentUser.uid);

    onSnapshot(queries.getJoined, (querySnapshot) => {
      setJoinedChats(
        querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
      );
    });

    onSnapshot(queries.getOthers, (querySnapshot) => {
      setOthersChats(
        querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
      );
    });

    onSnapshot(queries.getUser, (querySnapshot) => {
      setUserChats(
        querySnapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }))
      );
    });
  }

  const resetMessageInput = () => {
    if(transcript) 
      resetTranscript();
    setTextMessage("");
  }

  // Handlers //
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const messageText = e.target[0].value;

    const messageDocRef = await sendMessage(activeChat?.id, messageText, MessageType.MESSAGE, authContext?.currentUser?.uid);

    resetMessageInput();
  };

  const handleLeaveChat = async () => {
    await leaveChat(activeChat?.id, authContext?.currentUser)
    .then(() => getChats());
  }

  return isLoading ? (
    <Loading />
  ) : (
    <>
      <NewChatPopUp
        modalShow={ modalShowAdd }
        handleClose={ () => setModalshowAddd(false) }
      />
      <JoinChatPopUp
        modalShow={ modalShowJoin }
        handleClose={ () => setModalshowJoin(false) }
        othersChats={ othersChats }
      />
      <Container className="d-flex flex-column vh-100" fluid>
        <Row className="header-row bg-blue">
          <Col xs lg="3" className="bg-blue-dark d-flex align-items-center p-4">
            <Col xs lg="4">
              <h2 className="font-white font-weight-bold">{ APP_NAME }</h2>
            </Col>
            <Col className="d-flex align-items-center justify-content-center gap-2">
              <RoundedImg
                imgUrl={ authContext?.currentUser?.photoURL }
                size={ RoundedImgSize.SMALL }
                altText={ "User Avatar" }
              />
              <TextInfo
                textTop={ authContext?.currentUser?.displayName }
                textBottom={ "" }
                type={ TextInfoType.USER }
                fontColor={ TextInfoColor.WHITE }
              />
            </Col>
            <Col
              xs
              lg="2"
              className="d-flex align-items-end justify-content-end"
            >
              <Button variant="secondary" onClick={ logOut }>
                Logout
              </Button>
            </Col>
          </Col>
          <Col className="d-flex align-items-center p-4">
            <h2 className="font-white">{ activeChat?.data?.name }</h2>
          </Col>
          <Col className="d-flex align-items-center justify-content-end p-4">
            { activeChat?.data?.userId !== authContext?.currentUser?.uid &&
              <Button variant="warning" onClick={ handleLeaveChat }>
                Leave chat
              </Button>
            }
          </Col>
        </Row>
        <Row className="content-row">
          <Col xs lg="3" className="bg-blue d-flex flex-column p-4">
            <Row>
              <Col>
                <SearchBar searchKeyword = { searchKeyword } setSearchKeyword={ setSearchKeyword } />
              </Col>
            </Row>
            <Row className="pt-4 d-flex">
              <Col className="h-100">
                <Accordion defaultActiveKey={["0", "1"]} alwaysOpen>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>All chats</Accordion.Header>
                    <Accordion.Body>
                      <div className="scroll-accordion">
                        { (searchKeyword.length ? filteredJoinedChats : joinedChats)?.map((chat) => (
                          <ChatBar
                            key={ chat.id }
                            chat={ chat }
                            activeChat={ activeChat }
                            setActiveChat={ setActiveChat }
                          />
                        )) }
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>My chats</Accordion.Header>
                    <Accordion.Body>
                      <div className="scroll-accordion">
                        { (searchKeyword.length ? filteredUserChats : filteredUserChats)?.map((chat) => (
                          <ChatBar
                            key={ chat.id }
                            chat={ chat }
                            activeChat={ activeChat }
                            setActiveChat={ setActiveChat }
                          />
                        )) }
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>
            <Row className="h-100">
              <Col className="d-flex align-items-end justify-content-between">
                <Button
                  variant="info"
                  className="bg-blue-accent border-0 font-white"
                  onClick={ () => setModalshowAddd(true) }
                >
                  Add chat
                </Button>
                <Button
                  variant="info"
                  className="bg-blue-accent border-0 font-white "
                  onClick={ () => setModalshowJoin(true) }
                >
                  Join chat
                </Button>
              </Col>
            </Row>
          </Col>
          <Col xs lg="9" className="bg-blue-light d-flex flex-column">
            <Row className="d-flex flex-grow-1">
              { isLoadingChat
                ? <LoadingChat />
                : <Chat chat={ activeChat } messages={ chatMessages } />
              }
            </Row>
            <Row className="bg-white d-flex align-items-center">
              <MessageInput
                resetTranscript={ resetTranscript }
                textMessage={ textMessage }
                startListening={ startListening }
                setTextMessage={ setTextMessage }
                handleSendMessage={ handleSendMessage }
                browserSupportsSpeechRecognition={ browserSupportsSpeechRecognition }
                isMicrophoneAvailable={ isMicrophoneAvailable }
                listening={ listening }
                speechRecognitionStart={ SpeechRecognition.startListening }
                speechRecognitionStop={ SpeechRecognition.stopListening }
              />
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
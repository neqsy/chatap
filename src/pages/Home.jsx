import { onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Chat } from "../components/Chat/Chat";
import { ChatBar } from "../components/ChatBar/ChatBar";
import { JoinChatPopUp } from "../components/JoinChatPopUp/JoinChatPopUp";
import { Loading } from "../components/Loading/Loading";
import { LoadingChat } from '../components/Loading/LoadingChat';
import { MessageInput } from "../components/MessageInput/MessageInput";
import { NewChatPopUp } from "../components/NewChatPopUp/NewChatPopUp";
import RoundedImg from "../components/RoundedImg/RoundedImg";
import RoundedImgSize from "../components/RoundedImg/RoundedImgSIze";
import SearchBar from "../components/SearchBar/SearchBar";
import TextInfo from "../components/TextInfo/TextInfo";
import { TextInfoColor, TextInfoType } from "../components/TextInfo/TextInfoType";
import { APP_NAME } from "../constants";
import { ActiveChatContext } from '../context/ActiveChatContext';
import { AuthContext } from "../context/AuthContext";
import { logOut } from "../services/AuthService";
import { leaveChat, prepareGetChatsQueries, prepareGetMessagesQuery } from "../services/ChatService";
import { searchChats } from "../services/Helpers";
import "./style.css";

const Home = () => {
  const authContext = useContext(AuthContext);
  const activeChatContext = useContext(ActiveChatContext);

  // States //
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  const [joinedChats, setJoinedChats] = useState([]);
  const [filteredJoinedChats, setfilteredJoinedChats] = useState([]);
  const [userChats, setUserChats] = useState([]);
  const [filteredUserChats, setfilteredUserChats] = useState([]);
  const [othersChats, setOthersChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [modalShowAdd, setModalshowAddd] = useState(false);
  const [modalShowJoin, setModalshowJoin] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [emptyChat, setEmptyChat] = useState(true);
  const [lastLeftChat, setLastLeftChat] = useState("");

  // Effects //
  useEffect(() => {
    if (authContext.currentUser.uid) {
      getChats();
    }
  }, []);
  
  useEffect(() => {
    if (joinedChats.length && !activeChatContext.activeChat.id)
      activeChatContext.setActiveChat(joinedChats[0]);
  }, [joinedChats, activeChatContext.activeChat]);

  useLayoutEffect(() => {
    setIsLoadingChat(true);
    if (activeChatContext.activeChat?.id)
      onSnapshot(prepareGetMessagesQuery(activeChatContext.activeChat.id), (querySnapshot) => {
        setChatMessages(querySnapshot.docs.map((doc) => doc.data()));
      });

      setIsLoadingChat(false);
  }, [activeChatContext.activeChat]);

  useEffect(() => {
    if(searchKeyword.length && joinedChats.length && userChats.length) {
      setfilteredJoinedChats(searchChats(searchKeyword, joinedChats));
      setfilteredUserChats(searchChats(searchKeyword, userChats));
    }
  }, [searchKeyword]);

  useEffect(() => {
    joinedChats.length 
      ? setEmptyChat(false)
      : setEmptyChat(true);
  }, [joinedChats.length]);
  
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
    setIsLoading(false);
  }

  // Handlers //
  const handleLeaveChat = async () => {
    await leaveChat(activeChatContext.activeChat?.id, authContext?.currentUser)
    .then(() => activeChatContext.setActiveChat([]));
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
      <Container className="d-flex flex-column content-container" fluid>
        <Row className="header-row bg-blue">
          <Col xs="12" sm="6" lg="3" className="bg-blue-dark p-4">
            <Row>
              <Col xs lg="12" xl="3" className="d-flex align-items-center">
                <h3 className="h3 font-white font-weight-bold">{ APP_NAME }</h3>
              </Col>
              <Col xs lg="8" xl="6" className="d-flex align-items-center justify-content-start gap-2">
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
                lg="4"
                xl="3"
                className="d-flex align-items-center justify-content-end"
              >
                <Button variant="secondary" onClick={ logOut }>
                  Logout
                </Button>
              </Col>
            </Row>
          </Col>
          <Col className="d-flex align-items-center p-4">
            <h2 className="font-white">{ activeChatContext.activeChat?.data?.name }</h2>
          </Col>
          <Col className="d-flex align-items-center justify-content-end p-4">
            { activeChatContext.activeChat?.data?.userId !== authContext?.currentUser?.uid &&
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
                          />
                        )) }
                      </div>
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>My chats</Accordion.Header>
                    <Accordion.Body>
                      <div className="scroll-accordion">
                        { (searchKeyword.length ? filteredUserChats : userChats)?.map((chat) => (
                          <ChatBar
                            key={ chat.id }
                            chat={ chat }
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
                && <LoadingChat />
              }
              { emptyChat ? 
                  <p className="align-self-center text-center">Join some chats!</p>
                : <Chat messages={ chatMessages } />
              }
            </Row>
            <Row className="bg-white d-flex align-items-center">
              <MessageInput />
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
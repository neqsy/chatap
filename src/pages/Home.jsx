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
  const [showMobileMenu, setShowMobileMenu] = useState(true);

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
    joinedChats.length || userChats.length
      ? setEmptyChat(false)
      : setEmptyChat(true);
  }, [joinedChats.length, activeChatContext.activeChat]);
  
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
    .then(() => activeChatContext.setActiveChat(userChats.length ? userChats[0] : []));
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
      <Container className="vh-100 d-flex flex-column content-container" fluid>
        <Row xs="12" sm="12" md="12" lg="12" xl="12" xxl="12" className="bg-blue header-row d-flex">
          <Col xs="12" sm="12" md="4" lg="4" xl="4" xxl="4" className="d-flex gap-2 bg-blue-dark align-items-center justify-content-between px-4 py-2">
            <h3 className="font-white">{ APP_NAME }</h3>
            <div className="d-flex flex-column align-items-center justify-content-center">
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
            </div>
            <Button variant="secondary" onClick={ logOut }>
              Logout
            </Button>
            <Button className="mobile-menu--button" variant="info" onClick={ () => setShowMobileMenu(!showMobileMenu) }>
              <i className="fa fa-bars" aria-hidden="true"></i>
            </Button>
          </Col>
          <Col xs sm md lg="8" xl="8" xxl="8" className="d-flex align-items-center justify-content-between p-4">
            <h2 className="font-white">{ activeChatContext.activeChat?.data?.name }</h2>
            { activeChatContext.activeChat?.data?.userId !== authContext?.currentUser?.uid &&
              <Button variant="warning" onClick={ handleLeaveChat }>
                Leave chat
              </Button>
            }
          </Col>
        </Row>
        <Row xs="12" sm="12" md="12" lg="12" xl="12" xxl="12" className="content-row d-flex">
          <Col xs="12" sm="12" md="4" lg="4" xl="4" xxl="4" className={`d-flex flex-column justify-content-around gap-4 px-4 py-4 h-100 mobile-menu ${showMobileMenu ? 'd-block' : 'd-none'}`}>
            <SearchBar searchKeyword = { searchKeyword } setSearchKeyword={ setSearchKeyword } />
            <div className="h-100">
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
            </div>
            <div className="d-flex justify-content-between">
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
            </div>
          </Col>
          <Col xs="12" sm="12" md="8" lg="8" xl="8" xxl="8" className="bg-blue-light d-flex flex-column h-100">
            <div className="h-100 chat-scroll">
              { isLoadingChat
                && <LoadingChat />
              }
              { emptyChat ? 
                  <p className="h-100 d-flex justify-content-center align-items-center">Join some chats!</p>
                : <Chat messages={ chatMessages } />
              }
            </div>
            <div className="d-flex message-input--container">
              <MessageInput emptyChat={ emptyChat } />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
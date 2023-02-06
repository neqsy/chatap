import React, { useContext, useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import { ActiveChatContext } from "../../context/ActiveChatContext";
import RoundedImg from "../RoundedImg/RoundedImg";
import RoundedImgSize from "../RoundedImg/RoundedImgSIze";
import TextInfo from "../TextInfo/TextInfo";
import { TextInfoColor, TextInfoType } from "../TextInfo/TextInfoType";
import "./style.css";

export const ChatBar = ({ chat }) => {
  const activeChatContext = useContext(ActiveChatContext);

  const [isActive, setIsActive] = useState(false);

  const handleSelectChat = (e) => {
    activeChatContext.setActiveChat(chat);
  };

  useEffect(() => {
    activeChatContext.activeChat?.id === chat?.id ? setIsActive(true) : setIsActive(false);
  }, [activeChatContext.activeChat]);

  return (
    <div
      className={ `rounded p-2 chat-bar ${isActive ? "active" : ""}` }
      key={ chat?.id }
      onClick={ handleSelectChat }
    >
      <Col className="d-flex align-items-start gap-2">
        <RoundedImg
          imgUrl={ chat?.data?.photoURL }
          size={ RoundedImgSize.LARGE }
          altText={ "Chat Avatar" }
        />
        <TextInfo
          textTop={ chat?.data?.name }
          textBottom={ chat?.data?.lastMessage }
          type={ TextInfoType.CHAT }
          fontColor={ TextInfoColor }
        />
      </Col>
    </div>
  );
};
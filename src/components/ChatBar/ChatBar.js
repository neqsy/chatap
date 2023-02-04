import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import RoundedImg from "../RoundedImg/RoundedImg";
import RoundedImgSize from "../RoundedImg/RoundedImgSIze";
import TextInfo from "../TextInfo/TextInfo";
import { TextInfoColor, TextInfoType } from "../TextInfo/TextInfoType";
import "./style.css";

export const ChatBar = ({ chat, activeChat, setActiveChat }) => {
  const [isActive, setIsActive] = useState(false);

  const handleSelectChat = (e) => {
    setActiveChat(chat);
  };

  useEffect(() => {
    activeChat?.id === chat?.id ? setIsActive(true) : setIsActive(false);
  }, [activeChat]);

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
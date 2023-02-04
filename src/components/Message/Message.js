import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { getUserById } from "../../services/ChatService";
import { getMessageDate } from "../../services/Helpers";
import RoundedImg from "../RoundedImg/RoundedImg";
import RoundedImgSize from "../RoundedImg/RoundedImgSIze";
import MessageType from "./MessageType";
import "./style.css";

export default function Message({ message, type }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      return await getUserById(message?.sentBy).then((res) =>
        setUser(res.data())
      );
    };

    if(type !== MessageType.NOTIFICATION)
      fetchUser();
  }, [message]);

  return (
    <Row
      className={`d-flex p-2 ${ type === MessageType.USERS && "flex-row-reverse" }`}
    >
      { type === MessageType.NOTIFICATION ? (
        <div className="message-notification p-2">
          <small className="message">{ message?.text }</small>
        </div>
      ) : (
        <>
          <Col className="flex-grow-1"></Col>
          <Col
            className={`d-flex flex-grow-1 gap-5 align-items-center ${
              type === MessageType.MY && "flex-row-reverse"
            }`}
          >
            <Row className="d-flex">
              <Col>
                <RoundedImg
                  imgUrl={ user?.photoURL }
                  size={ RoundedImgSize.SMALL }
                  altText={"User avatar"}
                />
              </Col>
            </Row>
            <Row className="flex-grow-1">
              { type === MessageType.MY && (
                <>
                  <div className="message-my p-2">
                    <p className="message">{message?.text}</p>
                  </div>
                  <div className="w-100 p-2 d-flex justify-content-between">
                    <small className="text-end">{ getMessageDate(message?.sentAt?.seconds) }</small>
                    <small className="text-start">{ `${user?.displayName}` }</small>
                  </div>
                </>
              ) }
              { type === MessageType.USERS && (
                <>
                  <div className="message-users p-2">
                    <p className="message">{ message?.text }</p>
                  </div>
                  <div className="w-100 p-2 d-flex justify-content-between">
                    <small>{ `${user?.displayName}` }</small>
                    <small>{ getMessageDate(message?.sentAt?.seconds) }</small>
                  </div>
                </>
              ) }
            </Row>
          </Col>
        </>
      ) }
    </Row>
  );
}
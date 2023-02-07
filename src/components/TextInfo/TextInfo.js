import React from "react";
import { TextInfoType } from "./TextInfoType";

export default function TextInfo({ textTop, textBottom, type, fontColor }) {
  return (
    <div className={ fontColor }>
      <p>{ textTop }</p>
      { type === TextInfoType.USER ? <h5>{textBottom}</h5> : <small>{textBottom}</small> }
    </div>
  );
}
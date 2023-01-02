import React from 'react';
import './style.css';

export default function ButtonCustom({ text, type, buttonColor }) {
  return (
    <button className={ `button-custom button-custom--${type} ${buttonColor.color} ${buttonColor.bgColor}` }>
      { text }
    </button>
  )
}

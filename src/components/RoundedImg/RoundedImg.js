import React from 'react';
import './style.css';

export default function RoundedImg({ imgUrl, size, altTxt }) {
  return (
    <div className={ `rounded-img__container rounded-img__container--${ size }` }>
      <img className='rounded-img' src={ imgUrl } alt={ altTxt } />
    </div>
  )
}

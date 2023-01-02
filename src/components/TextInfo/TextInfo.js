import React from 'react';
import TextInfoType from './TextInfoType';

export default function TextInfo({ textTop, textBottom, type }) {
  return (
    <div className='font-white'>
      <h5>{ textTop }</h5>
      {
        type === TextInfoType.USER ? 
        <h5>{ textBottom }</h5>
        :
        <p>{ textBottom }</p>
      }
    </div>
  )
}

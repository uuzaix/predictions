import React from 'react';
import { LogOutButton } from './buttons';

export const Header = (props) => (
  props.main
    ?
    <div className="header">
      <div className="whitespace-left"></div>
      <h1 className="title text-center">{props.text}</h1>
      <LogOutButton logout={props.logout} />
    </div>
    :
    <div className="header">
      <button className="badge btn-close" onClick={props.handleCloseEdit}><i className="fa fa-arrow-left fa-2x" aria-hidden="true"></i></button>
      <h1 className="title text-center">{props.text}</h1>
      <div className="whitespace-right"></div>
    </div>
)

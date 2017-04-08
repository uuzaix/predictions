import React from 'react';
import { LogOutButton } from './buttons';

export const Header = (props) =>
  <div className="header">
    {props.main
      ? <LogOutButton logout={props.logout} />
      : <button className="badge btn-close" onClick={props.handleCloseEdit}><i className="fa fa-arrow-left fa-2x" aria-hidden="true"></i></button>
    }
    <h1 className="title text-center">{props.text}</h1>

  </div>
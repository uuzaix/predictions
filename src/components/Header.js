import React from 'react';
import { LogOutButton } from './buttons';

export const Header = ({ logout, text }) =>
  <div className="header">
    <h1 className="title text-center">{text}</h1>
    <LogOutButton logout={logout} />
  </div>
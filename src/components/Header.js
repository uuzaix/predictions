import React from 'react';
import { LogOutButton } from './buttons';

export const Header = ({ logout }) =>
  <div className="header">
    <h1 className="title text-center">Predictions</h1>
    <LogOutButton logout={logout} />
  </div>
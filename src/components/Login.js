import React from 'react';

import { providerGithub, providerGoogle, providerTwitter } from '../firebase';
import { LoginButton } from './buttons';

export const Login = ({ login, handleSignUp, handleLogIn }) =>
  <div className="login">
    <h1 className="text-center">Predictions</h1>
    <h3 className="text-center">Keep track of your predictions and calibrate yourself</h3>
    <LoginButton login={login} provider={providerGithub} providerName="Github" />
    <LoginButton login={login} provider={providerGoogle} providerName="Google" />
    <LoginButton login={login} provider={providerTwitter} providerName="Twitter" />
    <div>Work in progres...</div>
    <button className="btn-login" onClick={() => handleSignUp()}>Sign Up with email</button>
    <button className="btn-login" onClick={() => handleLogIn()}>LogIn with email</button>
  </div>
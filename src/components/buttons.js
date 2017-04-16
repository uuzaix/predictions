import React from 'react';

export const LoginButton = ({ login, provider, providerName }) => {
  return (
    <button className={"btn-login " + providerName} onClick={() => login(provider)}>
      <i className={"fa fa-" + providerName.toLowerCase() + " fa-lg"} aria-hidden="true"></i>
      Login with {providerName}
    </button>
  )
}
export const SignUpButton = ({ handleSignUp }) => {
  return (
    <button className="btn-login" onClick={() => handleSignUp()}>
      <i className={"fa fa-envelope fa-lg"} aria-hidden="true"></i>
      Sign Up with email
    </button>
  )
}
export const EmailLoginButton = ({ handleLogIn }) => {
  return (
    <button className="btn-login" onClick={() => handleLogIn()}>
      <i className={"fa fa-sign-in fa-lg"} aria-hidden="true"></i>
      Login with email
    </button>
  )
}

export const LogOutButton = ({ logout }) => (
  <button className="btn-logout" onClick={() => logout()}>
    <i className="fa fa-sign-out fa-2x" aria-hidden="true"></i>
  </button>
)

export const DeleteButton = (props) => (
  <button type="button" className="badge btn-delete-card" onClick={() => props.handleConfirmDelete(props.id)}>
    <i className="fa fa-trash fa-lg" aria-hidden="true"></i>
  </button>
)
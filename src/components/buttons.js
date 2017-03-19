import React from 'react';

export const LoginButton = ({ login, provider, providerName }) => (
  <button className={"btn-login " + providerName} onClick={() => login(provider)}>
    {providerName === 'Google' ? <i className="fa fa-google  fa-lg" aria-hidden="true"></i> :
      <i className="fa fa-github fa-lg" aria-hidden="true"></i>}
    Login with {providerName}
  </button>
)

export const LogOutButton = ({ logout }) => (
  <button className="btn-logout" onClick={() => logout()}>
    <i className="fa fa-sign-out fa-2x" aria-hidden="true"></i>
  </button>
)

export const DeleteButton = (props) => (
  <button type="button" className="badge btn-delete-card" onClick={() => props.handleDelete(props.id)}>
    <i className="fa fa-trash fa-lg" aria-hidden="true"></i>
  </button>
)
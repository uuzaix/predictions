import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase'
import { firebaseApp, firebaseAuth, database } from './firebase';

const LoginButton = ({ login }) => (
  <button onClick={() => login()}>Login with GitHub</button>
)

const LogOutButton = ({ logout }) => (
  <button onClick={() => logout()}>Logout</button>
)


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: false
    }
  }

  componentDidMount() {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ auth: true })
      } else {
        this.setState({ auth: false })
      }
    });
  }

  login() {
    const provider = new firebase.auth.GithubAuthProvider();
    firebaseAuth.signInWithPopup(provider).then(result => {
      const user = result.user;
      console.log(user)
    }).catch(function (error) {
      var errorMessage = error.message;
      console.log(errorMessage)
    });
  }

  logout() {
    firebaseAuth.signOut().then(function () {
    }, function (error) {
      console.log(error)
    })
  }

  render() {
    return (
      this.state.auth ?
        <LogOutButton logout={this.logout} /> :
        <LoginButton login={this.login} />
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('root')
)

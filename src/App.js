import R from 'ramda';
import React from 'react';

import { firebaseAuth, database, providerGithub, providerGoogle } from './firebase';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { PredictionsList } from './components/PredictionsList';
import { PredictionForm } from './components/PredictionForm';
import { Statistic } from './components/Statistic';
import { SignUpForm } from './components/SignUpForm';
import { Footer } from './components/Footer';


export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      view: "load",
      showTable: false,
      currentPrediction: {
        title: '', prob: '50', correct: 'unknown'
      },
      predictions: null,
      editing: null,
      editingPrediction: {},
      error: null
    }
    this.handleInputChangeOnAdd = this.handleInputChangeOnAdd.bind(this);
    this.handleSubmitAdd = this.handleSubmitAdd.bind(this);
    this.handleInputChangeOnUpdate = this.handleInputChangeOnUpdate.bind(this);
    this.handleSubmitUpdate = this.handleSubmitUpdate.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleStatClick = this.handleStatClick.bind(this);
    this.handleAddNew = this.handleAddNew.bind(this);
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
    this.handleCloseEdit = this.handleCloseEdit.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.signUp = this.signUp.bind(this);
    this.loginWithEmail = this.loginWithEmail.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleBackToAuth = this.handleBackToAuth.bind(this);
  }

  componentDidMount() {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ view: "main", error: null });
        database.ref('users/' + user.uid).on('value', snapshot => {
          snapshot.val() !== null ?
            this.setState({ predictions: snapshot.val().predictions }) :
            this.setState({ predictions: {} })
        })
      } else {
        this.setState({ view: "auth" })
      }
    });
  }

  handleAddNew() {
    this.setState({ view: "add" })
  }

  handleInputChangeOnAdd(evt) {
    const target = evt.target;
    const value = target.value;
    const name = target.name;
    const newPrediction = Object.assign({}, this.state.currentPrediction, { [name]: value })
    this.setState({ currentPrediction: newPrediction })
  }

  // handleSelect({ name, value }) {
  //   const newPrediction = Object.assign({}, this.state.currentPrediction, { [name]: value })
  //   this.setState({ currentPrediction: newPrediction })
  // }

  handleSubmitAdd(evt) {
    evt.preventDefault();
    const path = 'users/' + firebaseAuth.currentUser.uid + '/predictions';
    const newPredKey = database.ref().child(path).push().key;
    const date = new Date().getTime();
    const newPrediction = Object.assign({}, this.state.currentPrediction, { date })
    database.ref().update({ [path + '/' + newPredKey]: newPrediction });
    this.setState({ view: "main", currentPrediction: { title: '', prob: '50', correct: 'unknown' } })
  }

  handleInputChangeOnUpdate(evt) {
    const target = evt.target;
    const value = target.value;
    const name = target.name;
    const newPrediction = Object.assign({}, this.state.editingPrediction, { [name]: value })
    this.setState({ editingPrediction: newPrediction })
  }

  handleSubmitUpdate(evt) {
    evt.preventDefault();
    const path = 'users/' + firebaseAuth.currentUser.uid + '/predictions/' + this.state.editing;
    database.ref().update({ [path]: this.state.editingPrediction });
    this.setState({ view: "main", editing: null, editingPrediction: {} })
  }

  handleConfirmDelete(key) {
    const path = 'users/' + firebaseAuth.currentUser.uid + '/predictions/' + key;
    database.ref().child(path).remove();
    this.setState({ view: "main", editing: null, editingPrediction: {} })
  }

  handleEdit(key) {
    this.setState({ view: "edit", editing: key, editingPrediction: this.state.predictions[key] })
  }

  handleStatClick() {
    this.setState({ showTable: !this.state.showTable })
  }

  handleCloseEdit() {
    this.setState({ view: "main", editing: null, editingPrediction: {}, currentPrediction: { title: '', prob: '50', correct: 'unknown' } })
  }

  handleSignUp() {
    this.setState({ view: "signUp", error: null })
  }

  handleLogIn() {
    this.setState({ view: "logIn", error: null })
  }

  handleBackToAuth() {
    this.setState({ view: "auth", error: null })
  }


  signUp(email, password) {
    firebaseAuth.createUserWithEmailAndPassword(email, password).catch(error => {
      const errorMessage = error.message;
      this.setState({ error: errorMessage })
      console.log(errorMessage);
    });
  }

  loginWithEmail(email, password) {
    firebaseAuth.signInWithEmailAndPassword(email, password).catch(error => {
      const errorMessage = error.message;
      this.setState({ error: errorMessage })
      console.log(errorMessage);
    });
  }

  login(provider) {
    firebaseAuth.signInWithPopup(provider).then(result => {
      const user = result.user;
    }).catch(error => {
      var errorMessage = error.message;
      this.setState({ error: errorMessage })
      console.log(errorMessage)
    });
  }

  logout() {
    firebaseAuth.signOut().then(() => {
    }, error => {
      this.setState({ error: errorMessage })
      console.log(error)
    })
  }

  render() {
    switch (this.state.view) {
      case "load":
        return <div>Loading...</div>

      case "auth":
        return <Login login={this.login} handleSignUp={this.handleSignUp} handleLogIn={this.handleLogIn} error={this.state.error} />

      case "signUp":
        return <div>
          <Header
            text="Predictions"
            main={false}
            handleCloseEdit={this.handleBackToAuth} />
          <SignUpForm signUp={this.signUp} view="Sign Up" error={this.state.error} />
          <Footer />
        </div>

      case "logIn":
        return <div>
          <Header
            text="Predictions"
            main={false}
            handleCloseEdit={this.handleBackToAuth} />
          <div className="container">
            <SignUpForm signUp={this.loginWithEmail} view="Log In" error={this.state.error} />
          </div>
          <Footer />
        </div>

      case "main":
        return <div>
          <Header logout={this.logout} text="Predictions" main={true} />
          <div className="container">
            <div className="btn-add pointer" onClick={() => this.handleAddNew()}>
              <span className="fa-stack fa-2x">
                <i className="fa fa-circle fa-stack-2x icon-background"></i>
                <i className="fa fa-plus fa-stack-1x"></i>
              </span>
            </div>
            <PredictionsList
              predictions={this.state.predictions}
              handleConfirmDelete={this.handleConfirmDelete}
              editing={this.state.editing}
              handleUpdate={this.handleUpdate}
              handleUpdateSubmit={this.handleUpdateSubmit}
              handleEdit={this.handleEdit}
              editingPrediction={this.state.editingPrediction} />
            <Statistic
              predictions={this.state.predictions}
              showTable={this.state.showTable}
              handleStatClick={this.handleStatClick} />
          </div>
          <div className="whitespace"></div>
          <Footer />
        </div>


      case "add":
        return <div>
          <Header
            logout={this.logout}
            text="Add prediction"
            main={false}
            handleCloseEdit={this.handleCloseEdit} />
          <div className="container">
            <PredictionForm
              prediction={this.state.currentPrediction}
              handleInputChange={this.handleInputChangeOnAdd}
              handleSubmit={this.handleSubmitAdd}
              edit={false} />
          </div>
        </div>

      case "edit":
        return <div>
          <Header
            logout={this.logout}
            text="Edit prediction"
            main={false}
            handleCloseEdit={this.handleCloseEdit} />
          <div className="container">
            <PredictionForm
              id={this.state.editing}
              prediction={this.state.editingPrediction}
              handleInputChange={this.handleInputChangeOnUpdate}
              handleSubmit={this.handleSubmitUpdate}
              handleConfirmDelete={this.handleConfirmDelete}
              edit={true} />
          </div>
        </div>
    }
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(function (reg) {
      // registration worked
      console.log('Registration succeeded. Scope is ' + reg.scope);
    }).catch(function (error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
}
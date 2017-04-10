import R from 'ramda';
import React from 'react';

import { firebaseAuth, database, providerGithub, providerGoogle } from './firebase';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { PredictionsList } from './components/PredictionsList';
import { PredictionForm } from './components/PredictionForm';
import { Statistic } from './components/Statistic';


export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      view: "load",
      showTable: true,
      currentPrediction: {
        title: '', prob: '50', correct: 'unknown'
      },
      predictions: null,
      editing: null,
      editingPrediction: {}
    }
    this.handleInputChangeOnAdd = this.handleInputChangeOnAdd.bind(this);
    this.handleSubmitAdd = this.handleSubmitAdd.bind(this);
    this.handleInputChangeOnUpdate = this.handleInputChangeOnUpdate.bind(this);
    this.handleSubmitUpdate = this.handleSubmitUpdate.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleStatClick = this.handleStatClick.bind(this);
    this.handleAddNew = this.handleAddNew.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCloseEdit = this.handleCloseEdit.bind(this);
  }

  componentDidMount() {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ view: "main" });
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

  handleDelete(key) {
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

  login(provider) {
    firebaseAuth.signInWithPopup(provider).then(result => {
      const user = result.user;
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
    switch (this.state.view) {
      case "load":
        return <div>Loading...</div>

      case "auth":
        return <Login login={this.login} />

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
              handleDelete={this.handleDelete}
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
              handleDelete={this.handleDelete}
              edit={true} />
          </div>
        </div>
    }
  }
}

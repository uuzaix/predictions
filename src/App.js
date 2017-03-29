import R from 'ramda';
import React from 'react';

import { firebaseAuth, database, providerGithub, providerGoogle } from './firebase';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { PredictionsList } from './components/PredictionsList';
import { PredictionForm } from './components/PredictionForm';
import { Statistic } from './components/Statistic';
import { EditPrediction } from './components/Modal';


export class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: false,
      loading: true,
      showTable: true,
      adding: false,
      currentPrediction: {
        title: '', prob: '50', correct: 'unknown'
      },
      predictions: null,
      editing: null,
      editingPrediction: {}
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleAddNew = this.handleAddNew.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.handleStatClick = this.handleStatClick.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  componentDidMount() {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ auth: true, loading: false });
        database.ref('users/' + user.uid).on('value', snapshot => {
          snapshot.val() !== null ?
            this.setState({ predictions: snapshot.val().predictions }) :
            this.setState({ predictions: {} })
        })
      } else {
        this.setState({ auth: false, loading: false })
      }
    });
  }

  onClickOutside() {
    this.setState({ editing: null, editingPrediction: {} })
  }

  handleAddNew() {
    this.setState({ adding: true })
  }

  handleInputChange(evt) {
    const target = evt.target;
    const value = target.value;
    const name = target.name;
    const newPrediction = Object.assign({}, this.state.currentPrediction, { [name]: value })
    this.setState({ currentPrediction: newPrediction })
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const path = 'users/' + firebaseAuth.currentUser.uid + '/predictions';
    const newPredKey = database.ref().child(path).push().key;
    const date = new Date().getTime();
    const newPrediction = Object.assign({}, this.state.currentPrediction, { date })
    database.ref().update({ [path + '/' + newPredKey]: newPrediction });
    this.setState({ adding: false, currentPrediction: { title: '', prob: '50', correct: 'unknown' } })
  }

  handleUpdate(evt) {
    const target = evt.target;
    const value = target.value;
    const name = target.name;
    const newPrediction = Object.assign({}, this.state.editingPrediction, { [name]: value })
    this.setState({ editingPrediction: newPrediction })
  }

  handleUpdateSubmit(evt) {
    evt.preventDefault();
    const path = 'users/' + firebaseAuth.currentUser.uid + '/predictions/' + this.state.editing;
    database.ref().update({ [path]: this.state.editingPrediction });
    this.setState({ editing: null, editingPrediction: {} })
  }

  handleDelete(key) {
    const path = 'users/' + firebaseAuth.currentUser.uid + '/predictions/' + key;
    database.ref().child(path).remove();
    this.setState({ editing: null, editingPrediction: {} })
  }

  handleEdit(key) {
    this.setState({ editing: key, editingPrediction: this.state.predictions[key] })
  }

  handleStatClick() {
    this.setState({ showTable: !this.state.showTable })
  }

  handleCloseModal() {
    this.setState({ editing: null, editingPrediction: {}, adding: false, currentPrediction: { title: '', prob: '50', correct: 'unknown' } })
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
    return (
      this.state.loading ?
        <div>Loading...</div> :
        this.state.auth ?
          <div>
            <Header logout={this.logout} />
            <div className="container">
              {/*<PredictionForm
                handleInputChange={this.handleInputChange}
                handleSubmit={this.handleSubmit}
                currentPrediction={this.state.currentPrediction}
                edit={false} />*/}
              <button onClick={() => this.handleAddNew()}>Add new Prediction</button>
              <EditPrediction
                showModal={this.state.adding}
                currentPrediction={this.state.currentPrediction}
                handleCloseModal={this.handleCloseModal}
                handleUpdate={this.handleInputChange}
                handleUpdateSubmit={this.handleSubmit}
                edit={false} />
              <PredictionsList
                predictions={this.state.predictions}
                handleDelete={this.handleDelete}
                editing={this.state.editing}
                handleUpdate={this.handleUpdate}
                handleUpdateSubmit={this.handleUpdateSubmit}
                handleEdit={this.handleEdit}
                onClickOutside={this.onClickOutside}
                editingPrediction={this.state.editingPrediction} />
              <Statistic
                predictions={this.state.predictions}
                showTable={this.state.showTable}
                handleStatClick={this.handleStatClick} />
              <EditPrediction
                showModal={this.state.editing !== null}
                id={this.state.editing}
                currentPrediction={this.state.editingPrediction}
                handleCloseModal={this.handleCloseModal}
                handleUpdate={this.handleUpdate}
                handleUpdateSubmit={this.handleUpdateSubmit}
                handleDelete={this.handleDelete}
                edit={true} />
            </div>
          </div> :
          <Login login={this.login} />
    )
  }
}
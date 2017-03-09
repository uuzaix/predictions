import R from 'ramda';
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

const PredictionForm = (props) => (
  <form onSubmit={props.handleSubmit}>
    <label>
      Title:
    <input type='text'
        name="title"
        onChange={props.handleInputChange}
        value={props.currentPrediction.title}
        placeholder="It will rain tomorrow"
        required />
    </label>
    <label>
      Probability
      <select name="prob" onChange={props.handleInputChange} value={props.currentPrediction.prob}>
        <option value="50">50%</option>
        <option value="60">60%</option>
        <option value="70">70%</option>
        <option value="80">80%</option>
        <option value="90">90%</option>
        <option value="95">95%</option>
        <option value="97">97%</option>
        <option value="99">99%</option>
      </select>
    </label>
    <label>
      Correct?
    <input type='checkbox' name="correct" onChange={props.handleInputChange} checked={props.currentPrediction.correct} />
    </label>
    <input type='submit' value='Submit' />
  </form>
)

const renderPredictions = R.compose(
  R.map(
    ([i, { title, prob, correct }]) =>
      <li key={i}>{title} {prob} {correct ? 'correct' : 'incorrect'}</li>
  ),
  R.toPairs
)

const PredictionsList = ({ predictions }) => {
  return predictions !== null ? (
    <ul>
      {renderPredictions(predictions)}
    </ul>
  ) : <div>Loading...</div>
}

const calcStat = R.compose(
  R.map(
    ([prob, data]) => {
      console.log(prob, R.sum(data) / data.length);
      return (
        <p key={prob}>{prob + ' - ' + (R.sum(data) / data.length * 100) + '%'}</p>
      )
    }
  ), R.toPairs)


const Statistics = ({ predictions }) => {
  let stat = {}
  R.compose(
    R.forEach(
      ([i, { title, prob, correct }]) => {
        if (stat.hasOwnProperty(prob)) {
          stat[prob] = correct ? [...stat[prob], 1] : [...stat[prob], 0]
        } else {
          stat[prob] = correct ? [1] : [0]
        }
      }
    ),
    R.toPairs)(predictions)
  return (
    <div>{calcStat(stat)}</div>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: false,
      currentPrediction: {},
      predictions: null
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ auth: true });
        database.ref('users/' + user.uid).on('value', snapshot => {
          this.setState({ predictions: snapshot.val().predictions })

        })
      } else {
        this.setState({ auth: false })
      }
    });
  }

  handleInputChange(evt) {
    const target = evt.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    const newPrediction = Object.assign({}, this.state.currentPrediction, { [name]: value })
    this.setState({ currentPrediction: newPrediction })
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const path = 'users/' + firebaseAuth.currentUser.uid + '/predictions';
    const newPredKey = database.ref().child(path).push().key;
    database.ref().update({ [path + '/' + newPredKey]: this.state.currentPrediction });
    this.setState({ currentPrediction: { title: '', prob: '', correct: false } })
  }

  login() {
    const provider = new firebase.auth.GithubAuthProvider();
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
      this.state.auth ?
        <div>
          <LogOutButton logout={this.logout} />
          <PredictionForm handleInputChange={this.handleInputChange}
            handleSubmit={this.handleSubmit}
            currentPrediction={this.state.currentPrediction} />
          <PredictionsList predictions={this.state.predictions} />
          <Statistics predictions={this.state.predictions} />
        </div> :
        <LoginButton login={this.login} />
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

import R from 'ramda';
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase'
import { firebaseApp, firebaseAuth, database, providerGithub, providerGoogle } from './firebase';

const LoginButton = ({ login, provider, providerName }) => (
  <button onClick={() => login(provider)}>Login with {providerName}</button>
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
    <select type='checkbox' name="correct" onChange={props.handleInputChange} value={props.currentPrediction.correct}>
        <option value="uknown">Uknown</option>
        <option value="correct">Correct</option>
        <option value="incorrect">Incorrect</option>
      </select>
    </label>
    <input type='submit' value='Submit' />
  </form >
)

const renderPredictions = (handleDelete, filter) => R.compose(
  R.map(
    ([i, { title, prob, correct }]) =>
      <li key={i}>{title} {prob} {correct}
        <button onClick={() => handleDelete(i)}>delete</button>
      </li>
  ),
  R.toPairs,
  R.filter(filter)
)

const PredictionsList = ({ predictions, handleDelete }) => {
  return predictions !== null ? (
    <ul>
      {renderPredictions(handleDelete, R.propEq('correct', 'unknown'))(predictions)}
      {renderPredictions(handleDelete, R.propSatisfies(a => a !== 'unknown', 'correct'))(predictions)}
    </ul>
  ) : <div>Loading...</div>
}

const calcStat = R.compose(
  R.map(
    ([prob, data]) => {
      return (
        <tr key={prob}>
          <td>{prob}</td>
          <td>{data}</td>
        </tr>
      )
    }
  ), R.toPairs)

const groupByProb = R.compose(
  R.map(
    R.compose(
      data => R.sum(data) / data.length * 100,
      R.map(({ correct }) => correct === 'correct' ? 1 : 0)
    )
  ),
  R.groupBy(({ prob }) => prob),
  R.filter(({ correct }) => correct !== 'unknown'),
  R.values)

const Statistics = ({ predictions }) => {
  return (
    <table>
      <thead>
        <tr>
          <td>Probability</td>
          <td>Correctness</td>
        </tr>
      </thead>
      <tbody>
        {calcStat(groupByProb(predictions))}
      </tbody>
    </table>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: false,
      currentPrediction: {
        title: '', prob: '50', correct: 'unknown'
      },
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
    this.setState({ currentPrediction: { title: '', prob: '50', correct: 'unknown' } })
  }

  handleDelete(key) {
    const path = 'users/' + firebaseAuth.currentUser.uid + '/predictions/' + key;
    database.ref().child(path).remove();
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
      this.state.auth ?
        <div>
          <LogOutButton logout={this.logout} />
          <PredictionForm handleInputChange={this.handleInputChange}
            handleSubmit={this.handleSubmit}
            currentPrediction={this.state.currentPrediction} />
          <PredictionsList predictions={this.state.predictions} handleDelete={this.handleDelete} />
          <Statistics predictions={this.state.predictions} />
        </div> :
        <div>
          <LoginButton login={this.login} provider={providerGithub} providerName='Github' />
          <LoginButton login={this.login} provider={providerGoogle} providerName='Google' />
        </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

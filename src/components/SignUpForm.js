import React from 'react';

export class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.handleSignUp(this.state.email, this.state.password);
  }

  render() {
    return (
      <div className="login">
        <h1 className="text-center">Predictions</h1>
        <h2 className="text-center">Work in progress</h2>
        <h2 className="text-center">{this.props.view}</h2>
        <form onSubmit={this.handleSubmit}>
          <label>
            Email:
          <input type="text" name="email" value={this.state.email} onChange={this.handleChange} />
          </label>
          <label>
            Password:
          <input type="text" name="password" value={this.state.password} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
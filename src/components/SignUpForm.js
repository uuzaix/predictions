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
    this.props.signUp(this.state.email, this.state.password);
    this.setState({ password: '' })
  }

  render() {
    return (
      <div className="container-middle">
        <h2 className="text-center">Work in progress</h2>
        <h2 className="text-center">{this.props.view}</h2>
        {this.props.error && <div className="error text-center">Error: {this.props.error}</div>}
        <form onSubmit={this.handleSubmit} className="flex-column">
          <input type="text" name="email" value={this.state.email} size="35" onChange={this.handleChange} placeholder="your@email.com" />
          <input type="password" name="password" value={this.state.password} size="25" onChange={this.handleChange} placeholder="password" />
          <input type="submit" value="Submit" className="btn-login" />
        </form>
      </div>
    );
  }
}
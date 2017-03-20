import { Component, PropTypes } from 'react';
import React from 'react';

import ReactDOM from 'react-dom';

export default class ClickListener extends Component {
  
  constructor(props) {
    super(props);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  handleDocumentClick(evt) {
    const area = ReactDOM.findDOMNode(this.refs.area);

    if (!area.contains(evt.target)) {
      this.props.onClickOutside(evt)
    }
  }

  componentDidMount() {
    document.getElementById('root').addEventListener('click', this.handleDocumentClick)
  }

  componentWillUnmount() {
    document.getElementById('root').removeEventListener('click', this.handleDocumentClick)
  }

  render() {
    return (
      <div ref='area'>
        {this.props.children}
      </div>
    )
  }
}
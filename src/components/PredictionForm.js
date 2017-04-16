import React from 'react';
import R from 'ramda';
import Modal from 'react-modal';

import { DeleteButton } from './buttons';

export class PredictionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { deleting: false };

    this.handleInitDelete = this.handleInitDelete.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  handleInitDelete() {
    this.setState({ deleting: true })
  }

  closeModal() {
    this.setState({ deleting: false });
  }
  render() {
    return (
      <form className="card-form" >
        <div className="card-title">
          <textarea
            className="input"
            type="text"
            name="title"
            rows="3"
            onChange={this.props.handleInputChange}
            value={this.props.prediction.title}
            placeholder="It will rain tomorrow"
            required />
        </div>
        <div className="card-parameters">
          <div className="flex-column prob">
            {
              R.map(val => {
                const applyClassProb = this.props.prediction.prob === val ? "value selected" : "value";
                return (
                  <div
                    key={val}
                    id={"prob" + val}
                    className={"pointer " + applyClassProb}
                    onClick={() => this.props.handleInputChange({ target: { name: 'prob', value: val } })}>
                    {val + '%'}
                  </div>
                )
              },
                ["50", "60", "70", "80", "90", "95", "97", "99"]
              )
            }
          </div>
          <div className="flex-column correctness">
            {
              R.map(val => {
                const applyClass = this.props.prediction.correct === val ? "value selected" : "value";
                return (
                  <div
                    key={val}
                    id={val}
                    className={"pointer " + applyClass}
                    onClick={() => this.props.handleInputChange({ target: { name: 'correct', value: val } })}>
                    {val}
                  </div>
                )
              },
                ["unknown", "correct", "incorrect"]
              )
            }
          </div>
        </div>
        <div className="buttons">
          {this.props.edit &&
            <DeleteButton id={this.props.id} handleConfirmDelete={this.handleInitDelete} />}
          <button onClick={this.props.handleSubmit} className="badge btn-save-card"><i className="fa fa-check-square-o fa-lg" aria-hidden="true"></i></button>
        </div>
        <Modal
          isOpen={this.state.deleting}
          onRequestClose={this.closeModal}
          contentLabel="Confirm Delete"
          className="delete-modal">
          <h3 className="text-center">Do you want to delete this prediction?</h3>
          <div className="card">
            <div className="card-title">
              {this.props.prediction.title}
            </div>
          </div>
          <div className="buttons">
            <DeleteButton id={this.props.id} handleConfirmDelete={this.props.handleConfirmDelete} />
            <button className="badge btn-save-card" onClick={this.closeModal}><i className="fa fa-undo fa-lg" aria-hidden="true"></i></button>
          </div>
        </Modal>
      </form >
    )
  }
}
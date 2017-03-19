import React from 'react';
import { DeleteButton } from './buttons';

export const PredictionForm = (props) => (
  <form className="card card-form" onSubmit={props.handleSubmit}>
    <div className="card-title">
      <input
        className="input"
        type="text"
        name="title"
        onChange={props.handleInputChange}
        value={props.currentPrediction.title}
        placeholder="It will rain tomorrow"
        required />
    </div>
    <div className="card-parameters">
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
      <select type='checkbox' name="correct" onChange={props.handleInputChange} value={props.currentPrediction.correct}>
        <option value="unknown">Unknown</option>
        <option value="correct">Correct</option>
        <option value="incorrect">Incorrect</option>
      </select>
      {props.edit && <DeleteButton id={props.id} handleDelete={props.handleDelete} />}
      <button type='submit' className="badge btn-save-card"><i className="fa fa-check-square-o fa-lg" aria-hidden="true"></i></button>
    </div>
  </form >
)
import React from 'react';

export const Prediction = (props) => {
  return (
    <div key={props.id} className={"card " + props.correct} onClick={() => props.handleEdit(props.id)}>
      <div className="card-title">{props.title}</div>
      <div className="card-parameters">
        {/*<span className="date">{new Date(props.date).toISOString().slice(0, 10)}</span>*/}
        <div className="badge">
          <div className="probability">
            {props.prob}%
          </div>
        </div>
      </div>
    </div >
  )
}
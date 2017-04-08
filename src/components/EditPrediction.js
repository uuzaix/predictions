import React from 'react';

import { PredictionForm } from './PredictionForm';

export const EditPrediction = (props) => (
  <div className="flex-column">
    {props.edit 
      ? <button className="badge btn-close" onClick={props.handleCloseModal}><i className="fa fa-arrow-left fa-2x" aria-hidden="true"></i></button>
      : <button className="badge btn-close" onClick={props.handleCloseModal}><i className="fa fa-times fa-2x" aria-hidden="true"></i></button>
    }
    
    <PredictionForm
      id={props.id}
      handleInputChange={props.handleInputChange}
      handleSubmit={props.handleSubmit}
      prediction={props.prediction}
      handleDelete={props.handleDelete}
      edit={props.edit} />
  </div>
);

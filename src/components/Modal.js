import React from 'react';
import Modal from 'react-modal';

import { PredictionForm } from './PredictionForm';

export const EditPrediction = (props) => (
  <div>
    <Modal
      isOpen={props.showModal}
      contentLabel="Edit Prediction"
      onRequestClose={props.handleCloseModal}
      shouldCloseOnOverlayClick={true}
      style={{ content: { padding: "10px"} }}
    >
      <div className="flex-column">
        <button className="badge btn-close" onClick={props.handleCloseModal}><i className="fa fa-times fa-2x" aria-hidden="true"></i></button>
        <PredictionForm
          id={props.id}
          handleInputChange={props.handleInputChange}
          handleSubmit={props.handleSubmit}
          prediction={props.prediction}
          handleDelete={props.handleDelete}
          edit={props.edit} />
      </div>
    </Modal>
  </div>
);

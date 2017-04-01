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
    >
      <button onClick={props.handleCloseModal}>Close Modal</button>
      <PredictionForm
        id={props.id}
        handleInputChange={props.handleInputChange}
        handleSubmit={props.handleSubmit}
        prediction={props.prediction}
        handleDelete={props.handleDelete}
        edit={props.edit} />
    </Modal>
  </div>
);

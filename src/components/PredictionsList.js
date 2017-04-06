import React from 'react';
import R from 'ramda';

import { Prediction } from './Prediction'
import { PredictionForm } from './PredictionForm'

const renderPredictions = (props, filter) => R.compose(
  R.map(
    ([i, { title, date, prob, correct }]) =>
        <Prediction
          key={i}
          id={i}
          title={title}
          date={date}
          prob={prob}
          correct={correct}
          handleEdit={props.handleEdit} />

  ),
  R.toPairs,
  R.filter(filter)
)

export const PredictionsList = (props) => {
  return props.predictions !== null ? (
    <div>
      {renderPredictions(props, R.propEq('correct', 'unknown'))(props.predictions)}
      {renderPredictions(props, R.propSatisfies(a => a !== 'unknown', 'correct'))(props.predictions)}
    </div>
  ) : <div>Loading...</div>
}
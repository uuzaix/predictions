import React from 'react';

import { PredictionsChart } from './Chart';
import { Table } from './Table';

export const Statistic = ({ showTable, predictions, handleStatClick }) => (
  predictions !== null && (
    <div className='stat' onClick={handleStatClick}>
      {showTable ?
        <Table predictions={predictions} /> :
        <PredictionsChart predictions={predictions} />
      }
    </div>
  )
)

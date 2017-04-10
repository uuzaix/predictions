import React from 'react';
import R from 'ramda';

import { groupByProb, calcTableStat, calcChartStat } from './statCalculations'

export const Table = ({ predictions }) => {
  const data = calcChartStat(groupByProb(predictions));
  return (
    <table className="stat">
      <thead>
        <tr>
          <td>Confidence, %</td >
          <td>Correct predictions, %</td >
        </tr >
      </thead >
      <tbody>
        {
          R.map(line => (
            <tr key={line.conf} >
              <td>{line.conf}</td >
              <td>{line.yours !== undefined ? line.yours.toFixed(0) : ''}</td >
            </tr >
          ), data)
        }
      </tbody >
    </table >
  )
}

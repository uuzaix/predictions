import React from 'react';
import R from 'ramda';

import { groupByProb, calcTableStat, calcChartStat } from './statCalculations'

export const Table = ({ predictions }) => {
  const data = calcChartStat(groupByProb(predictions));
  return (
    <table>
      <thead>
        <tr>
          <td>Probability</td >
          <td>Perfect data</td >
          <td>Correctness</td >
        </tr >
      </thead >
      <tbody>
        {
          R.map(line => (
            <tr key={line.conf} >
              <td>{line.conf}</td >
              <td>{line.perfect}</td >
              <td>{line.yours}</td >
            </tr >
          ), data)
        }
      </tbody >
    </table >
  )
}
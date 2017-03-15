import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import React from 'react';
import R from 'ramda';

const perfectData = [
  { conf: 50, perfect: 50 },
  { conf: 60, perfect: 60 },
  { conf: 70, perfect: 70 },
  { conf: 80, perfect: 80 },
  { conf: 90, perfect: 90 },
  { conf: 95, perfect: 95 },
  { conf: 97, perfect: 97 },
  { conf: 99, perfect: 99 }
];
export const PredictionsChart = ({ data }) => (
  <LineChart width={600} height={300} data={data}
    margin={{ top: 50, right: 50, left: 50, bottom: 50 }}>
    <XAxis dataKey="conf" label="Confidence level" />
    <YAxis label="Correctness" />
    <CartesianGrid strokeDasharray="3 3" />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="yours" stroke="#82ca9d" activeDot={{ r: 8 }} connectNulls={true} />
    <Line type="monotone" dataKey="perfect" stroke="#8884d8" />
  </LineChart>
)

const calcStat = (data) => R.map(
  level => Object.assign({}, level, { yours: data[level.conf] }),
  perfectData)

const groupByProb = R.compose(
  R.map(
    R.compose(
      data => R.sum(data) / data.length * 100,
      R.map(({ correct }) => correct === 'correct' ? 1 : 0)
    )
  ),
  R.groupBy(({ prob }) => prob),
  R.filter(({ correct }) => correct !== 'unknown'),
  R.values)

export const Statistics = ({ predictions }) =>
  <PredictionsChart data={calcStat(groupByProb(predictions))} />







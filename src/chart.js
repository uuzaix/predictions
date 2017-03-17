import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Text } from 'recharts';
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
  <ResponsiveContainer aspect={1.5} width='100%'>
    <LineChart data={data}
      margin={{ top: 10, right: 10, left: 1, bottom: 40 }}>
      <XAxis dataKey="conf" label={<Text dy={40} dx={50} textAnchor="start">Confidence level</Text>} />
      <YAxis label={<Text angle={270} verticalAnchor="start" textAnchor="end" width={300}>Correctness</Text>} />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip labelFormatter={(label) => label + "% confidence level"} />
      <Legend verticalAlign="top" height={36}/>
      <Line type="monotone" name="Your result" unit="%" dataKey="yours" stroke="#82ca9d" activeDot={{ r: 8 }} connectNulls={true} />
      <Line name="Perfect calibration" unit="%" type="monotone" dataKey="perfect" stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
)

const calcStat = (data) => R.map(
  level => Object.assign({}, level, { yours: data[level.conf] }),
  perfectData)

const groupByProb = R.compose(
  R.map(
    R.compose(
      data => (R.sum(data) / data.length * 100).toFixed(2),
      R.map(({ correct }) => correct === 'correct' ? 1 : 0)
    )
  ),
  R.groupBy(({ prob }) => prob),
  R.filter(({ correct }) => correct !== 'unknown'),
  R.values)

export const Statistics = ({ predictions }) =>
  <PredictionsChart data={calcStat(groupByProb(predictions))} />







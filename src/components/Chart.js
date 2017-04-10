import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Text } from 'recharts';
import React from 'react';

import { calcChartStat, groupByProb } from './statCalculations'

export const PredictionsChart = ({ predictions }) => (
  <ResponsiveContainer aspect={1.5} width='100%'>
    <LineChart data={calcChartStat(groupByProb(predictions))}
      margin={{ top: 10, right: 10, left: 1, bottom: 40 }}>
      <XAxis dataKey="conf" label={<Text dy={40} textAnchor="start">Confidence level</Text>} />
      <YAxis label={<Text angle={270} verticalAnchor="start" textAnchor="end" width={300}>Correctness</Text>} />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip labelFormatter={(label) => label + "% confidence level"} />
      <Legend verticalAlign="top" height={36} />
      <Line type="monotone" name="Your result" unit="%" dataKey="yours" stroke="#82ca9d" activeDot={{ r: 8 }} connectNulls={true} />
      <Line name="Perfect calibration" unit="%" type="monotone" dataKey="conf" stroke="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
)


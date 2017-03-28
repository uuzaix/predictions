import React from 'react';
import R from 'ramda';

export const perfectData = [
  { conf: 50, perfect: 50 },
  { conf: 60, perfect: 60 },
  { conf: 70, perfect: 70 },
  { conf: 80, perfect: 80 },
  { conf: 90, perfect: 90 },
  { conf: 95, perfect: 95 },
  { conf: 97, perfect: 97 },
  { conf: 99, perfect: 99 }
];

export const calcChartStat = (data) => R.map(
  level => {
    if (data[level.conf] !== undefined) {
      return Object.assign({}, level, { yours: data[level.conf] })
    } else {
      return level
    }
  },
  perfectData);

export const groupByProb = R.compose(
  R.map(
    R.compose(
      data => (R.sum(data) / data.length * 100).toFixed(2),
      R.map(({ correct }) => correct === 'correct' ? 1 : 0)
    )
  ),
  R.groupBy(({ prob }) => prob),
  R.filter(({ correct }) => correct !== 'unknown'),
  R.values)

/*export const calcTableStat = R.compose(
  R.map(
    ([prob, data]) => {
      return (
        <tr key={prob} >
          <td>{prob}</td >
          <td>{data}</td >
        </tr >
      )
    }
  ), R.toPairs)*/
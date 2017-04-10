import R from 'ramda';
import { describe, it } from 'mocha';
import { expect } from 'chai';

import { calcChartStat, groupByProb, perfectData, calcTableStat } from '../src/components/statCalculations'


describe('groupByProb', () => {

  it('should handle empty object', () => {
    const result = groupByProb({});
    expect(R.isEmpty(result)).to.be.true;
  });

  it('should filter out unknown predictions', () => {
    const predictions = { '1': { correct: "unknown", prob: 50, title: "aaa" }, "2": { correct: "unknown", prob: 60, title: "bbb" }, '3': { correct: "unknown", prob: 60, title: "ccc" } };
    const result = groupByProb(predictions);

    expect(R.isEmpty(result)).to.be.true;
  });

  it('should group by probability', () => {
    const predictions = { '1': { correct: "correct", prob: 50, title: "aaa" }, "2": { correct: "correct", prob: 60, title: "bbb" }, '3': { correct: "incorrect", prob: 60, title: "ccc" }, '4': { correct: "unknown", prob: 50, title: "ddd" } };
    const result = groupByProb(predictions);

    expect(R.keys(result).length).to.be.deep.equal(2);
  });

  it('should calculate prob correctly', () => {
    const predictions = { '1': { correct: "correct", prob: 50, title: "aaa" }, "2": { correct: "correct", prob: 60, title: "bbb" }, '3': { correct: "incorrect", prob: 60, title: "ccc" }, '4': { correct: "incorrect", prob: 60, title: "ddd" } };
    const result = groupByProb(predictions);

    expect(result['50']).to.equal(100);
    expect(result['60']).to.be.closeTo(33.33, 0.01);
    expect(result).to.have.all.keys(['50', '60'])
  });

});

describe('calcStat', () => {

  it('should handle empty object', () => {
    const result = calcChartStat({});
    expect(result).to.deep.equal(perfectData);
  });

  it('should add user result correctly', () => {
    const predictions = { '50': '100' };
    const result = calcChartStat(predictions);
    const expectedResult = [Object.assign({}, perfectData[0], { 'yours': '100' }), ...R.drop(1, perfectData)]
    expect(result).to.be.deep.equal(expectedResult);
  });

});


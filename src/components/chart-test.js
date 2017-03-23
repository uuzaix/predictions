import R from 'ramda';
import { describe, it } from 'mocha';
import { expect } from 'chai';

import { calcStat, groupByProb } from './chart'


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

});


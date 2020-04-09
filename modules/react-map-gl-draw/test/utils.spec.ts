/* eslint-env jest */

import { findClosestPointOnLineSegment, isNumeric } from '../src/edit-modes/utils';
import { Position } from '@nebula.gl/edit-modes';

describe('findClosestPointOnLineSegment', () => {
  it('should return null when point on the line and out of bounds', () => {
    const p1: Position = [1, 0];
    const p2: Position = [0, 0];
    const p: Position = [2, 0];

    const point = findClosestPointOnLineSegment(p1, p2, p);

    expect(point).toBe(null);
  });

  it('should return null when line vertical and point out of bounds', () => {
    const p1: Position = [0, 0];
    const p2: Position = [0, 1];
    const p: Position = [0, 2];

    const point = findClosestPointOnLineSegment(p1, p2, p);

    expect(point).toBe(null);
  });

  it('should return expected when line vertical', () => {
    const p1: Position = [0, 0];
    const p2: Position = [2, 0];
    const p: Position = [1, 1];

    const point = findClosestPointOnLineSegment(p1, p2, p);

    expect(point).toEqual([1, 0]);
  });

  it('should return null when point out of bounds', () => {
    const p1: Position = [1, 0];
    const p2: Position = [3, 5];
    const p: Position = [4, 6];

    const point = findClosestPointOnLineSegment(p1, p2, p);

    expect(point).toBe(null);
  });

  it('should return expected', () => {
    const p1: Position = [1, 0];
    const p2: Position = [3, 5];
    const p: Position = [2, 3];

    const point = findClosestPointOnLineSegment(p1, p2, p);

    expect(point).toEqual([2.1724137931034484, 2.931034482758621]);
  });
});

describe('isNumeric', () => {
  it('should match expect', () => {
    const testCases = [null, undefined, '', 'a', [], [1], '1', '1.1', 1, 1.1];

    const expected = [false, false, false, false, false, false, true, true, true, true];
    const results = testCases.map((t) => isNumeric(t));

    expect(results).toEqual(expected);
  });
});

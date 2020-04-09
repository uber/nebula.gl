import { convertE7Array, toDegree, toRadian } from '../../src/math';

it('test toDegree()', () => {
  expect(toDegree(Math.PI / 4)).toBe(45);
  expect(toDegree(Math.PI / 2)).toBe(90);
  expect(toDegree((Math.PI * 3) / 2)).toBe(270);
});

it('test toRadian()', () => {
  expect(toRadian(45)).toBe(Math.PI / 4);
  expect(toRadian(90)).toBe(Math.PI / 2);
  expect(toRadian(270)).toBe((Math.PI * 3) / 2);
});

it('test convertE7Array()', () => {
  const points = [378034847, -1224078182, 378039091, -1224079046];
  expect(convertE7Array(points)).toEqual([
    [-122.4078182, 37.8034847],
    [-122.4079046, 37.8039091],
  ]);
});

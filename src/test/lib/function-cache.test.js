// @flow-ignore
import FunctionCache from '../../lib/function-cache';

it('test FunctionCache simple', () => {
  const f = jest.fn();
  const fc = new FunctionCache(f);
  expect(f.mock.calls.length).toBe(0);
  fc.call();
  expect(f.mock.calls.length).toBe(1);
  fc.call();
  fc.call();
  fc.call();
  expect(f.mock.calls.length).toBe(1);
});

it('test FunctionCache changed args', () => {
  const f = jest.fn();
  const fc = new FunctionCache(f);
  expect(f.mock.calls.length).toBe(0);
  fc.call(1);
  fc.call(2);
  fc.call(3);
  fc.call(3);
  fc.call(3);
  expect(f.mock.calls.length).toBe(3);
  fc.call(3, 3);
  fc.call(3, 3);
  expect(f.mock.calls.length).toBe(4);
});

it('test FunctionCache edge case', () => {
  const f = jest.fn();
  const fc = new FunctionCache(f);
  expect(f.mock.calls.length).toBe(0);
  fc.call([]);
  fc.call([]);
  fc.call([]);
  expect(f.mock.calls.length).toBe(3);
});

it('test FunctionCache invalidate', () => {
  const f = jest.fn();
  const fc = new FunctionCache(f);
  expect(f.mock.calls.length).toBe(0);
  fc.call();
  expect(f.mock.calls.length).toBe(1);
  fc.invalidate().call();
  expect(f.mock.calls.length).toBe(2);
  fc.call();
  expect(f.mock.calls.length).toBe(2);
  fc.invalidate().call();
  expect(f.mock.calls.length).toBe(3);
});

it('test FunctionCache updateTrigger', () => {
  const f = jest.fn();
  const fc = new FunctionCache(f);
  expect(f.mock.calls.length).toBe(0);
  fc.call();
  expect(f.mock.calls.length).toBe(1);
  fc.updateTrigger(1).call();
  fc.updateTrigger(1).call();
  expect(f.mock.calls.length).toBe(2);
  fc.updateTrigger(2).call();
  expect(f.mock.calls.length).toBe(3);
});

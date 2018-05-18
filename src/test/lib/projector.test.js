// @flow-ignore
import Projector from '../../lib/projector';
import { viewport } from '../mocks';

it('test shouldChangeCenter()', () => {
  const projector = new Projector(viewport);

  let newViewport = Object.assign({}, viewport, {
    latitude: viewport.latitude + 0.01,
    longitude: viewport.longitude + 0.01
  });
  expect(projector.shouldChangeCenter(newViewport)).toBeFalsy();

  newViewport = Object.assign({}, viewport, {
    latitude: viewport.latitude + 1,
    longitude: viewport.longitude
  });
  expect(projector.shouldChangeCenter(newViewport)).toBeTruthy();

  newViewport = Object.assign({}, viewport, {
    latitude: viewport.latitude,
    longitude: viewport.longitude + 1
  });
  expect(projector.shouldChangeCenter(newViewport)).toBeTruthy();
});

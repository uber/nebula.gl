// @flow
import assert from 'assert';
import type { Viewport } from '../types';

// recalculate the deck.gl world center when the viewport moves for some distance
const CHANGE_CENTER_THRESHOLD = 0.03;

export default class Projector {
  // center point we use for calculations
  lngLat: [number, number];

  constructor(viewport: Viewport) {
    this.setCenterFromViewport(viewport);
  }

  setCenterFromViewport({ latitude, longitude }: Viewport) {
    this.lngLat = [longitude, latitude];
  }

  coordsToLngLatOffset = (lngLat: [number, number]): [number, number] => {
    assert(
      Array.isArray(lngLat) && lngLat.length === 2,
      'Bad lngLat provided to coordsToLngLatOffset()'
    );

    return [lngLat[0] - this.lngLat[0], lngLat[1] - this.lngLat[1]];
  };

  shouldChangeCenter({ latitude, longitude }: Viewport): boolean {
    return (
      Math.abs(this.lngLat[1] - latitude) > CHANGE_CENTER_THRESHOLD ||
      Math.abs(this.lngLat[0] - longitude) > CHANGE_CENTER_THRESHOLD
    );
  }
}

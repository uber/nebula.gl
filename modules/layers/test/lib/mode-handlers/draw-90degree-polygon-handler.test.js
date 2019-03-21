// @flow
/* eslint-env jest */

import type { FeatureCollection } from '../../../geojson-types.js';
import { Draw90DegreePolygonHandler } from '../../../lib/mode-handlers/draw-90degree-polygon-handler';

import {
  createFeatureCollection,
  createClickEvent,
  createPointerMoveEvent
} from '../test-utils.js';

let featureCollection: FeatureCollection;

beforeEach(() => {
  featureCollection = createFeatureCollection();
});

describe('draw 90 degree corner polygon', () => {
  it('make sure to close the polygon with all 90 degree corners', () => {
    const handler = new Draw90DegreePolygonHandler(featureCollection);

    handler.handlePointerMove(createPointerMoveEvent([1, 2]));
    handler.handleClick(createClickEvent([-122.38017869234092, 37.77847897926035]));
    handler.handleClick(createClickEvent([-122.34224286913881, 37.79683147196895]));
    handler.handleClick(createClickEvent([-122.32380804657944, 37.7746130978708]));
    handler.handleClick(createClickEvent([-122.32380804657944, 37.7746130978708]));
    handler.handlePointerMove(createPointerMoveEvent([2, 3]));

    const tentativeFeature = handler.getTentativeFeature();

    if (!tentativeFeature) {
      throw new Error('Should have tentative feature');
    }

    expect(tentativeFeature.geometry).toEqual({
      coordinates: [
        [
          [-122.38017869234092, 37.77847897926035],
          [-122.38017869234092, 37.77847897926035],
          [-122.33570484968095, 37.77847062169598],
          [-122.33570484968095, 37.76830683301666],
          [-12.603314207745886, -14.659605499639042],
          [-122.38017869234092, 37.77847897926035]
        ]
      ],
      type: 'Polygon'
    });
  });
});

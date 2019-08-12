// @flow
/* eslint-env jest */

import { ModifyMode } from '../../src/lib/modify-mode.js';
import { createFeatureCollectionProps } from '../test-utils.js';

let pointFeature;
let lineStringFeature;
let polygonFeature;
let multiPointFeature;
let multiLineStringFeature;
let multiPolygonFeature;

beforeEach(() => {
  pointFeature = {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Point', coordinates: [1, 2] }
  };

  lineStringFeature = {
    type: 'Feature',
    properties: {},
    geometry: { type: 'LineString', coordinates: [[1, 2], [2, 3], [3, 4]] }
  };

  polygonFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        // exterior ring
        [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]],
        // hole
        [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]]
      ]
    }
  };

  multiPointFeature = {
    type: 'Feature',
    properties: {},
    geometry: { type: 'MultiPoint', coordinates: [[1, 2], [3, 4]] }
  };

  multiLineStringFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiLineString',
      coordinates: [[[1, 2], [2, 3], [3, 4]], [[5, 6], [6, 7], [7, 8]]]
    }
  };

  multiPolygonFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          // exterior ring polygon 1
          [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]],
          // hole  polygon 1
          [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]]
        ],
        [
          // exterior ring polygon 2
          [[2, -1], [4, -1], [4, 1], [2, 1], [2, -1]]
        ]
      ]
    }
  };
});

describe('getEditHandlesAdapter()', () => {
  it('gets edit handles for Point', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [pointFeature]
      },
      selectedIndexes: [0]
    });

    const actual = mode.getEditHandlesAdapter(null, null, props);

    const expected = [{ featureIndex: 0, position: [1, 2], positionIndexes: [], type: 'existing' }];
    expect(actual).toEqual(expected);
  });

  it('gets edit handles for LineString', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [lineStringFeature]
      },
      selectedIndexes: [0]
    });

    const actual = mode.getEditHandlesAdapter(null, null, props);

    const expected = [
      { featureIndex: 0, position: [1, 2], positionIndexes: [0], type: 'existing' },
      { featureIndex: 0, position: [2, 3], positionIndexes: [1], type: 'existing' },
      { featureIndex: 0, position: [3, 4], positionIndexes: [2], type: 'existing' }
    ];
    expect(actual).toEqual(expected);
  });

  it('gets edit handles for Polygon', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [polygonFeature]
      },
      selectedIndexes: [0]
    });

    const actual = mode.getEditHandlesAdapter(null, null, props);

    const expected = [
      { featureIndex: 0, position: [-1, -1], positionIndexes: [0, 0], type: 'existing' },
      { featureIndex: 0, position: [1, -1], positionIndexes: [0, 1], type: 'existing' },
      { featureIndex: 0, position: [1, 1], positionIndexes: [0, 2], type: 'existing' },
      { featureIndex: 0, position: [-1, 1], positionIndexes: [0, 3], type: 'existing' },
      { featureIndex: 0, position: [-0.5, -0.5], positionIndexes: [1, 0], type: 'existing' },
      { featureIndex: 0, position: [-0.5, 0.5], positionIndexes: [1, 1], type: 'existing' },
      { featureIndex: 0, position: [0.5, 0.5], positionIndexes: [1, 2], type: 'existing' },
      { featureIndex: 0, position: [0.5, -0.5], positionIndexes: [1, 3], type: 'existing' }
    ];
    expect(actual).toEqual(expected);
  });

  it('gets edit handles for MultiPoint', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [multiPointFeature]
      },
      selectedIndexes: [0]
    });

    const actual = mode.getEditHandlesAdapter(null, null, props);

    const expected = [
      { featureIndex: 0, position: [1, 2], positionIndexes: [0], type: 'existing' },
      { featureIndex: 0, position: [3, 4], positionIndexes: [1], type: 'existing' }
    ];
    expect(actual).toEqual(expected);
  });

  it('gets edit handles for MultiLineString', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [multiLineStringFeature]
      },
      selectedIndexes: [0]
    });

    const actual = mode.getEditHandlesAdapter(null, null, props);

    const expected = [
      { featureIndex: 0, position: [1, 2], positionIndexes: [0, 0], type: 'existing' },
      { featureIndex: 0, position: [2, 3], positionIndexes: [0, 1], type: 'existing' },
      { featureIndex: 0, position: [3, 4], positionIndexes: [0, 2], type: 'existing' },
      { featureIndex: 0, position: [5, 6], positionIndexes: [1, 0], type: 'existing' },
      { featureIndex: 0, position: [6, 7], positionIndexes: [1, 1], type: 'existing' },
      { featureIndex: 0, position: [7, 8], positionIndexes: [1, 2], type: 'existing' }
    ];
    expect(actual).toEqual(expected);
  });

  it('gets edit handles for MultiPolygon', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [multiPolygonFeature]
      },
      selectedIndexes: [0]
    });

    const actual = mode.getEditHandlesAdapter(null, null, props);

    const expected = [
      { featureIndex: 0, position: [-1, -1], positionIndexes: [0, 0, 0], type: 'existing' },
      { featureIndex: 0, position: [1, -1], positionIndexes: [0, 0, 1], type: 'existing' },
      { featureIndex: 0, position: [1, 1], positionIndexes: [0, 0, 2], type: 'existing' },
      { featureIndex: 0, position: [-1, 1], positionIndexes: [0, 0, 3], type: 'existing' },
      { featureIndex: 0, position: [-0.5, -0.5], positionIndexes: [0, 1, 0], type: 'existing' },
      { featureIndex: 0, position: [-0.5, 0.5], positionIndexes: [0, 1, 1], type: 'existing' },
      { featureIndex: 0, position: [0.5, 0.5], positionIndexes: [0, 1, 2], type: 'existing' },
      { featureIndex: 0, position: [0.5, -0.5], positionIndexes: [0, 1, 3], type: 'existing' },
      { featureIndex: 0, position: [2, -1], positionIndexes: [1, 0, 0], type: 'existing' },
      { featureIndex: 0, position: [4, -1], positionIndexes: [1, 0, 1], type: 'existing' },
      { featureIndex: 0, position: [4, 1], positionIndexes: [1, 0, 2], type: 'existing' },
      { featureIndex: 0, position: [2, 1], positionIndexes: [1, 0, 3], type: 'existing' }
    ];
    expect(actual).toEqual(expected);
  });

  it('gets edit handles for all selected features in collection', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [lineStringFeature, pointFeature, multiPointFeature]
      },
      selectedIndexes: [0, 2]
    });

    const actual = mode.getEditHandlesAdapter(null, null, props);

    const expected = [
      { featureIndex: 0, position: [1, 2], positionIndexes: [0], type: 'existing' },
      { featureIndex: 0, position: [2, 3], positionIndexes: [1], type: 'existing' },
      { featureIndex: 0, position: [3, 4], positionIndexes: [2], type: 'existing' },
      { featureIndex: 2, position: [1, 2], positionIndexes: [0], type: 'existing' },
      { featureIndex: 2, position: [3, 4], positionIndexes: [1], type: 'existing' }
    ];
    expect(actual).toEqual(expected);
  });

  const lineString = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [-122.40880966186523, 37.783536601521924],
        [-122.43893623352051, 37.779669924659004],
        [-122.43515968322752, 37.7624370109886],
        [-122.42348670959471, 37.77180027337861],
        [-122.4250316619873, 37.778584505321376],
        [-122.42314338684082, 37.778652344496926],
        [-122.42357254028322, 37.77987343901049],
        [-122.41198539733887, 37.78109451335266]
      ]
    }
  };

  const point = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-122.40880966186523, 37.783536601521924]
    }
  };
  const pick = {
    object: lineString,
    index: 0
  };

  const groundCoords = [-122.43862233312133, 37.77767798407437];

  it('includes an intermediate edit handle', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [lineString]
      },
      selectedIndexes: [0]
    });

    const actual = mode.getEditHandlesAdapter([pick], groundCoords, props);

    const intermediate = actual.find(editHandle => editHandle.type === 'intermediate');
    expect(JSON.stringify(intermediate)).toBe(
      JSON.stringify({
        position: [-122.43850292231143, 37.777692666558565],
        positionIndexes: [2],
        featureIndex: 0,
        type: 'intermediate'
      })
    );
  });

  it('does not add intermeidate edit handle when no picks provided', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [lineString]
      },
      selectedIndexes: [0]
    });

    const actual = mode.getEditHandlesAdapter(undefined, groundCoords, props);

    const intermediate = actual.find(editHandle => editHandle.type === 'intermediate');
    expect(intermediate).toBeUndefined();
  });

  it('does not add intermeidate edit handle when empty picks array provided', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [lineString]
      },
      selectedIndexes: [0]
    });

    const actual = mode.getEditHandlesAdapter([], groundCoords, props);

    const intermediate = actual.find(editHandle => editHandle.type === 'intermediate');
    expect(intermediate).toBeUndefined();
  });

  it('does not add intermeidate edit handle when no ground coords provided', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [lineString]
      },
      selectedIndexes: [0]
    });

    const actual = mode.getEditHandlesAdapter([pick], null, props);

    const intermediate = actual.find(editHandle => editHandle.type === 'intermediate');
    expect(intermediate).toBeUndefined();
  });

  it('does not add intermeidate edit handle when too close to existing edit handle', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [lineString]
      },
      selectedIndexes: [0]
    });

    const actual = mode.getEditHandlesAdapter(
      [
        pick,
        {
          isGuide: true,
          object: {
            properties: { guideType: 'editHandle', editHandleType: 'existing', featureIndex: 0 },
            geometry: { coordinates: [] }
          }
        }
      ],
      groundCoords,
      props
    );

    const intermediate = actual.find(editHandle => editHandle.type === 'intermediate');
    expect(intermediate).toBeUndefined();
  });

  it('does not add intermeidate edit handle when pick is not a selected feature', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [lineString]
      }
    });

    const actual = mode.getEditHandlesAdapter([pick], groundCoords, props);

    const intermediate = actual.find(editHandle => editHandle.type === 'intermediate');
    expect(intermediate).toBeUndefined();
  });

  it('does not add intermeidate edit handle when pick is a Point / MultiPoint', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [point]
      },
      selectedIndexes: [0]
    });
    const actual = mode.getEditHandlesAdapter([{ object: point, index: 0 }], groundCoords, props);
    const intermediate = actual.find(editHandle => editHandle.type === 'intermediate');
    expect(intermediate).toBeUndefined();
  });
});

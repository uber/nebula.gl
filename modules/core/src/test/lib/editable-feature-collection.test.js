// @flow
/* eslint-env jest */
/* eslint-disable max-nested-callbacks */

import { EditableFeatureCollection } from '../../lib/editable-feature-collection';

let pointFeature;
let lineStringFeature;
let polygonFeature;
let multiPointFeature;
let multiLineStringFeature;
let multiPolygonFeature;
let featureCollection;

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

  featureCollection = {
    type: 'FeatureCollection',
    features: [
      pointFeature,
      lineStringFeature,
      polygonFeature,
      multiPointFeature,
      multiLineStringFeature,
      multiPolygonFeature
    ]
  };
});

describe('getFeatureCollection()', () => {
  it('can get real object', () => {
    const editable = new EditableFeatureCollection(featureCollection);

    expect(editable.getFeatureCollection()).toBe(featureCollection);
  });
});

describe('replacePosition()', () => {
  it(`doesn't mutate original`, () => {
    const leaveMeAlone = {
      type: 'FeatureCollection',
      features: [pointFeature]
    };
    const features = new EditableFeatureCollection(leaveMeAlone);
    features.replacePosition(0, [], [10, 20]);

    expect(leaveMeAlone.features[0].geometry.coordinates).toEqual([1, 2]);
  });

  it('replaces position in Point', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [pointFeature]
    });
    features.replacePosition(0, [], [10, 20]);

    const actualCoordinates = features.getFeatureCollection().features[0].geometry.coordinates;
    const expectedCoordinates = [10, 20];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('replaces first position in LineString', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [lineStringFeature]
    });
    features.replacePosition(0, [0], [10, 20]);

    const actualCoordinates = features.getFeatureCollection().features[0].geometry.coordinates;
    const expectedCoordinates = [[10, 20], [2, 3], [3, 4]];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('replaces middle position in Polygon', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature]
    });
    features.replacePosition(0, [0, 1], [1.1, -1.1]).replacePosition(0, [1, 2], [0.6, 0.6]);

    const actualCoordinates = features.getFeatureCollection().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [[-1, -1], [1.1, -1.1], [1, 1], [-1, 1], [-1, -1]],
      [[-0.5, -0.5], [-0.5, 0.5], [0.6, 0.6], [0.5, -0.5], [-0.5, -0.5]]
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('replaces last position when replacing first position in Polygon', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature]
    });
    features.replacePosition(0, [0, 0], [-1.1, -1.1]);

    const actualCoordinates = features.getFeatureCollection().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [[-1.1, -1.1], [1, -1], [1, 1], [-1, 1], [-1.1, -1.1]],
      [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]]
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('replaces first position when replacing last position in Polygon', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature]
    });
    features.replacePosition(0, [0, 4], [-1.1, -1.1]);

    const actualCoordinates = features.getFeatureCollection().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [[-1.1, -1.1], [1, -1], [1, 1], [-1, 1], [-1.1, -1.1]],
      [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]]
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });
});

describe('removePosition()', () => {
  it(`doesn't mutate original`, () => {
    const leaveMeAlone = {
      type: 'FeatureCollection',
      features: [lineStringFeature]
    };
    const features = new EditableFeatureCollection(leaveMeAlone);
    features.removePosition(0, [0]);

    expect(leaveMeAlone.features[0].geometry.coordinates).toEqual([[1, 2], [2, 3], [3, 4]]);
  });

  it('throws exception when attempting to remove Point', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [pointFeature]
    });

    expect(() => features.removePosition(0, [0])).toThrow(
      `Can't remove a position from a Point or there'd be nothing left`
    );
  });

  it('removes first position in LineString', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [lineStringFeature]
    });
    features.removePosition(0, [0]);

    const actualCoordinates = features.getFeatureCollection().features[0].geometry.coordinates;
    const expectedCoordinates = [[2, 3], [3, 4]];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('removes middle position in Polygon', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature]
    });
    features.removePosition(0, [0, 1]).removePosition(0, [1, 3]);

    const actualCoordinates = features.getFeatureCollection().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [[-1, -1], [1, 1], [-1, 1], [-1, -1]],
      [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [-0.5, -0.5]]
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('changes last position when removing first position in Polygon', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature]
    });
    features.removePosition(0, [1, 0]);

    const actualCoordinates = features.getFeatureCollection().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]],
      [[-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, 0.5]]
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('changes first position when removing last position in Polygon', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature]
    });
    features.removePosition(0, [1, 4]);

    const actualCoordinates = features.getFeatureCollection().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]],
      [[0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5]]
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('throws exception when LineString has only 2 positions', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', geometry: { type: 'LineString', coordinates: [[0, 1], [2, 3]] } }
      ]
    });

    expect(() => features.removePosition(0, [0])).toThrow(
      `Can't remove position. LineString must have at least two positions`
    );
  });

  it('throws exception when Polygon outer ring has only 4 positions (triangle)', () => {
    let features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature]
    });
    features = features
      // Convert from quadrilateral to triangle
      .removePosition(0, [0, 1]);

    expect(() => features.removePosition(0, [0, 1])).toThrow(
      `Can't remove position. Polygon's outer ring must have at least four positions`
    );
  });

  it('removes hole from Polygon when it has less than four positions', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature]
    });
    features.removePosition(0, [1, 1]).removePosition(0, [1, 1]);

    const actualGeometry = features.getFeatureCollection().features[0].geometry;
    const expectedGeometry = {
      type: 'Polygon',
      coordinates: [[[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]]]
    };

    expect(actualGeometry).toEqual(expectedGeometry);
  });

  it('removes LineString from MultiLineString when it has only one position', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiLineStringFeature]
    });
    features.removePosition(0, [1, 0]).removePosition(0, [1, 0]);

    const actualGeometry = features.getFeatureCollection().features[0].geometry;
    const expectedGeometry = {
      type: 'MultiLineString',
      coordinates: [[[1, 2], [2, 3], [3, 4]]]
    };

    expect(actualGeometry).toEqual(expectedGeometry);
  });

  it('throws exception when MultiLineString has only 2 positions', () => {
    let features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiLineStringFeature]
    });
    features = features
      // remove one of the LineStrings
      .removePosition(0, [0, 0])
      .removePosition(0, [0, 0])
      // shrink the remaining LineString to two positions
      .removePosition(0, [0, 0]);

    expect(() => features.removePosition(0, [0, 0])).toThrow(
      `Can't remove position. MultiLineString must have at least two positions`
    );
  });

  it('removes Polygon from MultiPolygon when outer ring has less than four positions', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPolygonFeature]
    });
    features.removePosition(0, [1, 0, 0]).removePosition(0, [1, 0, 0]);

    const actualGeometry = features.getFeatureCollection().features[0].geometry;
    const expectedGeometry = {
      type: 'MultiPolygon',
      coordinates: [multiPolygonFeature.geometry.coordinates[0]]
    };

    expect(actualGeometry).toEqual(expectedGeometry);
  });

  it('removes hole from MultiPolygon when it has less than four positions', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPolygonFeature]
    });
    features.removePosition(0, [0, 1, 0]).removePosition(0, [0, 1, 0]);

    const actualGeometry = features.getFeatureCollection().features[0].geometry;
    const expectedGeometry = {
      type: 'MultiPolygon',
      coordinates: [
        [[[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]]],
        [[[2, -1], [4, -1], [4, 1], [2, 1], [2, -1]]]
      ]
    };

    expect(actualGeometry).toEqual(expectedGeometry);
  });

  it('throws exception when MultiPolygon outer ring has only 4 positions', () => {
    let features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPolygonFeature]
    });
    features = features
      // Remove the second polygon
      .removePosition(0, [1, 0, 0])
      .removePosition(0, [1, 0, 0])
      // Remove positions from outer ring
      .removePosition(0, [0, 0, 1]);

    expect(() => features.removePosition(0, [0, 0, 1])).toThrow(
      `Can't remove position. MultiPolygon's outer ring must have at least four positions`
    );
  });
});

describe('addPosition()', () => {
  it(`doesn't mutate original`, () => {
    const leaveMeAlone = {
      type: 'FeatureCollection',
      features: [lineStringFeature]
    };
    const features = new EditableFeatureCollection(leaveMeAlone);
    features.addPosition(0, [1], [2, 3]);

    expect(leaveMeAlone.features[0].geometry.coordinates).toEqual([[1, 2], [2, 3], [3, 4]]);
  });

  it('throws exception when attempting to add position to Point', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [pointFeature]
    });

    expect(() => features.addPosition(0, [], [3, 4])).toThrow(
      'Unable to add a position to a Point feature'
    );
  });

  it('adds position to beginning of LineString', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [lineStringFeature]
    });
    features.addPosition(0, [0], [10, 20]);

    const actualCoordinates = features.getFeatureCollection().features[0].geometry.coordinates;
    const expectedCoordinates = [[10, 20], [1, 2], [2, 3], [3, 4]];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('adds position to middle of LineString', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [lineStringFeature]
    });
    features.addPosition(0, [1], [10, 20]);

    const actualCoordinates = features.getFeatureCollection().features[0].geometry.coordinates;
    const expectedCoordinates = [[1, 2], [10, 20], [2, 3], [3, 4]];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('adds position to end of LineString', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [lineStringFeature]
    });
    features.addPosition(0, [3], [10, 20]);

    const actualCoordinates = features.getFeatureCollection().features[0].geometry.coordinates;
    const expectedCoordinates = [[1, 2], [2, 3], [3, 4], [10, 20]];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('adds position in Polygon', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature]
    });
    features.addPosition(0, [0, 1], [0, -1]).addPosition(0, [1, 4], [0, -0.5]);

    const actualCoordinates = features.getFeatureCollection().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [[-1, -1], [0, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]],
      [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [0, -0.5], [-0.5, -0.5]]
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });
});

describe('addFeature()', () => {
  it(`doesn't mutate original`, () => {
    const leaveMeAlone = {
      type: 'FeatureCollection',
      features: []
    };
    const features = new EditableFeatureCollection(leaveMeAlone);
    features.addFeature(pointFeature);

    expect(leaveMeAlone.features.length).toEqual(0);
  });

  it('adds feature to empty array', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: []
    });
    const actualFeatures = features.addFeature(pointFeature).getFeatureCollection();

    const expectedFeatures = {
      type: 'FeatureCollection',
      features: [pointFeature]
    };

    expect(actualFeatures).toEqual(expectedFeatures);
  });

  it('adds feature to end of array', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPointFeature]
    });
    const actualFeatures = features.addFeature(multiLineStringFeature).getFeatureCollection();

    const expectedFeatures = {
      type: 'FeatureCollection',
      features: [multiPointFeature, multiLineStringFeature]
    };

    expect(actualFeatures).toEqual(expectedFeatures);
  });
});

describe('getEditHandles()', () => {
  it('gets edit handles for Point', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [pointFeature]
    });
    features.setSelectedFeatureIndexes([0]);

    const actual = features.getEditHandles();
    const expected = [{ featureIndex: 0, position: [1, 2], positionIndexes: [], type: 'existing' }];

    expect(actual).toEqual(expected);
  });

  it('gets edit handles for LineString', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [lineStringFeature]
    });
    features.setSelectedFeatureIndexes([0]);

    const actual = features.getEditHandles();
    const expected = [
      { featureIndex: 0, position: [1, 2], positionIndexes: [0], type: 'existing' },
      { featureIndex: 0, position: [1.5, 2.5], positionIndexes: [1], type: 'intermediate' },
      { featureIndex: 0, position: [2, 3], positionIndexes: [1], type: 'existing' },
      { featureIndex: 0, position: [2.5, 3.5], positionIndexes: [2], type: 'intermediate' },
      { featureIndex: 0, position: [3, 4], positionIndexes: [2], type: 'existing' }
    ];

    expect(actual).toEqual(expected);
  });

  it('gets edit handles for Polygon', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature]
    });
    features.setSelectedFeatureIndexes([0]);

    const actual = features.getEditHandles();
    const expected = [
      { featureIndex: 0, position: [-1, -1], positionIndexes: [0, 0], type: 'existing' },
      { featureIndex: 0, position: [0, -1], positionIndexes: [0, 1], type: 'intermediate' },
      { featureIndex: 0, position: [1, -1], positionIndexes: [0, 1], type: 'existing' },
      { featureIndex: 0, position: [1, 0], positionIndexes: [0, 2], type: 'intermediate' },
      { featureIndex: 0, position: [1, 1], positionIndexes: [0, 2], type: 'existing' },
      { featureIndex: 0, position: [0, 1], positionIndexes: [0, 3], type: 'intermediate' },
      { featureIndex: 0, position: [-1, 1], positionIndexes: [0, 3], type: 'existing' },
      { featureIndex: 0, position: [-1, 0], positionIndexes: [0, 4], type: 'intermediate' },
      { featureIndex: 0, position: [-0.5, -0.5], positionIndexes: [1, 0], type: 'existing' },
      { featureIndex: 0, position: [-0.5, 0], positionIndexes: [1, 1], type: 'intermediate' },
      { featureIndex: 0, position: [-0.5, 0.5], positionIndexes: [1, 1], type: 'existing' },
      { featureIndex: 0, position: [0, 0.5], positionIndexes: [1, 2], type: 'intermediate' },
      { featureIndex: 0, position: [0.5, 0.5], positionIndexes: [1, 2], type: 'existing' },
      { featureIndex: 0, position: [0.5, 0], positionIndexes: [1, 3], type: 'intermediate' },
      { featureIndex: 0, position: [0.5, -0.5], positionIndexes: [1, 3], type: 'existing' },
      { featureIndex: 0, position: [0, -0.5], positionIndexes: [1, 4], type: 'intermediate' }
    ];

    expect(actual).toEqual(expected);
  });

  it('gets edit handles for MultiPoint', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPointFeature]
    });
    features.setSelectedFeatureIndexes([0]);

    const actual = features.getEditHandles();
    const expected = [
      { featureIndex: 0, position: [1, 2], positionIndexes: [0], type: 'existing' },
      { featureIndex: 0, position: [3, 4], positionIndexes: [1], type: 'existing' }
    ];

    expect(actual).toEqual(expected);
  });

  it('gets edit handles for MultiLineString', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiLineStringFeature]
    });
    features.setSelectedFeatureIndexes([0]);

    const actual = features.getEditHandles();
    const expected = [
      { featureIndex: 0, position: [1, 2], positionIndexes: [0, 0], type: 'existing' },
      { featureIndex: 0, position: [1.5, 2.5], positionIndexes: [0, 1], type: 'intermediate' },
      { featureIndex: 0, position: [2, 3], positionIndexes: [0, 1], type: 'existing' },
      { featureIndex: 0, position: [2.5, 3.5], positionIndexes: [0, 2], type: 'intermediate' },
      { featureIndex: 0, position: [3, 4], positionIndexes: [0, 2], type: 'existing' },
      { featureIndex: 0, position: [5, 6], positionIndexes: [1, 0], type: 'existing' },
      { featureIndex: 0, position: [5.5, 6.5], positionIndexes: [1, 1], type: 'intermediate' },
      { featureIndex: 0, position: [6, 7], positionIndexes: [1, 1], type: 'existing' },
      { featureIndex: 0, position: [6.5, 7.5], positionIndexes: [1, 2], type: 'intermediate' },
      { featureIndex: 0, position: [7, 8], positionIndexes: [1, 2], type: 'existing' }
    ];

    expect(actual).toEqual(expected);
  });

  it('gets edit handles for MultiPolygon', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPolygonFeature]
    });
    features.setSelectedFeatureIndexes([0]);

    const actual = features.getEditHandles();
    const expected = [
      { featureIndex: 0, position: [-1, -1], positionIndexes: [0, 0, 0], type: 'existing' },
      { featureIndex: 0, position: [0, -1], positionIndexes: [0, 0, 1], type: 'intermediate' },
      { featureIndex: 0, position: [1, -1], positionIndexes: [0, 0, 1], type: 'existing' },
      { featureIndex: 0, position: [1, 0], positionIndexes: [0, 0, 2], type: 'intermediate' },
      { featureIndex: 0, position: [1, 1], positionIndexes: [0, 0, 2], type: 'existing' },
      { featureIndex: 0, position: [0, 1], positionIndexes: [0, 0, 3], type: 'intermediate' },
      { featureIndex: 0, position: [-1, 1], positionIndexes: [0, 0, 3], type: 'existing' },
      { featureIndex: 0, position: [-1, 0], positionIndexes: [0, 0, 4], type: 'intermediate' },
      { featureIndex: 0, position: [-0.5, -0.5], positionIndexes: [0, 1, 0], type: 'existing' },
      { featureIndex: 0, position: [-0.5, 0], positionIndexes: [0, 1, 1], type: 'intermediate' },
      { featureIndex: 0, position: [-0.5, 0.5], positionIndexes: [0, 1, 1], type: 'existing' },
      { featureIndex: 0, position: [0, 0.5], positionIndexes: [0, 1, 2], type: 'intermediate' },
      { featureIndex: 0, position: [0.5, 0.5], positionIndexes: [0, 1, 2], type: 'existing' },
      { featureIndex: 0, position: [0.5, 0], positionIndexes: [0, 1, 3], type: 'intermediate' },
      { featureIndex: 0, position: [0.5, -0.5], positionIndexes: [0, 1, 3], type: 'existing' },
      { featureIndex: 0, position: [0, -0.5], positionIndexes: [0, 1, 4], type: 'intermediate' },
      { featureIndex: 0, position: [2, -1], positionIndexes: [1, 0, 0], type: 'existing' },
      { featureIndex: 0, position: [3, -1], positionIndexes: [1, 0, 1], type: 'intermediate' },
      { featureIndex: 0, position: [4, -1], positionIndexes: [1, 0, 1], type: 'existing' },
      { featureIndex: 0, position: [4, 0], positionIndexes: [1, 0, 2], type: 'intermediate' },
      { featureIndex: 0, position: [4, 1], positionIndexes: [1, 0, 2], type: 'existing' },
      { featureIndex: 0, position: [3, 1], positionIndexes: [1, 0, 3], type: 'intermediate' },
      { featureIndex: 0, position: [2, 1], positionIndexes: [1, 0, 3], type: 'existing' },
      { featureIndex: 0, position: [2, 0], positionIndexes: [1, 0, 4], type: 'intermediate' }
    ];

    expect(actual).toEqual(expected);
  });

  it('gets edit handles for all selected features in collection', () => {
    const features = new EditableFeatureCollection({
      type: 'FeatureCollection',
      features: [lineStringFeature, pointFeature, multiPointFeature]
    });
    features.setSelectedFeatureIndexes([0, 2]);

    const actual = features.getEditHandles();
    const expected = [
      { featureIndex: 0, position: [1, 2], positionIndexes: [0], type: 'existing' },
      { featureIndex: 0, position: [1.5, 2.5], positionIndexes: [1], type: 'intermediate' },
      { featureIndex: 0, position: [2, 3], positionIndexes: [1], type: 'existing' },
      { featureIndex: 0, position: [2.5, 3.5], positionIndexes: [2], type: 'intermediate' },
      { featureIndex: 0, position: [3, 4], positionIndexes: [2], type: 'existing' },
      { featureIndex: 2, position: [1, 2], positionIndexes: [0], type: 'existing' },
      { featureIndex: 2, position: [3, 4], positionIndexes: [1], type: 'existing' }
    ];

    expect(actual).toEqual(expected);
  });
});

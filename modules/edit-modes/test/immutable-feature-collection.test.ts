/* eslint-env jest */

import { ImmutableFeatureCollection } from '../src/lib/immutable-feature-collection';

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
    geometry: { type: 'Point', coordinates: [1, 2] },
  };

  lineStringFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [1, 2],
        [2, 3],
        [3, 4],
      ],
    },
  };

  polygonFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        // exterior ring
        [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
          [-1, -1],
        ],
        // hole
        [
          [-0.5, -0.5],
          [-0.5, 0.5],
          [0.5, 0.5],
          [0.5, -0.5],
          [-0.5, -0.5],
        ],
      ],
    },
  };

  multiPointFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPoint',
      coordinates: [
        [1, 2],
        [3, 4],
      ],
    },
  };

  multiLineStringFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiLineString',
      coordinates: [
        [
          [1, 2],
          [2, 3],
          [3, 4],
        ],
        [
          [5, 6],
          [6, 7],
          [7, 8],
        ],
      ],
    },
  };

  multiPolygonFeature = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          // exterior ring polygon 1
          [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
            [-1, -1],
          ],
          // hole  polygon 1
          [
            [-0.5, -0.5],
            [-0.5, 0.5],
            [0.5, 0.5],
            [0.5, -0.5],
            [-0.5, -0.5],
          ],
        ],
        [
          // exterior ring polygon 2
          [
            [2, -1],
            [4, -1],
            [4, 1],
            [2, 1],
            [2, -1],
          ],
        ],
      ],
    },
  };

  featureCollection = {
    type: 'FeatureCollection',
    features: [
      pointFeature,
      lineStringFeature,
      polygonFeature,
      multiPointFeature,
      multiLineStringFeature,
      multiPolygonFeature,
    ],
  };
});

describe('getObject()', () => {
  it('can get real object', () => {
    const editable = new ImmutableFeatureCollection(featureCollection);

    expect(editable.getObject()).toBe(featureCollection);
  });
});

describe('replacePosition()', () => {
  it(`doesn't mutate original`, () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [pointFeature],
    });
    const updatedFeatures = features.replacePosition(0, [], [10, 20]);

    expect(updatedFeatures).not.toBe(features);
    expect(pointFeature.geometry.coordinates).toEqual([1, 2]);
  });

  it('replaces position in Point', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [pointFeature],
    });
    const updatedFeatures = features.replacePosition(0, [], [10, 20]);

    const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
    const expectedCoordinates = [10, 20];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('replaces first position in LineString', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [lineStringFeature],
    });
    const updatedFeatures = features.replacePosition(0, [0], [10, 20]);

    const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [10, 20],
      [2, 3],
      [3, 4],
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('replaces middle position in Polygon', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature],
    });
    const updatedFeatures = features
      .replacePosition(0, [0, 1], [1.1, -1.1])
      .replacePosition(0, [1, 2], [0.6, 0.6]);

    const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [
        [-1, -1],
        [1.1, -1.1],
        [1, 1],
        [-1, 1],
        [-1, -1],
      ],
      [
        [-0.5, -0.5],
        [-0.5, 0.5],
        [0.6, 0.6],
        [0.5, -0.5],
        [-0.5, -0.5],
      ],
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('replaces last position when replacing first position in Polygon', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature],
    });
    const updatedFeatures = features.replacePosition(0, [0, 0], [-1.1, -1.1]);

    const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [
        [-1.1, -1.1],
        [1, -1],
        [1, 1],
        [-1, 1],
        [-1.1, -1.1],
      ],
      [
        [-0.5, -0.5],
        [-0.5, 0.5],
        [0.5, 0.5],
        [0.5, -0.5],
        [-0.5, -0.5],
      ],
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('replaces first position when replacing last position in Polygon', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature],
    });
    const updatedFeatures = features.replacePosition(0, [0, 4], [-1.1, -1.1]);

    const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [
        [-1.1, -1.1],
        [1, -1],
        [1, 1],
        [-1, 1],
        [-1.1, -1.1],
      ],
      [
        [-0.5, -0.5],
        [-0.5, 0.5],
        [0.5, 0.5],
        [0.5, -0.5],
        [-0.5, -0.5],
      ],
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });
});

describe('removePosition()', () => {
  it(`doesn't mutate original`, () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [lineStringFeature],
    });
    const updatedFeatures = features.removePosition(0, [0]);

    expect(updatedFeatures).not.toBe(features);
    expect(lineStringFeature.geometry.coordinates).toEqual([
      [1, 2],
      [2, 3],
      [3, 4],
    ]);
  });

  it('throws exception when attempting to remove Point', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [pointFeature],
    });

    expect(() => features.removePosition(0, [0])).toThrow(
      `Can't remove a position from a Point or there'd be nothing left`
    );
  });

  it('removes first position in LineString', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [lineStringFeature],
    });
    const updatedFeatures = features.removePosition(0, [0]);

    const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [2, 3],
      [3, 4],
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('removes middle position in Polygon', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature],
    });
    const updatedFeatures = features.removePosition(0, [0, 1]).removePosition(0, [1, 3]);

    const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [
        [-1, -1],
        [1, 1],
        [-1, 1],
        [-1, -1],
      ],
      [
        [-0.5, -0.5],
        [-0.5, 0.5],
        [0.5, 0.5],
        [-0.5, -0.5],
      ],
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('changes last position when removing first position in Polygon', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature],
    });
    const updatedFeatures = features.removePosition(0, [1, 0]);

    const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
        [-1, -1],
      ],
      [
        [-0.5, 0.5],
        [0.5, 0.5],
        [0.5, -0.5],
        [-0.5, 0.5],
      ],
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('changes first position when removing last position in Polygon', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature],
    });
    const updatedFeatures = features.removePosition(0, [1, 4]);

    const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
        [-1, -1],
      ],
      [
        [0.5, -0.5],
        [-0.5, 0.5],
        [0.5, 0.5],
        [0.5, -0.5],
      ],
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('throws exception when LineString has only 2 positions', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: [
              [0, 1],
              [2, 3],
            ],
          },
        },
      ],
    });

    expect(() => features.removePosition(0, [0])).toThrow(
      `Can't remove position. LineString must have at least two positions`
    );
  });

  it('throws exception when Polygon outer ring has only 4 positions (triangle)', () => {
    let features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature],
    });
    features = features
      // Convert from quadrilateral to triangle
      .removePosition(0, [0, 1]);

    expect(() => features.removePosition(0, [0, 1])).toThrow(
      `Can't remove position. Polygon's outer ring must have at least four positions`
    );
  });

  it('removes hole from Polygon when it has less than four positions', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature],
    });
    const updatedFeatures = features.removePosition(0, [1, 1]).removePosition(0, [1, 1]);

    const actualGeometry = updatedFeatures.getObject().features[0].geometry;
    const expectedGeometry = {
      type: 'Polygon',
      coordinates: [
        [
          [-1, -1],
          [1, -1],
          [1, 1],
          [-1, 1],
          [-1, -1],
        ],
      ],
    };

    expect(actualGeometry).toEqual(expectedGeometry);
  });

  it('removes LineString from MultiLineString when it has only one position', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiLineStringFeature],
    });
    const updatedFeatures = features.removePosition(0, [1, 0]).removePosition(0, [1, 0]);

    const actualGeometry = updatedFeatures.getObject().features[0].geometry;
    const expectedGeometry = {
      type: 'MultiLineString',
      coordinates: [
        [
          [1, 2],
          [2, 3],
          [3, 4],
        ],
      ],
    };

    expect(actualGeometry).toEqual(expectedGeometry);
  });

  it('throws exception when MultiLineString has only 2 positions', () => {
    let features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiLineStringFeature],
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
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPolygonFeature],
    });
    const updatedFeatures = features.removePosition(0, [1, 0, 0]).removePosition(0, [1, 0, 0]);

    const actualGeometry = updatedFeatures.getObject().features[0].geometry;
    const expectedGeometry = {
      type: 'MultiPolygon',
      coordinates: [multiPolygonFeature.geometry.coordinates[0]],
    };

    expect(actualGeometry).toEqual(expectedGeometry);
  });

  it('removes hole from MultiPolygon when it has less than four positions', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPolygonFeature],
    });
    const updatedFeatures = features.removePosition(0, [0, 1, 0]).removePosition(0, [0, 1, 0]);

    const actualGeometry = updatedFeatures.getObject().features[0].geometry;
    const expectedGeometry = {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
            [-1, -1],
          ],
        ],
        [
          [
            [2, -1],
            [4, -1],
            [4, 1],
            [2, 1],
            [2, -1],
          ],
        ],
      ],
    };

    expect(actualGeometry).toEqual(expectedGeometry);
  });

  it('throws exception when MultiPolygon outer ring has only 4 positions', () => {
    let features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPolygonFeature],
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
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [lineStringFeature],
    });
    const updatedFeatures = features.addPosition(0, [1], [2, 3]);

    expect(updatedFeatures).not.toBe(features);
    expect(lineStringFeature.geometry.coordinates).toEqual([
      [1, 2],
      [2, 3],
      [3, 4],
    ]);
  });

  it('throws exception when attempting to add position to Point', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [pointFeature],
    });

    expect(() => features.addPosition(0, [], [3, 4])).toThrow(
      'Unable to add a position to a Point feature'
    );
  });

  it('adds position to beginning of LineString', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [lineStringFeature],
    });
    const updatedFeatures = features.addPosition(0, [0], [10, 20]);

    const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [10, 20],
      [1, 2],
      [2, 3],
      [3, 4],
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('adds position to middle of LineString', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [lineStringFeature],
    });
    const updatedFeatures = features.addPosition(0, [1], [10, 20]);

    const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [1, 2],
      [10, 20],
      [2, 3],
      [3, 4],
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('adds position to end of LineString', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [lineStringFeature],
    });
    const updatedFeatures = features.addPosition(0, [3], [10, 20]);

    const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [1, 2],
      [2, 3],
      [3, 4],
      [10, 20],
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('adds position in Polygon', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [polygonFeature],
    });
    const updatedFeatures = features
      .addPosition(0, [0, 1], [0, -1])
      .addPosition(0, [1, 4], [0, -0.5]);

    const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [
        [-1, -1],
        [0, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
        [-1, -1],
      ],
      [
        [-0.5, -0.5],
        [-0.5, 0.5],
        [0.5, 0.5],
        [0.5, -0.5],
        [0, -0.5],
        [-0.5, -0.5],
      ],
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });
});

describe('addFeature()', () => {
  it(`doesn't mutate original`, () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [],
    });
    features.addFeature(pointFeature);

    expect(features.getObject().features.length).toEqual(0);
  });

  it('adds feature to empty array', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [],
    });
    const actualFeatures = features.addFeature(pointFeature).getObject();

    const expectedFeatures = {
      type: 'FeatureCollection',
      features: [pointFeature],
    };

    expect(actualFeatures).toEqual(expectedFeatures);
  });

  it('adds feature to end of array', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPointFeature],
    });
    const actualFeatures = features.addFeature(multiLineStringFeature).getObject();

    const expectedFeatures = {
      type: 'FeatureCollection',
      features: [multiPointFeature, multiLineStringFeature],
    };

    expect(actualFeatures).toEqual(expectedFeatures);
  });
});

describe('addFeatures()', () => {
  it(`doesn't mutate original`, () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [],
    });
    features.addFeatures([multiPointFeature, pointFeature]);

    expect(features.getObject().features.length).toEqual(0);
  });

  it('adds features to empty array', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [],
    });
    const actualFeatures = features.addFeatures([multiPointFeature, pointFeature]).getObject();

    const expectedFeatures = {
      type: 'FeatureCollection',
      features: [multiPointFeature, pointFeature],
    };

    expect(actualFeatures).toEqual(expectedFeatures);
  });

  it('adds features to end of array', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPointFeature],
    });
    const actualFeatures = features.addFeatures([multiLineStringFeature]).getObject();

    const expectedFeatures = {
      type: 'FeatureCollection',
      features: [multiPointFeature, multiLineStringFeature],
    };

    expect(actualFeatures).toEqual(expectedFeatures);
  });
});

describe('deleteFeature()', () => {
  it(`Do nothing when empty array`, () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [],
    });
    features.deleteFeature(0);

    expect(features.getObject().features.length).toEqual(0);
  });

  it(`doesn't mutate original`, () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPointFeature],
    });
    features.deleteFeature(0);

    expect(features.getObject().features.length).toEqual(1);
  });

  it('delete feature', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPointFeature, multiLineStringFeature],
    });
    const actualFeatures = features.deleteFeature(1).getObject();

    const expectedFeatures = {
      type: 'FeatureCollection',
      features: [multiPointFeature],
    };

    expect(actualFeatures).toEqual(expectedFeatures);
  });
});

describe('deleteFeatures()', () => {
  it(`Do nothing when empty array`, () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [],
    });
    features.deleteFeatures([0, 1]);

    expect(features.getObject().features.length).toEqual(0);
  });

  it(`doesn't mutate original`, () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPointFeature],
    });
    features.deleteFeatures([0]);

    expect(features.getObject().features.length).toEqual(1);
  });

  it('delete single feature', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPointFeature, multiLineStringFeature],
    });
    const actualFeatures = features.deleteFeatures([1]).getObject();

    const expectedFeatures = {
      type: 'FeatureCollection',
      features: [multiPointFeature],
    };

    expect(actualFeatures).toEqual(expectedFeatures);
  });

  it('delete multiple features', () => {
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: [multiPointFeature, multiLineStringFeature],
    });
    const actualFeatures = features.deleteFeatures([0, 1]).getObject();

    const expectedFeatures = {
      type: 'FeatureCollection',
      features: [],
    };

    expect(actualFeatures).toEqual(expectedFeatures);
  });
});

describe('replacePosition() with elevation', () => {
  it('replaces position in Point', () => {
    const elevatedPointFeature = {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Point', coordinates: [1, 2, 1000] },
    };
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      // @ts-ignore
      features: [elevatedPointFeature],
    });
    const updatedFeatures = features.replacePosition(0, [], [10, 20]);

    const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
    const expectedCoordinates = [10, 20, 1000];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });

  it('replaces first position in LineString', () => {
    const elevatedLineStringFeature = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [1, 2, 1000],
          [2, 3, 2000],
          [3, 4, 3000],
        ],
      },
    };
    const features = new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      // @ts-ignore
      features: [elevatedLineStringFeature],
    });
    const updatedFeatures = features.replacePosition(0, [0], [10, 20]);

    const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
    const expectedCoordinates = [
      [10, 20, 1000],
      [2, 3, 2000],
      [3, 4, 3000],
    ];

    expect(actualCoordinates).toEqual(expectedCoordinates);
  });
});

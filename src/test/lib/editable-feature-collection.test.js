// @flow-ignore
/* eslint-disable max-nested-callbacks */

import { EditableFeatureCollection } from '../../lib/editable-feature-collection';

describe('EditableFeatureCollection', () => {
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
      geometry: { type: 'LineString', coordinates: [[1, 2], [3, 4]] }
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
      geometry: { type: 'MultiLineString', coordinates: [[[1, 2], [3, 4]], [[5, 6], [7, 8]]] }
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

  describe('getObject()', () => {
    it('can get real object', () => {
      const editable = new EditableFeatureCollection(featureCollection);

      expect(editable.getObject()).toBe(featureCollection);
    });
  });

  describe('replacePosition()', () => {
    it(`doesn't mutate original`, () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [pointFeature]
      });
      const updatedFeatures = features.replacePosition(0, [], [10, 20]);

      expect(updatedFeatures).not.toBe(features);
      expect(pointFeature.geometry.coordinates).toEqual([1, 2]);
    });

    it('replaces position in Point', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [pointFeature]
      });
      const updatedFeatures = features.replacePosition(0, [], [10, 20]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [10, 20];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });

    it('replaces first position in LineString', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [lineStringFeature]
      });
      const updatedFeatures = features.replacePosition(0, [0], [10, 20]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [[10, 20], [3, 4]];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });

    it('replaces middle position in Polygon', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [polygonFeature]
      });
      const updatedFeatures = features
        .replacePosition(0, [0, 1], [1.1, -1.1])
        .replacePosition(0, [1, 2], [0.6, 0.6]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
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
      const updatedFeatures = features.replacePosition(0, [0, 0], [-1.1, -1.1]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
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
      const updatedFeatures = features.replacePosition(0, [0, 4], [-1.1, -1.1]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [
        [[-1.1, -1.1], [1, -1], [1, 1], [-1, 1], [-1.1, -1.1]],
        [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]]
      ];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });
  });

  describe('removePosition()', () => {
    it(`doesn't mutate original`, () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [lineStringFeature]
      });
      const updatedFeatures = features.removePosition(0, [0]);

      expect(updatedFeatures).not.toBe(features);
      expect(lineStringFeature.geometry.coordinates).toEqual([[1, 2], [3, 4]]);
    });

    it('throws exception when attempting to remove Point', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [pointFeature]
      });

      expect(() => features.removePosition(0, [])).toThrow(
        'Must specify the index of the position to remove'
      );
    });

    it('removes first position in LineString', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [lineStringFeature]
      });
      const updatedFeatures = features.removePosition(0, [0]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [[3, 4]];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });

    it('removes middle position in Polygon', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [polygonFeature]
      });
      const updatedFeatures = features.removePosition(0, [0, 1]).removePosition(0, [1, 3]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
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
      const updatedFeatures = features.removePosition(0, [1, 0]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
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
      const updatedFeatures = features.removePosition(0, [1, 4]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [
        [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]],
        [[0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5]]
      ];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });
  });

  describe('addPosition()', () => {
    it(`doesn't mutate original`, () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [lineStringFeature]
      });
      const updatedFeatures = features.addPosition(0, [1], [2, 3]);

      expect(updatedFeatures).not.toBe(features);
      expect(lineStringFeature.geometry.coordinates).toEqual([[1, 2], [3, 4]]);
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
      const updatedFeatures = features.addPosition(0, [0], [10, 20]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [[10, 20], [1, 2], [3, 4]];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });

    it('adds position to middle of LineString', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [lineStringFeature]
      });
      const updatedFeatures = features.addPosition(0, [1], [10, 20]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [[1, 2], [10, 20], [3, 4]];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });

    it('adds position to end of LineString', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [lineStringFeature]
      });
      const updatedFeatures = features.addPosition(0, [2], [10, 20]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [[1, 2], [3, 4], [10, 20]];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });

    it('adds position in Polygon', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [polygonFeature]
      });
      const updatedFeatures = features
        .addPosition(0, [0, 1], [0, -1])
        .addPosition(0, [1, 4], [0, -0.5]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [
        [[-1, -1], [0, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]],
        [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [0, -0.5], [-0.5, -0.5]]
      ];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });

    it('throws exception attempting to add before first position in Polygon', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [polygonFeature]
      });

      expect(() => features.addPosition(0, [1, 0])).toThrow(
        'Invalid position index for polygon: 0. Points must be added to a Polygon between the first and last point.'
      );
    });

    it('throws exception attempting to add after last position in Polygon', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [polygonFeature]
      });

      expect(() => features.addPosition(0, [1, 5])).toThrow(
        'Invalid position index for polygon: 5. Points must be added to a Polygon between the first and last point.'
      );
    });
  });

  describe('addFeature()', () => {
    it(`doesn't mutate original`, () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: []
      });
      features.addFeature(pointFeature);

      expect(features.getObject().features.length).toEqual(0);
    });

    it('adds feature to empty array', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: []
      });
      const actualFeatures = features.addFeature(pointFeature).getObject();

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
      const actualFeatures = features.addFeature(multiLineStringFeature).getObject();

      const expectedFeatures = {
        type: 'FeatureCollection',
        features: [multiPointFeature, multiLineStringFeature]
      };

      expect(actualFeatures).toEqual(expectedFeatures);
    });
  });

  describe('upgradePointToLineString()', () => {
    it('upgrades a Point to a LineString', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [pointFeature]
      });
      const updatedFeatures = features.upgradePointToLineString(0, [3, 4]);

      const actualGeometry = updatedFeatures.getObject().features[0].geometry;
      const expectedGeometry = {
        type: 'LineString',
        coordinates: [[1, 2], [3, 4]]
      };

      expect(actualGeometry).toEqual(expectedGeometry);
    });

    it('throws exception attempting to call on non-Point', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [polygonFeature]
      });

      expect(() => features.upgradePointToLineString(0, [3, 4])).toThrow(
        'Must be performed on a Point feature but requested on Polygon feature'
      );
    });
  });

  describe('convertLineStringToPolygon()', () => {
    it('upgrades a Point to a LineString', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [[-1, -1], [1, -1], [1, 1], [-1, 1]]
            }
          }
        ]
      });
      const updatedFeatures = features.convertLineStringToPolygon(0);

      const actualGeometry = updatedFeatures.getObject().features[0].geometry;
      const expectedGeometry = {
        type: 'Polygon',
        coordinates: [[[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]]]
      };

      expect(actualGeometry).toEqual(expectedGeometry);
    });

    it('throws exception attempting to call on non-LineString', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [polygonFeature]
      });

      expect(() => features.convertLineStringToPolygon(0)).toThrow(
        'Must be performed on a LineString feature but requested on Polygon feature'
      );
    });
  });

  describe('getEditHandles()', () => {
    it('gets edit handles for Point', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [pointFeature]
      });

      const actual = features.getEditHandles(0);
      const expected = [{ position: [1, 2], positionIndexes: [], type: 'existing' }];

      expect(actual).toEqual(expected);
    });

    it('gets edit handles for LineString', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [lineStringFeature]
      });

      const actual = features.getEditHandles(0);
      const expected = [
        { position: [1, 2], positionIndexes: [0], type: 'existing' },
        { position: [2, 3], positionIndexes: [1], type: 'intermediate' },
        { position: [3, 4], positionIndexes: [1], type: 'existing' }
      ];

      expect(actual).toEqual(expected);
    });

    it('gets edit handles for Polygon', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [polygonFeature]
      });

      const actual = features.getEditHandles(0);
      const expected = [
        { position: [-1, -1], positionIndexes: [0, 0], type: 'existing' },
        { position: [0, -1], positionIndexes: [0, 1], type: 'intermediate' },
        { position: [1, -1], positionIndexes: [0, 1], type: 'existing' },
        { position: [1, 0], positionIndexes: [0, 2], type: 'intermediate' },
        { position: [1, 1], positionIndexes: [0, 2], type: 'existing' },
        { position: [0, 1], positionIndexes: [0, 3], type: 'intermediate' },
        { position: [-1, 1], positionIndexes: [0, 3], type: 'existing' },
        { position: [-1, 0], positionIndexes: [0, 4], type: 'intermediate' },
        { position: [-1, -1], positionIndexes: [0, 4], type: 'existing' },
        { position: [-0.5, -0.5], positionIndexes: [1, 0], type: 'existing' },
        { position: [-0.5, 0], positionIndexes: [1, 1], type: 'intermediate' },
        { position: [-0.5, 0.5], positionIndexes: [1, 1], type: 'existing' },
        { position: [0, 0.5], positionIndexes: [1, 2], type: 'intermediate' },
        { position: [0.5, 0.5], positionIndexes: [1, 2], type: 'existing' },
        { position: [0.5, 0], positionIndexes: [1, 3], type: 'intermediate' },
        { position: [0.5, -0.5], positionIndexes: [1, 3], type: 'existing' },
        { position: [0, -0.5], positionIndexes: [1, 4], type: 'intermediate' },
        { position: [-0.5, -0.5], positionIndexes: [1, 4], type: 'existing' }
      ];

      expect(actual).toEqual(expected);
    });

    it('gets edit handles for MultiPoint', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [multiPointFeature]
      });

      const actual = features.getEditHandles(0);
      const expected = [
        { position: [1, 2], positionIndexes: [0], type: 'existing' },
        { position: [3, 4], positionIndexes: [1], type: 'existing' }
      ];

      expect(actual).toEqual(expected);
    });

    it('gets edit handles for MultiLineString', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [multiLineStringFeature]
      });

      const actual = features.getEditHandles(0);
      const expected = [
        { position: [1, 2], positionIndexes: [0, 0], type: 'existing' },
        { position: [2, 3], positionIndexes: [0, 1], type: 'intermediate' },
        { position: [3, 4], positionIndexes: [0, 1], type: 'existing' },
        { position: [5, 6], positionIndexes: [1, 0], type: 'existing' },
        { position: [6, 7], positionIndexes: [1, 1], type: 'intermediate' },
        { position: [7, 8], positionIndexes: [1, 1], type: 'existing' }
      ];

      expect(actual).toEqual(expected);
    });

    it('gets edit handles for MultiPolygon', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [multiPolygonFeature]
      });

      const actual = features.getEditHandles(0);
      const expected = [
        { position: [-1, -1], positionIndexes: [0, 0, 0], type: 'existing' },
        { position: [0, -1], positionIndexes: [0, 0, 1], type: 'intermediate' },
        { position: [1, -1], positionIndexes: [0, 0, 1], type: 'existing' },
        { position: [1, 0], positionIndexes: [0, 0, 2], type: 'intermediate' },
        { position: [1, 1], positionIndexes: [0, 0, 2], type: 'existing' },
        { position: [0, 1], positionIndexes: [0, 0, 3], type: 'intermediate' },
        { position: [-1, 1], positionIndexes: [0, 0, 3], type: 'existing' },
        { position: [-1, 0], positionIndexes: [0, 0, 4], type: 'intermediate' },
        { position: [-1, -1], positionIndexes: [0, 0, 4], type: 'existing' },
        { position: [-0.5, -0.5], positionIndexes: [0, 1, 0], type: 'existing' },
        { position: [-0.5, 0], positionIndexes: [0, 1, 1], type: 'intermediate' },
        { position: [-0.5, 0.5], positionIndexes: [0, 1, 1], type: 'existing' },
        { position: [0, 0.5], positionIndexes: [0, 1, 2], type: 'intermediate' },
        { position: [0.5, 0.5], positionIndexes: [0, 1, 2], type: 'existing' },
        { position: [0.5, 0], positionIndexes: [0, 1, 3], type: 'intermediate' },
        { position: [0.5, -0.5], positionIndexes: [0, 1, 3], type: 'existing' },
        { position: [0, -0.5], positionIndexes: [0, 1, 4], type: 'intermediate' },
        { position: [-0.5, -0.5], positionIndexes: [0, 1, 4], type: 'existing' },
        { position: [2, -1], positionIndexes: [1, 0, 0], type: 'existing' },
        { position: [3, -1], positionIndexes: [1, 0, 1], type: 'intermediate' },
        { position: [4, -1], positionIndexes: [1, 0, 1], type: 'existing' },
        { position: [4, 0], positionIndexes: [1, 0, 2], type: 'intermediate' },
        { position: [4, 1], positionIndexes: [1, 0, 2], type: 'existing' },
        { position: [3, 1], positionIndexes: [1, 0, 3], type: 'intermediate' },
        { position: [2, 1], positionIndexes: [1, 0, 3], type: 'existing' },
        { position: [2, 0], positionIndexes: [1, 0, 4], type: 'intermediate' },
        { position: [2, -1], positionIndexes: [1, 0, 4], type: 'existing' }
      ];

      expect(actual).toEqual(expected);
    });
  });
});

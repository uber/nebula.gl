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

  describe('replaceCoordinate()', () => {
    it(`doesn't mutate original`, () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [pointFeature]
      });
      features.replaceCoordinate(0, [], [10, 20]);

      expect(pointFeature.geometry.coordinates).toEqual([1, 2]);
    });

    it('replaces coordinate in Point', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [pointFeature]
      });
      const updatedFeatures = features.replaceCoordinate(0, [], [10, 20]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [10, 20];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });

    it('replaces first coordinate in LineString', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [lineStringFeature]
      });
      const updatedFeatures = features.replaceCoordinate(0, [0], [10, 20]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [[10, 20], [3, 4]];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });

    it('replaces middle coordinate in Polygon', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [polygonFeature]
      });
      const updatedFeatures = features
        .replaceCoordinate(0, [0, 1], [1.1, -1.1])
        .replaceCoordinate(0, [1, 2], [0.6, 0.6]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [
        [[-1, -1], [1.1, -1.1], [1, 1], [-1, 1], [-1, -1]],
        [[-0.5, -0.5], [-0.5, 0.5], [0.6, 0.6], [0.5, -0.5], [-0.5, -0.5]]
      ];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });

    it('replaces last coordinate when replacing first coordinate in Polygon', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [polygonFeature]
      });
      const updatedFeatures = features.replaceCoordinate(0, [0, 0], [-1.1, -1.1]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [
        [[-1.1, -1.1], [1, -1], [1, 1], [-1, 1], [-1.1, -1.1]],
        [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]]
      ];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });

    it('replaces first coordinate when replacing last coordinate in Polygon', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [polygonFeature]
      });
      const updatedFeatures = features.replaceCoordinate(0, [0, 4], [-1.1, -1.1]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [
        [[-1.1, -1.1], [1, -1], [1, 1], [-1, 1], [-1.1, -1.1]],
        [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, -0.5]]
      ];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });
  });

  describe('removeCoordinate()', () => {
    it(`doesn't mutate original`, () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [lineStringFeature]
      });
      features.removeCoordinate(0, [0]);

      expect(lineStringFeature.geometry.coordinates).toEqual([[1, 2], [3, 4]]);
    });

    it('throws exception when attempting to remove Point', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [pointFeature]
      });

      expect(() => features.removeCoordinate(0, [])).toThrow(
        'Must specify the index of the coordinate to remove'
      );
    });

    it('removes first coordinate in LineString', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [lineStringFeature]
      });
      const updatedFeatures = features.removeCoordinate(0, [0]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [[3, 4]];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });

    it('removes middle coordinate in Polygon', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [polygonFeature]
      });
      const updatedFeatures = features.removeCoordinate(0, [0, 1]).removeCoordinate(0, [1, 3]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [
        [[-1, -1], [1, 1], [-1, 1], [-1, -1]],
        [[-0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [-0.5, -0.5]]
      ];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });

    it('changes last coordinate when removing first coordinate in Polygon', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [polygonFeature]
      });
      const updatedFeatures = features.removeCoordinate(0, [1, 0]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [
        [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]],
        [[-0.5, 0.5], [0.5, 0.5], [0.5, -0.5], [-0.5, 0.5]]
      ];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });

    it('changes first coordinate when removing last coordinate in Polygon', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [polygonFeature]
      });
      const updatedFeatures = features.removeCoordinate(0, [1, 4]);

      const actualCoordinates = updatedFeatures.getObject().features[0].geometry.coordinates;
      const expectedCoordinates = [
        [[-1, -1], [1, -1], [1, 1], [-1, 1], [-1, -1]],
        [[0.5, -0.5], [-0.5, 0.5], [0.5, 0.5], [0.5, -0.5]]
      ];

      expect(actualCoordinates).toEqual(expectedCoordinates);
    });
  });

  describe('getEditHandles()', () => {
    it('gets edit handles for Point', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [pointFeature]
      });

      const actual = features.getEditHandles(0);
      const expected = [{ position: [1, 2], indexes: [] }];

      expect(actual).toEqual(expected);
    });

    it('gets edit handles for LineString', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [lineStringFeature]
      });

      const actual = features.getEditHandles(0);
      const expected = [{ position: [1, 2], indexes: [0] }, { position: [3, 4], indexes: [1] }];

      expect(actual).toEqual(expected);
    });

    it('gets edit handles for Polygon', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [polygonFeature]
      });

      const actual = features.getEditHandles(0);
      const expected = [
        { position: [-1, -1], indexes: [0, 0] },
        { position: [1, -1], indexes: [0, 1] },
        { position: [1, 1], indexes: [0, 2] },
        { position: [-1, 1], indexes: [0, 3] },
        { position: [-1, -1], indexes: [0, 4] },
        { position: [-0.5, -0.5], indexes: [1, 0] },
        { position: [-0.5, 0.5], indexes: [1, 1] },
        { position: [0.5, 0.5], indexes: [1, 2] },
        { position: [0.5, -0.5], indexes: [1, 3] },
        { position: [-0.5, -0.5], indexes: [1, 4] }
      ];

      expect(actual).toEqual(expected);
    });

    it('gets edit handles for MultiPoint', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [multiPointFeature]
      });

      const actual = features.getEditHandles(0);
      const expected = [{ position: [1, 2], indexes: [0] }, { position: [3, 4], indexes: [1] }];

      expect(actual).toEqual(expected);
    });

    it('gets edit handles for MultiLineString', () => {
      const features = new EditableFeatureCollection({
        type: 'FeatureCollection',
        features: [multiLineStringFeature]
      });

      const actual = features.getEditHandles(0);
      const expected = [
        { position: [1, 2], indexes: [0, 0] },
        { position: [3, 4], indexes: [0, 1] },
        { position: [5, 6], indexes: [1, 0] },
        { position: [7, 8], indexes: [1, 1] }
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
        { position: [-1, -1], indexes: [0, 0, 0] },
        { position: [1, -1], indexes: [0, 0, 1] },
        { position: [1, 1], indexes: [0, 0, 2] },
        { position: [-1, 1], indexes: [0, 0, 3] },
        { position: [-1, -1], indexes: [0, 0, 4] },
        { position: [-0.5, -0.5], indexes: [0, 1, 0] },
        { position: [-0.5, 0.5], indexes: [0, 1, 1] },
        { position: [0.5, 0.5], indexes: [0, 1, 2] },
        { position: [0.5, -0.5], indexes: [0, 1, 3] },
        { position: [-0.5, -0.5], indexes: [0, 1, 4] },
        { position: [2, -1], indexes: [1, 0, 0] },
        { position: [4, -1], indexes: [1, 0, 1] },
        { position: [4, 1], indexes: [1, 0, 2] },
        { position: [2, 1], indexes: [1, 0, 3] },
        { position: [2, -1], indexes: [1, 0, 4] }
      ];

      expect(actual).toEqual(expected);
    });
  });
});

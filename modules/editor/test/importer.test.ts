/* eslint-disable max-nested-callbacks */
/* eslint-env jest, browser */

import sinon from 'sinon';
import { Feature, FeatureCollection } from '@nebula.gl/edit-modes';
import { parseImport } from '../src/lib/importer';
import { toKml, UNNAMED } from '../src/lib/exporter';

import {
  createRandomFeature,
  createRandomPolygon,
  createRandomMultiPolygon,
  createRandomLineString,
  createRandomMultiLineString,
} from './utils/test-features';

let unsavedFeature: Feature;
let featureCollection: FeatureCollection;

beforeEach(() => {
  unsavedFeature = createRandomFeature();

  featureCollection = {
    type: 'FeatureCollection',
    properties: {},
    features: [unsavedFeature],
  };
});

describe('parseImport()', () => {
  describe('GeoJSON Feature string', () => {
    let importData: any;
    beforeEach(async () => {
      importData = await parseImport(JSON.stringify(unsavedFeature));
    });

    test('parses feature', () => {
      expect(importData.valid).toEqual(true);
      expect(importData.type).toEqual('GeoJSON');
      expect(importData.features[0].properties.name).toEqual(unsavedFeature.properties.name);
    });
  });

  describe('GeoJSON FeatureCollection string', () => {
    let importData: any;
    beforeEach(async () => {
      importData = await parseImport(JSON.stringify(featureCollection));
    });

    test('parses features', () => {
      expect(importData.valid).toEqual(true);
      expect(importData.type).toEqual('GeoJSON');

      expect(importData.features.map((f) => f.properties.name)).toEqual(
        featureCollection.features.map((f) => f.properties.name)
      );
      expect(importData.features.map((f) => f.geometry)).toEqual(
        featureCollection.features.map((f) => f.geometry)
      );
    });

    test('removes protected properties', () => {
      for (const feature of importData.features) {
        expect(feature.properties.entity_type).toBeUndefined();
      }
    });
  });

  describe('KML string', () => {
    let importData: any;
    beforeEach(async () => {
      importData = await parseImport(toKml(featureCollection).data);
    });

    test('parses features', () => {
      expect(importData.valid).toEqual(true);
      expect(importData.type).toEqual('KML');

      expect(importData.features.map((f) => f.properties.name)).toEqual(
        featureCollection.features.map((f) => f.properties.name || UNNAMED)
      );

      expect(importData.features.map((f) => f.geometry)).toEqual(
        featureCollection.features.map((f) => f.geometry)
      );
    });
  });

  describe('WKT string', () => {
    let importData: any;
    beforeEach(async () => {
      importData = await parseImport('POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))');
    });

    test('parses features', () => {
      expect(importData.valid).toEqual(true);
      expect(importData.type).toEqual('WKT');

      expect(importData.features.length).toEqual(1);
      expect(importData.features[0].properties).toEqual({});
      expect(importData.features[0].geometry).toEqual({
        type: 'Polygon',
        coordinates: [
          [
            [30, 10],
            [40, 40],
            [20, 40],
            [10, 20],
            [30, 10],
          ],
        ],
      });
    });
  });

  describe('GeoJSON file', () => {
    let importData: any;
    beforeEach(async () => {
      const file = new File([JSON.stringify(unsavedFeature)], 'my.geojson', {
        type: 'text/plain;charset=utf-8;',
      });
      importData = await parseImport(file);
    });

    test('parses feature', () => {
      expect(importData.valid).toEqual(true);
      expect(importData.type).toEqual('GeoJSON');
      expect(importData.features[0].properties.name).toEqual(unsavedFeature.properties.name);
    });
  });

  describe('GeometryCollection', () => {
    describe('only single geometry', () => {
      let polygon;
      let geometryCollection;
      let importData: any;
      beforeEach(async () => {
        polygon = createRandomPolygon();
        geometryCollection = {
          type: 'GeometryCollection',
          geometries: [polygon],
        };

        const feature = { type: 'Feature', geometry: geometryCollection };

        importData = await parseImport(JSON.stringify(feature));
      });

      test('obtains single geometry', () => {
        expect(importData.valid).toEqual(true);
        expect(importData.features.length).toEqual(1);

        expect(importData.features[0].geometry).toEqual(polygon);
      });
    });

    describe('only Polygons', () => {
      let multiPolygon;
      let geometryCollection;
      let importData: any;
      beforeEach(async () => {
        multiPolygon = createRandomMultiPolygon();
        geometryCollection = {
          type: 'GeometryCollection',
          geometries: multiPolygon.coordinates.map((c) => ({
            type: 'Polygon',
            coordinates: c,
          })),
        };

        const feature = { type: 'Feature', geometry: geometryCollection };

        importData = await parseImport(JSON.stringify(feature));
      });

      test('combines into MultiPolygon', () => {
        expect(importData.valid).toEqual(true);
        expect(importData.features.length).toEqual(1);

        expect(importData.features[0].geometry).toEqual(multiPolygon);
      });
    });

    describe('only LineString', () => {
      let multiLineString;
      let geometryCollection;
      let importData: any;
      beforeEach(async () => {
        multiLineString = createRandomMultiLineString();
        geometryCollection = {
          type: 'GeometryCollection',
          geometries: multiLineString.coordinates.map((c) => ({
            type: 'LineString',
            coordinates: c,
          })),
        };

        const feature = { type: 'Feature', geometry: geometryCollection };

        importData = await parseImport(JSON.stringify(feature));
      });

      test('combines into MultiLineString', () => {
        expect(importData.valid).toEqual(true);
        expect(importData.features.length).toEqual(1);

        expect(importData.features[0].geometry).toEqual(multiLineString);
      });
    });
  });

  describe('negative tests', () => {
    describe('Invalid JSON', () => {
      let importData: any;
      beforeEach(async () => {
        importData = await parseImport('{abc');
      });

      test('reports error', () => {
        expect(importData.valid).toEqual(false);
        expect(importData.validationErrors).toEqual([
          'Error parsing GeoJSON',
          'SyntaxError: Unexpected token a in JSON at position 1',
        ]);
      });
    });

    describe('Invalid GeoJSON', () => {
      let importData: any;
      beforeEach(async () => {
        importData = await parseImport('{}');
      });

      test('reports error', () => {
        expect(importData.valid).toEqual(false);
        expect(importData.validationErrors).toEqual([
          'Error parsing GeoJSON',
          `Error: GeoJSON must have type of 'Feature' or 'FeatureCollection'`,
        ]);
      });
    });

    describe('Invalid KML: togeojson throws', () => {
      let importData: any;

      beforeEach(async () => {
        const togeojson = require('@tmcw/togeojson'); // eslint-disable-line
        sinon.replace(togeojson, 'kml', sinon.fake.throws(Error('barf')));

        importData = await parseImport('<abc');
      });

      afterEach(() => {
        sinon.restore();
      });

      test('reports error', () => {
        expect(importData.valid).toEqual(false);
        expect(importData.validationErrors).toEqual(['Error parsing KML', 'Error: barf']);
      });
    });

    describe('Invalid KML: togeojson returns undefined', () => {
      let importData: any;

      beforeEach(async () => {
        const togeojson = require('@tmcw/togeojson'); // eslint-disable-line
        sinon.replace(togeojson, 'kml', sinon.fake.returns(undefined));

        importData = await parseImport('<abc />');
      });

      afterEach(() => {
        sinon.restore();
      });

      test('reports error', () => {
        expect(importData.valid).toEqual(false);
        expect(importData.validationErrors).toEqual(['Invalid KML']);
      });
    });

    describe('Invalid KML: togeojson returns blank FeatureCollection', () => {
      let importData: any;

      beforeEach(async () => {
        const togeojson = require('@tmcw/togeojson'); // eslint-disable-line
        sinon.replace(
          togeojson,
          'kml',
          sinon.fake.returns({ type: 'FeatureCollection', features: [] })
        );

        importData = await parseImport('<abc />');
      });

      afterEach(() => {
        sinon.restore();
      });

      test('reports error', () => {
        expect(importData.valid).toEqual(false);
        expect(importData.validationErrors).toEqual(['Invalid KML']);
      });
    });

    describe('Invalid WKT', () => {
      let importData: any;

      beforeEach(async () => {
        importData = await parseImport('POLYGON(zzz)');
      });

      test('reports error', () => {
        expect(importData.valid).toEqual(false);
        expect(importData.validationErrors).toEqual(['Invalid WKT']);
      });
    });

    describe('Unknown type', () => {
      let importData: any;
      beforeEach(async () => {
        importData = await parseImport('abc');
      });

      test('reports error', () => {
        expect(importData.valid).toEqual(false);
        expect(importData.validationErrors).toEqual([`Unknown data format`]);
      });
    });

    describe('GeometryCollection with mixed types', () => {
      let geometryCollection;
      let importData: any;
      beforeEach(async () => {
        geometryCollection = {
          type: 'GeometryCollection',
          geometries: [createRandomLineString(), createRandomPolygon()],
        };

        const feature = { type: 'Feature', geometry: geometryCollection };

        importData = await parseImport(JSON.stringify(feature));
      });

      test('combines into MultiPolygon', () => {
        expect(importData.valid).toEqual(false);
        expect(importData.validationErrors).toEqual([
          'Error parsing GeoJSON',
          'Error: GeometryCollection geometry type not yet supported',
        ]);
      });
    });
  });
});

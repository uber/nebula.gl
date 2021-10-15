/* eslint-env jest */

import { Feature, FeatureCollection } from '@nebula.gl/edit-modes';
import { toGeoJson, toKml, toWkt, toStats } from '../src/lib/exporter';
import { createRandomFeature } from './utils/test-features';

let feature: Feature;
let featureCollection: FeatureCollection;

// @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'beforeEach'.
beforeEach(() => {
  feature = createRandomFeature();
  feature.properties.name = 'My Feature';

  const feature2 = createRandomFeature();
  feature2.properties.name = 'My Other Feature';

  featureCollection = {
    type: 'FeatureCollection',
    properties: {},
    features: [feature, feature2],
  };
});

// @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('toGeoJson()', () => {
  // @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('feature', () => {
    const expectedFilename = `myfile.geojson`;
    const expectedMimeType = 'application/json';

    const actual = toGeoJson(feature, 'myfile');
    const actualParsed = JSON.parse(actual.data);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.filename).toEqual(expectedFilename);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.mimetype).toEqual(expectedMimeType);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actualParsed.properties.name).toEqual(feature.properties.name);
  });

  // @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('feature collection', () => {
    const expectedFilename = `geojsonFeatures.geojson`;
    const expectedMimeType = 'application/json';

    const actual = toGeoJson(featureCollection, 'geojsonFeatures');
    const actualParsed: FeatureCollection = JSON.parse(actual.data);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.filename).toEqual(expectedFilename);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.mimetype).toEqual(expectedMimeType);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actualParsed.features[0].properties.name).toEqual(
      featureCollection.features[0].properties.name
    );
  });
});

// @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('toKml()', () => {
  // @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('feature', () => {
    const expectedFilename = `myfile.kml`;
    const expectedMimeType = 'application/xml';

    const actual = toKml(feature, 'myfile');

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.filename).toEqual(expectedFilename);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.mimetype).toEqual(expectedMimeType);

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.data).toContain(`<name>${feature.properties.name}</name>`);
  });
});

// @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('toWkt()', () => {
  // @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('feature', () => {
    const expectedFilename = `llamallama.wkt`;
    const expectedMimeType = 'text/plain';
    const expectedData = 'POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))';

    const actual = toWkt(
      {
        type: 'Feature',
        geometry: {
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
        },
      },
      'llamallama'
    );

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.filename).toEqual(expectedFilename);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.mimetype).toEqual(expectedMimeType);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.data).toEqual(expectedData);
  });

  // @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('feature collection', () => {
    const expectedFilename = `geojsonFeatures.wkt`;
    const expectedMimeType = 'text/plain';
    const expectedData =
      'POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))\nPOLYGON ((3 1, 4 4, 2 4, 1 2, 3 1))';

    const actual = toWkt(
      {
        type: 'FeatureCollection',
        properties: {},
        features: [
          {
            type: 'Feature',
            geometry: {
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
            },
          },
          {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [3, 1],
                  [4, 4],
                  [2, 4],
                  [1, 2],
                  [3, 1],
                ],
              ],
            },
          },
        ],
      },
      'geojsonFeatures'
    );

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.filename).toEqual(expectedFilename);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.mimetype).toEqual(expectedMimeType);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.data).toEqual(expectedData);
  });

  // @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('empty feature collection', () => {
    const expectedFilename = `geojsonFeatures.wkt`;
    const expectedMimeType = 'text/plain';
    const expectedData = '';

    const actual = toWkt(
      {
        type: 'FeatureCollection',
        properties: {},
        features: [],
      },
      'geojsonFeatures'
    );

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.filename).toEqual(expectedFilename);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.mimetype).toEqual(expectedMimeType);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.data).toEqual(expectedData);
  });
});

// @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('toStats()', () => {
  // @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('when feature', () => {
    const expectedFilename = `mystats.txt`;
    const expectedMimeType = 'text/plain';
    const expectedData = 'Features: 1\nPolygons: 1\nRings: 1\nPoints: 5';

    const actual = toStats(
      {
        type: 'Feature',
        geometry: {
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
        },
      },
      'mystats'
    );

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.filename).toEqual(expectedFilename);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.mimetype).toEqual(expectedMimeType);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.data).toEqual(expectedData);
  });

  // @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('feature collection', () => {
    const expectedFilename = `mystats.txt`;
    const expectedMimeType = 'text/plain';
    const expectedData = 'Features: 2\nPolygons: 3\nRings: 4\nPoints: 20';

    const actual = toStats(
      {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
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
            },
          },
          {
            type: 'Feature',
            geometry: {
              type: 'MultiPolygon',
              coordinates: [
                [
                  [
                    [3, 1],
                    [4, 4],
                    [2, 4],
                    [1, 2],
                    [3, 1],
                  ],
                  [
                    [3.5, 3.5],
                    [2, 3.5],
                    [1.5, 2],
                    [2.5, 1.5],
                    [3.5, 3.5],
                  ],
                ],
                [
                  [
                    [13, 11],
                    [14, 14],
                    [12, 14],
                    [11, 12],
                    [13, 11],
                  ],
                ],
              ],
            },
          },
        ],
      },
      'mystats'
    );

    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.filename).toEqual(expectedFilename);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.mimetype).toEqual(expectedMimeType);
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(actual.data).toEqual(expectedData);
  });
});

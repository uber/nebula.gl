/* eslint-env jest */

import { ModifyMode } from '../../src/lib/modify-mode';
import { Pick, ModeProps } from '../../src/types';
import {
  createFeatureCollectionProps,
  createPointerMoveEvent,
  createStartDraggingEvent,
  createStopDraggingEvent,
} from '../test-utils';
import { FeatureCollection, Position, Point, LineString, FeatureOf } from '../../src/geojson-types';

let pointFeature: FeatureOf<Point>;
let lineStringFeature: FeatureOf<LineString>;
let polygonFeature;
let polygonRectangleFeature;
let multiPointFeature;
let multiLineStringFeature;
let multiPolygonFeature;

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

  polygonRectangleFeature = {
    type: 'Feature',
    properties: { shape: 'Rectangle' },
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [-100, -100],
          [100, -100],
          [100, 100],
          [-100, 100],
          [-100, -100],
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
});

const mockMove = (mode, picks: Pick[], props: ModeProps<FeatureCollection>) => {
  const moveEvent = createPointerMoveEvent([100, 100], picks);
  mode.handlePointerMove(moveEvent, props);

  const startDragEvent = createStartDraggingEvent([100, 100], [100, 100], picks);
  mode.handleStartDragging(startDragEvent, props);

  const stopDragEvent = createStopDraggingEvent([110, 115], [100, 100], picks);
  mode.handleStopDragging(stopDragEvent, props);
};

test('Rectangular polygon feature preserves shape', () => {
  const mockOnEdit = jest.fn();
  const props = createFeatureCollectionProps({
    data: {
      type: 'FeatureCollection',
      features: [polygonRectangleFeature],
    } as FeatureCollection,
    selectedIndexes: [0],
    onEdit: mockOnEdit,
  });

  const mode = new ModifyMode();
  const guides = mode.getGuides(props);
  expect(guides).toMatchSnapshot();

  const guideFeature = guides.features[2];
  mockMove(mode, [{ index: 2, isGuide: true, object: guideFeature }], {
    ...props,
    modeConfig: { lockRectangles: true },
  });

  expect(mockOnEdit).toHaveBeenCalledTimes(1);
  const movedFeature = mockOnEdit.mock.calls[0][0].updatedData.features[0];
  expect(movedFeature).toMatchSnapshot();
  expect(props.data.features[0]).not.toEqual(movedFeature);
});

describe('getGuides()', () => {
  it('gets edit handles for Point', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [pointFeature],
      } as FeatureCollection,
      selectedIndexes: [0],
    });

    const guides = mode.getGuides(props);

    expect(guides).toMatchSnapshot();
  });

  it('gets edit handles for LineString', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [lineStringFeature],
      },
      selectedIndexes: [0],
    });

    const guides = mode.getGuides(props);

    expect(guides).toMatchSnapshot();
  });

  it('gets edit handles for Polygon', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [polygonFeature],
      },
      selectedIndexes: [0],
    });

    const guides = mode.getGuides(props);

    expect(guides).toMatchSnapshot();
  });

  it('gets edit handles for MultiPoint', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [multiPointFeature],
      },
      selectedIndexes: [0],
    });

    const guides = mode.getGuides(props);

    expect(guides).toMatchSnapshot();
  });

  it('gets edit handles for MultiLineString', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [multiLineStringFeature],
      },
      selectedIndexes: [0],
    });

    const guides = mode.getGuides(props);

    expect(guides).toMatchSnapshot();
  });

  it('gets edit handles for MultiPolygon', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [multiPolygonFeature],
      },
      selectedIndexes: [0],
    });

    const guides = mode.getGuides(props);

    expect(guides).toMatchSnapshot();
  });

  it('gets edit handles for all selected features in collection', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [lineStringFeature, pointFeature, multiPointFeature],
      } as FeatureCollection,
      selectedIndexes: [0, 2],
    });

    const guides = mode.getGuides(props);

    expect(guides).toMatchSnapshot();
  });

  const lineString: FeatureOf<LineString> = {
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
        [-122.41198539733887, 37.78109451335266],
      ],
    },
  };

  const point = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-122.40880966186523, 37.783536601521924],
    },
  };
  const pick = {
    object: lineString,
    isGuide: false,
    index: 0,
  };

  const mapCoords: Position = [-122.43862233312133, 37.77767798407437];

  it('includes an intermediate edit handle', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [lineString],
      } as FeatureCollection,
      selectedIndexes: [0],
      lastPointerMoveEvent: {
        picks: [pick],
        mapCoords,
        screenCoords: [42, 42],
        cancelPan: jest.fn(),
        sourceEvent: null,
      },
    });

    const guides = mode.getGuides(props);

    const intermediate = guides.features.find(
      ({ properties }) =>
        properties.guideType === 'editHandle' && properties.editHandleType === 'intermediate'
    );

    expect(intermediate).toMatchSnapshot();
  });

  it('does not add intermeidate edit handle when no picks provided', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [lineString],
      },
      selectedIndexes: [0],
    });

    const guides = mode.getGuides(props);

    const intermediate = guides.features.find(
      ({ properties }) =>
        properties.guideType === 'editHandle' && properties.editHandleType === 'intermediate'
    );
    expect(intermediate).toBeUndefined();
  });

  it('does not add intermeidate edit handle when too close to existing edit handle', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [lineString],
      } as FeatureCollection,
      selectedIndexes: [0],
      lastPointerMoveEvent: {
        picks: [
          pick,
          {
            isGuide: true,
            index: 42,
            object: {
              properties: { guideType: 'editHandle', editHandleType: 'existing', featureIndex: 0 },
              geometry: { coordinates: [] },
            },
          },
        ],
        mapCoords,
        screenCoords: [42, 42],
        cancelPan: jest.fn(),
        sourceEvent: null,
      },
    });

    const guides = mode.getGuides(props);

    const intermediate = guides.features.find(
      ({ properties }) =>
        properties.guideType === 'editHandle' && properties.editHandleType === 'intermediate'
    );
    expect(intermediate).toBeUndefined();
  });

  it('does not add intermeidate edit handle when pick is not a selected feature', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [lineString],
      } as FeatureCollection,
    });

    const guides = mode.getGuides(props);

    const intermediate = guides.features.find(
      ({ properties }) =>
        properties.guideType === 'editHandle' && properties.editHandleType === 'intermediate'
    );
    expect(intermediate).toBeUndefined();
  });

  it('does not add intermeidate edit handle when pick is a Point / MultiPoint', () => {
    const mode = new ModifyMode();
    const props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [point],
      } as FeatureCollection,
      selectedIndexes: [0],
      lastPointerMoveEvent: {
        picks: [
          {
            isGuide: false,
            index: 0,
            object: point,
          },
        ],
        mapCoords,
        screenCoords: [42, 42],
        cancelPan: jest.fn(),
        sourceEvent: null,
      },
    });
    const guides = mode.getGuides(props);
    const intermediate = guides.features.find(
      ({ properties }) =>
        properties.guideType === 'editHandle' && properties.editHandleType === 'intermediate'
    );
    expect(intermediate).toBeUndefined();
  });
});

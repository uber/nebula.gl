import { DrawPolygonMode } from '../../src/lib/draw-polygon-mode';
import { createFeatureCollectionProps, createClickEvent, createKeyboardEvent } from '../test-utils';

let props;
let mode;

beforeEach(() => {
  mode = new DrawPolygonMode();
  props = createFeatureCollectionProps({
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });

  mode.handleClick(createClickEvent([0, 2]), props);
  mode.handleClick(createClickEvent([2, 2]), props);
  mode.handleClick(createClickEvent([2, 0]), props);
});

describe('after double-clicking', () => {
  beforeEach(() => {
    mode.handleClick(
      createClickEvent(
        [-1, -1],
        [
          {
            index: -1,
            isGuide: true,
            object: {
              properties: {
                guideType: 'editHandle',
                positionIndexes: [2],
              },
            },
          },
        ]
      ),
      props
    );
  });
  it('calls onEdit with an added feature', () => {
    expect(props.onEdit).toHaveBeenCalledTimes(4);
    expect(props.onEdit.mock.calls[3][0].editType).toEqual('addFeature');
    expect(props.onEdit.mock.calls[3][0].updatedData.features).toEqual([
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 2],
              [2, 0],
              [2, 2],
              [0, 2],
            ],
          ],
        },
      },
    ]);
  });
});

describe('after hitting enter', () => {
  beforeEach(() => {
    mode.handleKeyUp(createKeyboardEvent('Enter'), props);
  });
  it('calls onEdit with an added feature', () => {
    expect(props.onEdit).toHaveBeenCalledTimes(4);
    expect(props.onEdit.mock.calls[3][0].editType).toEqual('addFeature');
    expect(props.onEdit.mock.calls[3][0].updatedData.features).toEqual([
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 2],
              [2, 0],
              [2, 2],
              [0, 2],
            ],
          ],
        },
      },
    ]);
  });
});

describe('after hitting escape', () => {
  beforeEach(() => {
    mode.handleKeyUp(createKeyboardEvent('Escape'), props);
  });

  it('calls onEdit with cancelFeature', () => {
    expect(props.onEdit).toHaveBeenCalledTimes(4);
    expect(props.onEdit.mock.calls[3][0].editType).toEqual('cancelFeature');
  });

  it(`doesn't change the data`, () => {
    const expectedData = {
      type: 'FeatureCollection',
      features: [],
    };
    expect(props.onEdit.mock.calls[3][0].updatedData).toEqual(expectedData);
  });

  it(`resets the click sequence`, () => {
    expect(mode.getClickSequence()).toEqual([]);
  });
});

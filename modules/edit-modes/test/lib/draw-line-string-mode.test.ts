/* eslint-env jest */

import { DrawLineStringMode } from '../../src/lib/draw-line-string-mode';
import { createFeatureCollectionProps, createClickEvent } from '../test-utils';

let props;

beforeAll(() => {
  const mode = new DrawLineStringMode();
  props = createFeatureCollectionProps({
    data: {
      type: 'FeatureCollection',
      features: [],
    },
  });

  mode.handleClick(createClickEvent([1, 2]), props);
  mode.handleClick(createClickEvent([3, 4]), props);
  mode.handleClick(createClickEvent([5, 6]), props);

  mode.handleClick(
    createClickEvent(
      [5.0000001, 6.0000001],
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

describe('while tentative', () => {
  it('calls onEdit', () => {
    expect(props.onEdit).toHaveBeenCalledTimes(4);

    expect(props.onEdit.mock.calls[0][0].editType).toEqual('addTentativePosition');
    expect(props.onEdit.mock.calls[0][0].editContext.position).toEqual([1, 2]);
    expect(props.onEdit.mock.calls[1][0].editType).toEqual('addTentativePosition');
    expect(props.onEdit.mock.calls[1][0].editContext.position).toEqual([3, 4]);
    expect(props.onEdit.mock.calls[2][0].editType).toEqual('addTentativePosition');
    expect(props.onEdit.mock.calls[2][0].editContext.position).toEqual([5, 6]);
  });

  it(`doesn't change the data`, () => {
    const expectedData = {
      type: 'FeatureCollection',
      features: [],
    };

    expect(props.onEdit.mock.calls[0][0].updatedData).toEqual(expectedData);
    expect(props.onEdit.mock.calls[1][0].updatedData).toEqual(expectedData);
    expect(props.onEdit.mock.calls[2][0].updatedData).toEqual(expectedData);
  });
});

describe('after double-clicking', () => {
  it('calls onEdit with an added feature', () => {
    expect(props.onEdit.mock.calls[3][0].editType).toEqual('addFeature');
    expect(props.onEdit.mock.calls[3][0].updatedData.features).toEqual([
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [1, 2],
            [3, 4],
            [5, 6],
          ],
        },
      },
    ]);
  });
});

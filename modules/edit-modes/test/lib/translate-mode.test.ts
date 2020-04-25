import { TransformMode } from '../../src/lib/transform-mode';
import {
  createFeatureCollectionProps,
  createPointerMoveEvent,
  createStartDraggingEvent,
  createStopDraggingEvent,
} from '../test-utils';
import { Pick, ModeProps } from '../../src/types';
import { FeatureCollection } from '../../src/geojson-types';

let transformMode: TransformMode;

let warnBefore;
beforeEach(() => {
  warnBefore = console.warn; // eslint-disable-line
  // $FlowFixMe
  console.warn = function () {}; // eslint-disable-line
  transformMode = new TransformMode();
});

afterEach(() => {
  // $FlowFixMe
  console.warn = warnBefore; // eslint-disable-line
});

const mockMove = (picks: Pick[], props: ModeProps<FeatureCollection>) => {
  const moveEvent = createPointerMoveEvent([-1, -1], picks);
  transformMode.handlePointerMove(moveEvent, props);

  const startDragEvent = createStartDraggingEvent([-1, -1], [-1, -1], picks);
  transformMode.handleStartDragging(startDragEvent, props);

  const stopDragEvent = createStopDraggingEvent([2, 3], [-1, -1], picks);
  transformMode.handleStopDragging(stopDragEvent, props);
};

test('Selected polygon feature can be translated', () => {
  const mockOnEdit = jest.fn();
  const props = createFeatureCollectionProps({
    selectedIndexes: [2],
    onEdit: mockOnEdit,
  });
  mockMove([{ index: 2, isGuide: false, object: null }], props);

  expect(mockOnEdit).toHaveBeenCalledTimes(1);
  const movedFeature = mockOnEdit.mock.calls[0][0].updatedData.features[2];
  expect(movedFeature).toMatchSnapshot();
  expect(props.data.features[2]).not.toEqual(movedFeature);
});

test('Non-picked selected polygon feature cannnot be translated', () => {
  const mockOnEdit = jest.fn();
  const props = createFeatureCollectionProps({
    selectedIndexes: [2],
    onEdit: mockOnEdit,
  });
  mockMove([], props);
  expect(mockOnEdit).toHaveBeenCalledTimes(0);
});

test('Picked non-selected polygon feature cannnot be translated', () => {
  const mockOnEdit = jest.fn();
  const props = createFeatureCollectionProps({
    selectedIndexes: [0],
    onEdit: mockOnEdit,
  });
  mockMove([{ index: 2, isGuide: false, object: null }], props);
  expect(mockOnEdit).toHaveBeenCalledTimes(0);
});

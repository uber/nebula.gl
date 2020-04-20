import { RotateMode } from '../../src/lib/rotate-mode';
import {
  createFeatureCollectionProps,
  createPointerMoveEvent,
  createStartDraggingEvent,
  createStopDraggingEvent,
} from '../test-utils';
import { Pick, ModeProps } from '../../src/types';
import { FeatureCollection } from '../../src/geojson-types';

let rotateMode: RotateMode;

let warnBefore;
beforeEach(() => {
  warnBefore = console.warn; // eslint-disable-line
  // $FlowFixMe
  console.warn = function () {}; // eslint-disable-line
  rotateMode = new RotateMode();
});

afterEach(() => {
  // $FlowFixMe
  console.warn = warnBefore; // eslint-disable-line
});

const mockRotate = (picks: Pick[], props: ModeProps<FeatureCollection>) => {
  rotateMode.getGuides(props);

  const moveEvent = createPointerMoveEvent([-1, -1], picks);
  rotateMode.handlePointerMove(moveEvent, props);

  const startDragEvent = createStartDraggingEvent([-1, -1], [-1, -1], picks);
  rotateMode.handleStartDragging(startDragEvent, props);

  const stopDragEvent = createStopDraggingEvent([2, 3], [-1, -1], picks);
  rotateMode.handleStopDragging(stopDragEvent, props);
};

test('Selected polygon feature can be rotated', () => {
  const mockOnEdit = jest.fn();
  const props = createFeatureCollectionProps({
    selectedIndexes: [2],
    onEdit: mockOnEdit,
  });
  const mockPicks = [
    {
      index: 2,
      isGuide: true,
      object: {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-2, -2] },
        properties: { guideType: 'editHandle', editHandleType: 'rotate' },
      },
    },
  ];
  mockRotate(mockPicks, props);

  expect(mockOnEdit).toHaveBeenCalledTimes(1);
  const scaledFeature = mockOnEdit.mock.calls[0][0].updatedData.features[2];
  expect(scaledFeature).toMatchSnapshot();
  expect(props.data.features[2]).not.toEqual(scaledFeature);
});

test('Selected polygon feature without edit handle picks cannot be rotated', () => {
  const mockOnEdit = jest.fn();
  const props = createFeatureCollectionProps({
    selectedIndexes: [2],
    onEdit: mockOnEdit,
  });

  mockRotate([], props);
  expect(mockOnEdit).toHaveBeenCalledTimes(0);
});

// @flow

import { TransformMode } from '../../src/lib/transform-mode';
import {
  createFeatureCollectionProps,
  createPointerMoveEvent,
  createStartDraggingEvent,
  createStopDraggingEvent
} from '../test-utils.js';
import { type Pick } from '../../src/types';

let transformMode: TransformMode;

let warnBefore;
beforeEach(() => {
  warnBefore = console.warn; // eslint-disable-line
  // $FlowFixMe
  console.warn = function() {}; // eslint-disable-line
  transformMode = new TransformMode();
});

afterEach(() => {
  // $FlowFixMe
  console.warn = warnBefore; // eslint-disable-line
});

describe('Transform - translate mode', () => {
  const mockMove = (picks: Pick[], props: Object) => {
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
      onEdit: mockOnEdit
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
      onEdit: mockOnEdit
    });
    mockMove([], props);
    expect(mockOnEdit).toHaveBeenCalledTimes(0);
  });

  test('Picked non-selected polygon feature cannnot be translated', () => {
    const mockOnEdit = jest.fn();
    const props = createFeatureCollectionProps({
      selectedIndexes: [0],
      onEdit: mockOnEdit
    });
    mockMove([{ index: 2, isGuide: false, object: null }], props);
    expect(mockOnEdit).toHaveBeenCalledTimes(0);
  });
});

describe('Transform - scale mode', () => {
  const mockScale = (picks: Pick[], props: Object) => {
    transformMode.getGuides(props);

    const moveEvent = createPointerMoveEvent([-1, -1], picks);
    transformMode.handlePointerMove(moveEvent, props);

    const startDragEvent = createStartDraggingEvent([-1, -1], [-1, -1], picks);
    transformMode.handleStartDragging(startDragEvent, props);

    const stopDragEvent = createStopDraggingEvent([2, 3], [-1, -1], picks);
    transformMode.handleStopDragging(stopDragEvent, props);
  };

  test('Selected polygon feature can be scaled', () => {
    const mockOnEdit = jest.fn();
    const props = createFeatureCollectionProps({
      selectedIndexes: [2],
      onEdit: mockOnEdit
    });
    const mockPicks = [
      {
        index: 2,
        isGuide: true,
        object: {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-2, -2] },
          properties: { guideType: 'editHandle', editHandleType: 'scale', index: 0 }
        }
      }
    ];
    mockScale(mockPicks, props);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    const scaledFeature = mockOnEdit.mock.calls[0][0].updatedData.features[2];
    expect(scaledFeature).toMatchSnapshot();
    expect(props.data.features[2]).not.toEqual(scaledFeature);
  });

  test('Selected polygon feature without edit handle picks cannot be scaled', () => {
    const mockOnEdit = jest.fn();
    const props = createFeatureCollectionProps({
      selectedIndexes: [2],
      onEdit: mockOnEdit
    });

    mockScale([], props);
    expect(mockOnEdit).toHaveBeenCalledTimes(0);
  });
});

describe('Transform - rotate mode', () => {
  const mockRotate = (picks: Pick[], props: Object) => {
    transformMode.getGuides(props);

    const moveEvent = createPointerMoveEvent([-1, -1], picks);
    transformMode.handlePointerMove(moveEvent, props);

    const startDragEvent = createStartDraggingEvent([-1, -1], [-1, -1], picks);
    transformMode.handleStartDragging(startDragEvent, props);

    const stopDragEvent = createStopDraggingEvent([2, 3], [-1, -1], picks);
    transformMode.handleStopDragging(stopDragEvent, props);
  };

  test('Selected polygon feature can be rotated', () => {
    const mockOnEdit = jest.fn();
    const props = createFeatureCollectionProps({
      selectedIndexes: [2],
      onEdit: mockOnEdit
    });
    const mockPicks = [
      {
        index: 2,
        isGuide: true,
        object: {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [-2, -2] },
          properties: { guideType: 'editHandle', editHandleType: 'rotate' }
        }
      }
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
      onEdit: mockOnEdit
    });

    mockRotate([], props);
    expect(mockOnEdit).toHaveBeenCalledTimes(0);
  });
});

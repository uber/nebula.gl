import { FeatureCollection } from '@nebula.gl/edit-modes';
import { DrawLineStringByDraggingMode } from '../../src/lib/draw-line-string-by-dragging-mode';
import {
  createFeatureCollectionProps,
  createStartDraggingEvent,
  createPointerMoveEvent,
  createStopDraggingEvent,
  createDraggingEvent,
} from '../test-utils';
import { ModeProps } from '../../src';

let props: ModeProps<FeatureCollection>;
let mode: DrawLineStringByDraggingMode;

describe('after drag', () => {
  beforeEach(() => {
    mode = new DrawLineStringByDraggingMode();
    props = createFeatureCollectionProps({
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    mode.handleStartDragging(createStartDraggingEvent([2, 2], [1, 2]), props);
  });

  it("doesn't call onEdit on a very short line", () => {
    mode.handleStopDragging(createStopDraggingEvent([4, 3], [1, 2]), props);
    const mockedOnEdit = vi.mocked(props.onEdit);
    expect(mockedOnEdit).toHaveBeenCalledTimes(0);
  });

  it('calls onEdit with new LineString feature', () => {
    mode.handleDragging(createDraggingEvent([2, 3], [1, 2]), props);
    mode.handleDragging(createDraggingEvent([3, 3], [1, 2]), props);
    mode.handleStopDragging(createStopDraggingEvent([4, 3], [1, 2]), props);

    const mockedOnEdit = vi.mocked(props.onEdit);
    expect(mockedOnEdit).toHaveBeenCalledTimes(1);

    expect(mockedOnEdit.mock.calls[0][0].editType).toEqual('addFeature');
    const features = mockedOnEdit.mock.calls[0][0].updatedData.features;
    expect(features.length).toBe(1);
    expect(features[0].geometry.coordinates).toEqual([
      [2, 3],
      [3, 3],
      [4, 3],
    ]);
  });
});

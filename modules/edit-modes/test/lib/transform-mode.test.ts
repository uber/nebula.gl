import { TransformMode } from '../../src/lib/transform-mode';
import { createFeatureCollectionProps, createPointerMoveEvent } from '../test-utils';

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

test('onUpdateCursor is only set to null once', () => {
  const mockOnUpdateCursor = jest.fn();
  const moveEvent = createPointerMoveEvent([-1, -1], []);
  const props = createFeatureCollectionProps({
    selectedIndexes: [2],
    onUpdateCursor: mockOnUpdateCursor,
  });
  transformMode.handlePointerMove(moveEvent, props);
  expect(mockOnUpdateCursor).toHaveBeenCalledTimes(1);
  expect(mockOnUpdateCursor).toBeCalledWith(null);
});

test('Transform mode correctly renders composited guides', () => {
  const props = createFeatureCollectionProps({ selectedIndexes: [2] });
  const guides: Array<any> = transformMode.getGuides(props).features;
  const scaleGuides = guides.filter((guide) => guide.properties.editHandleType === 'scale');
  expect(scaleGuides.length).toEqual(4);
  expect(scaleGuides).toMatchSnapshot();

  const rotateGuide = guides.filter((guide) => guide.properties.editHandleType === 'rotate');
  expect(rotateGuide.length).toEqual(1);
  expect(rotateGuide).toMatchSnapshot();

  const envelopingBox = guides.filter((guide) => guide.geometry.type === 'Polygon');
  expect(envelopingBox.length).toEqual(1);
  expect(envelopingBox).toMatchSnapshot();

  const rotateLineGuide = guides.filter((guide) => guide.geometry.type === 'LineString');
  expect(rotateLineGuide.length).toEqual(1);
  expect(rotateLineGuide).toMatchSnapshot();
});

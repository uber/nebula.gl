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
  const mockOnUpdateCursor = vi.fn();
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

  const lineGuides = guides.filter((guide) => guide.geometry.type === 'LineString');
  expect(lineGuides.length).toEqual(2);

  // scale bounding box
  expect(lineGuides[0].geometry.coordinates.length).toEqual(5);
  expect(lineGuides[0].geometry.coordinates[0]).toEqual(lineGuides[0].geometry.coordinates[4]);

  // rotation handle
  expect(lineGuides[1].geometry.coordinates.length).toEqual(2);

  expect(lineGuides).toMatchSnapshot();
});

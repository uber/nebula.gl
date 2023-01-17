import { MeasureAreaMode } from '../../src/lib/measure-area-mode';
import {
  createFeatureCollectionProps,
  createClickEvent,
  createPointerMoveEvent,
  createKeyboardEvent,
} from '../test-utils';

describe('move without click', () => {
  let mode;
  beforeEach(() => {
    mode = new MeasureAreaMode();
    mode.handlePointerMove(createPointerMoveEvent(), createFeatureCollectionProps());
  });

  it('tooltips are empty', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps());
    expect(tooltips).toEqual([]);
  });
});

describe('one click', () => {
  let mode;
  beforeEach(() => {
    mode = new MeasureAreaMode();
    mode.handleClick(createClickEvent([1, 2]), createFeatureCollectionProps());
  });

  it('tooltips are empty', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps());
    expect(tooltips).toEqual([]);
  });
});

describe('three clicks + pointer move', () => {
  let mode;
  let props;

  beforeEach(() => {
    mode = new MeasureAreaMode();
    props = createFeatureCollectionProps();
    mode.handleClick(createClickEvent([1, 1]), props);
    mode.handleClick(createClickEvent([-1, 1]), props);
    mode.handleClick(createClickEvent([-1, -1]), props);
    props.lastPointerMoveEvent = createPointerMoveEvent([1, -1]);
  });

  it('tooltip contains area', () => {
    const tooltips = mode.getTooltips(props);
    expect(tooltips).toMatchSnapshot();
  });

  it('can measure square meters', () => {
    const tooltips = mode.getTooltips(props);
    expect(tooltips[0].text).toContain('sq. m');
  });

  it('can format area', () => {
    const tooltips = mode.getTooltips({
      ...props,
      modeConfig: { formatTooltip: (area) => String(Math.round(area)) },
    });
    expect(tooltips[0].text).toEqual('49565599608');
  });
});

describe('finished drawing by clicking', () => {
  let mode: MeasureAreaMode;
  let props;

  beforeEach(() => {
    mode = new MeasureAreaMode();
    props = createFeatureCollectionProps();
    mode.handleClick(createClickEvent([1, 1]), props);
    mode.handleClick(createClickEvent([-1, 1]), props);
    mode.handleClick(createClickEvent([-1, -1]), props);
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

  it('the click sequence should be cleared', () => {
    expect(mode.getClickSequence()).toEqual([]);
  });

  it('onEdit should not be callled', () => {
    expect(props.onEdit).not.toBeCalled();
  });
});

describe('finished drawing by pressing enter', () => {
  let mode: MeasureAreaMode;
  let props;

  beforeEach(() => {
    mode = new MeasureAreaMode();
    props = createFeatureCollectionProps();
    mode.handleClick(createClickEvent([1, 1]), props);
    mode.handleClick(createClickEvent([-1, 1]), props);
    mode.handleClick(createClickEvent([-1, -1]), props);
    mode.handleKeyUp(createKeyboardEvent('Enter'), props);
  });

  it('the click sequence should be cleared', () => {
    expect(mode.getClickSequence()).toEqual([]);
  });

  it('onEdit should not be callled', () => {
    expect(props.onEdit).not.toBeCalled();
  });
});

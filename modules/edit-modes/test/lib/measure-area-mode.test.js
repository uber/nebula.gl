// @flow
/* eslint-env jest */

import { MeasureAreaMode } from '../../src/lib/measure-area-mode.js';
import {
  createFeatureCollectionProps,
  createClickEvent,
  createPointerMoveEvent
} from '../test-utils.js';

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
    const tooltips = mode.getTooltips({ ...props, modeConfig: { formatTooltip: String } });
    expect(tooltips[0].text).toEqual('49565599608.28442');
  });
});

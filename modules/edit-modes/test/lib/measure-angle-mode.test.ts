/* eslint-env jest */

import { MeasureAngleMode } from '../../src/lib/measure-angle-mode';
import {
  createFeatureCollectionProps,
  createClickEvent,
  createPointerMoveEvent,
} from '../test-utils';

describe('move without click', () => {
  let mode;
  beforeEach(() => {
    mode = new MeasureAngleMode();
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
    mode = new MeasureAngleMode();
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
    mode = new MeasureAngleMode();
    props = createFeatureCollectionProps();
    mode.handleClick(createClickEvent([1, 1]), props);
    mode.handleClick(createClickEvent([-1, 1]), props);
    mode.handleClick(createClickEvent([-1, -1]), props);
    props.lastPointerMoveEvent = createPointerMoveEvent([1, -1]);
  });

  it('tooltip contains angle', () => {
    const tooltips = mode.getTooltips(props);
    expect(tooltips).toMatchSnapshot();
  });

  it('can measure degrees', () => {
    const tooltips = mode.getTooltips(props);
    expect(tooltips[0].text).toContain('deg');
  });

  it('can format angle', () => {
    const tooltips = mode.getTooltips({
      ...props,
      modeConfig: { formatTooltip: (angle) => String(Math.round(angle)) },
    });
    expect(tooltips[0].text).toEqual('45');
  });
});

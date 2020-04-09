/* eslint-env jest */

import { MeasureDistanceMode } from '../../src/lib/measure-distance-mode';
import {
  createFeatureCollectionProps,
  createClickEvent,
  createPointerMoveEvent,
} from '../test-utils';

describe('move without click', () => {
  let mode;
  beforeEach(() => {
    mode = new MeasureDistanceMode();
    mode.handlePointerMove(createPointerMoveEvent(), createFeatureCollectionProps());
  });

  it('guides are empty', () => {
    const guides = mode.getGuides(createFeatureCollectionProps());
    expect(guides).toEqual({ type: 'FeatureCollection', features: [] });
  });

  it('tooltips are empty', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps());
    expect(tooltips).toEqual([]);
  });
});

describe('one click', () => {
  let mode;
  beforeEach(() => {
    mode = new MeasureDistanceMode();
    mode.handleClick(createClickEvent([1, 2]), createFeatureCollectionProps());
  });

  it('guides are a single point', () => {
    const guides = mode.getGuides(createFeatureCollectionProps());
    expect(guides).toMatchSnapshot();
  });

  it('tooltips are empty', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps());
    expect(tooltips).toEqual([]);
  });
});

describe('one click + pointer move', () => {
  let mode;
  beforeEach(() => {
    mode = new MeasureDistanceMode();
    mode.handleClick(createClickEvent([1, 2]), createFeatureCollectionProps());
    mode.handlePointerMove(createPointerMoveEvent([3, 4]), createFeatureCollectionProps());
  });

  it('guides are two points + line string', () => {
    const guides = mode.getGuides(createFeatureCollectionProps());
    expect(guides).toMatchSnapshot();
  });

  it('tooltip contains distance', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps());
    expect(tooltips).toMatchSnapshot();
  });
});

describe('two clicks', () => {
  let mode;
  beforeEach(() => {
    mode = new MeasureDistanceMode();
    mode.handleClick(createClickEvent([1, 2]), createFeatureCollectionProps());
    mode.handleClick(createClickEvent([3, 4]), createFeatureCollectionProps());
  });

  it('guides are two points + line string', () => {
    const guides = mode.getGuides(createFeatureCollectionProps());
    expect(guides).toMatchSnapshot();
  });

  it('tooltip contains distance', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps());
    expect(tooltips).toMatchSnapshot();
  });

  it('can measure kilometers', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps());
    expect(tooltips[0].text).toContain('kilometers');
  });

  it('can measure miles', () => {
    const tooltips = mode.getTooltips(
      createFeatureCollectionProps({ modeConfig: { turfOptions: { units: 'miles' } } })
    );
    expect(tooltips[0].text).toContain('miles');
  });

  it('can format distance', () => {
    const tooltips = mode.getTooltips(
      createFeatureCollectionProps({ modeConfig: { formatTooltip: String } })
    );
    expect(tooltips[0].text).toEqual('314.28368918020476');
  });
});

describe('two clicks + pointer move', () => {
  let mode;
  beforeEach(() => {
    mode = new MeasureDistanceMode();
    mode.handleClick(createClickEvent([1, 2]), createFeatureCollectionProps());
    mode.handleClick(createClickEvent([3, 4]), createFeatureCollectionProps());
    mode.handlePointerMove(createPointerMoveEvent([4, 5]), createFeatureCollectionProps());
  });

  it('ending point is clicked point not hovered point', () => {
    const guides = mode.getGuides(createFeatureCollectionProps());
    expect(guides.features[1].geometry.coordinates).toEqual([3, 4]);
  });

  it('tooltip contains distance', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps());
    expect(tooltips).toMatchSnapshot();
  });
});

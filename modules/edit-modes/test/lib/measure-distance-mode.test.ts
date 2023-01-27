import { MeasureDistanceMode } from '../../src/lib/measure-distance-mode';
import {
  createFeatureCollectionProps,
  createClickEvent,
  createPointerMoveEvent,
  createKeyboardEvent,
} from '../test-utils';

const expectToBeCloseToArray = (actual, expected) => {
  expect(actual.length).toBe(expected.length);
  actual.forEach((x, index) => expect(x).toBeCloseTo(expected[index], 1));
};

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

  it('tooltips are 0.00', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps());
    expect(tooltips[0].text).toContain('0.00');
  });
});

describe('one click - centerTooltipsOnLine = true', () => {
  let mode;
  const props = { modeConfig: { centerTooltipsOnLine: true } };
  beforeEach(() => {
    mode = new MeasureDistanceMode();
    mode.handleClick(createClickEvent([1, 2]), createFeatureCollectionProps(props));
  });

  it('tooltip is placed at [1,2]', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps(props));
    expect(tooltips[0].position).toEqual([1, 2]);
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

describe('one click + pointer move - centerTooltipsOnLine = true', () => {
  let mode;
  const props = { modeConfig: { centerTooltipsOnLine: true } };
  beforeEach(() => {
    mode = new MeasureDistanceMode();
    mode.handleClick(createClickEvent([1, 2]), createFeatureCollectionProps(props));
    mode.handlePointerMove(createPointerMoveEvent([1, 4]), createFeatureCollectionProps(props));
  });

  it('tooltips are on center of their respective line', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps(props));
    expect(tooltips[0].position).toEqual([1, 3]);
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
    expect(tooltips[tooltips.length - 1].text).toContain('miles');
  });

  it('can format distance', () => {
    const tooltips = mode.getTooltips(
      createFeatureCollectionProps({ modeConfig: { formatTooltip: String } })
    );
    expect(tooltips[tooltips.length - 1].text).toEqual('314.28368918020476');
  });
});

describe('two clicks - centerTooltipsOnLine = true', () => {
  let mode;
  const props = { modeConfig: { centerTooltipsOnLine: true } };

  beforeEach(() => {
    mode = new MeasureDistanceMode();
    mode.handleClick(createClickEvent([1, 2]), createFeatureCollectionProps(props));
    mode.handleClick(createClickEvent([1, 4]), createFeatureCollectionProps(props));
  });

  it('tooltips are on center of their respective line', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps(props));
    expect(tooltips[0].position).toEqual([1, 3]);
    expect(tooltips[1].position).toEqual([1, 4]);
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
    expect(guides.features[2].geometry.coordinates).toEqual([3, 4]);
  });

  it('tooltip contains distance', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps());
    expect(tooltips).toMatchSnapshot();
  });
});

describe('two clicks + pointer move - centerTooltipsOnLine = true', () => {
  let mode;
  const props = { modeConfig: { centerTooltipsOnLine: true } };

  beforeEach(() => {
    mode = new MeasureDistanceMode();
    mode.handleClick(createClickEvent([1, 2]), createFeatureCollectionProps(props));
    mode.handleClick(createClickEvent([1, 4]), createFeatureCollectionProps(props));
    mode.handlePointerMove(createPointerMoveEvent([5, 4]), createFeatureCollectionProps(props));
  });

  it('tooltips are on center of their respective line', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps(props));
    expect(tooltips[0].position).toEqual([1, 3]);
    expectToBeCloseToArray(tooltips[1].position, [3, 4]);
  });
});

describe('three clicks + pointer move', () => {
  let mode;
  beforeEach(() => {
    mode = new MeasureDistanceMode();
    mode.handleClick(createClickEvent([1, 2]), createFeatureCollectionProps());
    mode.handleClick(createClickEvent([3, 4]), createFeatureCollectionProps());
    mode.handleClick(createClickEvent([4, 5]), createFeatureCollectionProps());
    mode.handlePointerMove(createPointerMoveEvent([6, 7]), createFeatureCollectionProps());
  });

  it('first feature is a tentative line that contains 4 points', () => {
    const guides = mode.getGuides(createFeatureCollectionProps());
    expect(guides.features[0].properties.guideType).toEqual('tentative');
    expect(guides.features[0].geometry.type).toEqual('LineString');
    expect(guides.features[0].geometry.coordinates.length).toEqual(4);
    expect(guides.features[0].geometry.coordinates[3]).toEqual([6, 7]);
  });

  it('Second feature is a editHandle point with coordinates [1,2]', () => {
    const guides = mode.getGuides(createFeatureCollectionProps());
    expect(guides.features[1].properties.guideType).toEqual('editHandle');
    expect(guides.features[1].geometry.type).toEqual('Point');
    expect(guides.features[1].geometry.coordinates).toEqual([1, 2]);
  });

  it('tooltip contains distance', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps());
    expect(tooltips).toMatchSnapshot();
  });
});

describe('three clicks + pointer move - centerTooltipsOnLine = true', () => {
  let mode;
  const props = { modeConfig: { centerTooltipsOnLine: true } };

  beforeEach(() => {
    mode = new MeasureDistanceMode();
    mode.handleClick(createClickEvent([1, 2]), createFeatureCollectionProps(props));
    mode.handleClick(createClickEvent([1, 4]), createFeatureCollectionProps(props));
    mode.handleClick(createClickEvent([5, 4]), createFeatureCollectionProps(props));
    mode.handlePointerMove(createPointerMoveEvent([11, 8]), createFeatureCollectionProps(props));
  });

  it('tooltips are on center of their respective line', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps(props));
    expect(tooltips[0].position).toEqual([1, 3]);
    expectToBeCloseToArray(tooltips[1].position, [3, 4]);
    expectToBeCloseToArray(tooltips[2].position, [8, 6]);
  });
});

describe('three clicks + pointer move + press Escape', () => {
  let mode;
  beforeEach(() => {
    mode = new MeasureDistanceMode();
    mode.handleClick(createClickEvent([1, 2]), createFeatureCollectionProps());
    mode.handleClick(createClickEvent([3, 4]), createFeatureCollectionProps());
    mode.handleClick(createClickEvent([4, 5]), createFeatureCollectionProps());
    mode.handlePointerMove(createPointerMoveEvent([6, 7]), createFeatureCollectionProps());
    mode.handleKeyUp(createKeyboardEvent('Escape'), createFeatureCollectionProps());
  });

  it('first feature is a tentative line that contains 3 points', () => {
    const guides = mode.getGuides(createFeatureCollectionProps());
    expect(guides.features[0].properties.guideType).toEqual('tentative');
    expect(guides.features[0].geometry.type).toEqual('LineString');
    expect(guides.features[0].geometry.coordinates.length).toEqual(3);
    expect(guides.features[0].geometry.coordinates[2]).toEqual([4, 5]);
  });

  it('tooltip contains distance', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps());
    expect(tooltips).toMatchSnapshot();
  });
});

describe('three clicks + pointer move + press Enter', () => {
  let mode;
  beforeEach(() => {
    mode = new MeasureDistanceMode();
    mode.handleClick(createClickEvent([1, 2]), createFeatureCollectionProps());
    mode.handleClick(createClickEvent([3, 4]), createFeatureCollectionProps());
    mode.handleClick(createClickEvent([4, 5]), createFeatureCollectionProps());
    mode.handlePointerMove(createPointerMoveEvent([6, 7]), createFeatureCollectionProps());
    mode.handleKeyUp(createKeyboardEvent('Enter'), createFeatureCollectionProps());
  });

  it('first feature is a tentative line that contains 3 points', () => {
    const guides = mode.getGuides(createFeatureCollectionProps());
    expect(guides.features[0].properties.guideType).toEqual('tentative');
    expect(guides.features[0].geometry.type).toEqual('LineString');
    expect(guides.features[0].geometry.coordinates.length).toEqual(4);
    expect(guides.features[0].geometry.coordinates[3]).toEqual([6, 7]);
  });

  it('tooltip contains distance', () => {
    const tooltips = mode.getTooltips(createFeatureCollectionProps());
    expect(tooltips).toMatchSnapshot();
  });
});

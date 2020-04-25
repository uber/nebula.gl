/* eslint-env jest */

import { DrawCircleByDiameterMode } from '../../src/lib/draw-circle-by-diameter-mode';
import {
  createFeatureCollectionProps,
  createFeatureCollection,
  createClickEvent,
  createPointerMoveEvent,
} from '../test-utils';
import { FeatureCollection } from '@nebula.gl/edit-modes';

let featureCollection: FeatureCollection;

let warnBefore;
beforeEach(() => {
  warnBefore = console.warn; // eslint-disable-line
  // $FlowFixMe
  console.warn = function () {}; // eslint-disable-line
  // @ts-ignore
  featureCollection = createFeatureCollection();

  const makeFlowHappy = featureCollection.features.find((f) => f.geometry.type === 'Polygon');
  if (!makeFlowHappy) {
    throw new Error(`Need a Polygon in my setup`);
  }
});

afterEach(() => {
  // $FlowFixMe
  console.warn = warnBefore; // eslint-disable-line
});

describe('dragToDraw=false', () => {
  it('sets tentative feature to a Polygon after first click', () => {
    const mode = new DrawCircleByDiameterMode();

    const props = createFeatureCollectionProps();
    props.lastPointerMoveEvent = createPointerMoveEvent([1, 2]);
    mode.handleClick(createClickEvent([1, 2]), props);
    props.lastPointerMoveEvent = createPointerMoveEvent([2, 3]);

    const tentativeFeature = mode.getTentativeGuide(props);

    if (!tentativeFeature) {
      throw new Error('Should have tentative feature');
    }

    expect(tentativeFeature.geometry.type).toEqual('Polygon');
    // @ts-ignore
    expect(tentativeFeature.geometry.coordinates[0].length).toEqual(65);
  });

  it('adds a new feature after two clicks', () => {
    const mode = new DrawCircleByDiameterMode();

    const props = createFeatureCollectionProps();
    props.lastPointerMoveEvent = createPointerMoveEvent([1, 2]);
    mode.handleClick(createClickEvent([1, 2]), props);
    props.lastPointerMoveEvent = createPointerMoveEvent([2, 3]);
    mode.handleClick(createClickEvent([2, 3]), props);

    expect(props.onEdit).toHaveBeenCalledTimes(1);
    // @ts-ignore
    const result = props.onEdit.mock.calls[0][0];
    expect(result.editType).toEqual('addFeature');
    expect(result.editContext.featureIndexes).toEqual([featureCollection.features.length]);

    const resultFeatures = result.updatedData.features;
    const newFeature = resultFeatures[resultFeatures.length - 1];
    expect(newFeature.properties.shape).toEqual('Circle');
    expect(newFeature.geometry.type).toEqual('Polygon');
    expect(newFeature.geometry.coordinates[0].length).toEqual(65);
  });
});

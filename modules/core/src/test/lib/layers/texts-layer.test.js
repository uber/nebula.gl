// @flow-ignore
import React from 'react';
import Renderer from 'react-test-renderer';

import { viewport } from '../../mocks';
import Nebula from '../../../react/nebula-react';
import TextsLayer from '../../../lib/layers/texts-layer';

it('test TextsLayer', () => {
  const textsLayer = new TextsLayer({ getData: [], toNebulaFeature: a => a });
  const Component = <Nebula viewport={viewport} layers={[textsLayer]} />;
  const renderer = Renderer.create(Component);
  expect(renderer.toJSON()).toMatchSnapshot();
});

// @flow-ignore
import React from 'react';
import Renderer from 'react-test-renderer';

import { viewport } from '../../mocks';
import Nebula from '../../../react/nebula-react';
import HtmlTooltipOverlay from '../../../react/overlays/html-tooltip-overlay';

it('test HtmlTooltipOverlay no items shown', () => {
  const Component = (
    <Nebula viewport={viewport} layers={[]}>
      <HtmlTooltipOverlay />
    </Nebula>
  );
  const renderer = Renderer.create(Component);
  expect(renderer.toJSON()).toMatchSnapshot();
});

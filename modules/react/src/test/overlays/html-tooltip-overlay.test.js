// @flow-ignore
import React from 'react';
import Renderer from 'react-test-renderer';

import { viewport } from '../../../../core/src/test/mocks';
import Nebula from '../../lib/nebula-react';
import HtmlTooltipOverlay from '../../lib/overlays/html-tooltip-overlay';

it('test HtmlTooltipOverlay no items shown', () => {
  const Component = (
    <Nebula viewport={viewport} layers={[]}>
      <HtmlTooltipOverlay />
    </Nebula>
  );
  const renderer = Renderer.create(Component);
  expect(renderer.toJSON()).toMatchSnapshot();
});

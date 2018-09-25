// @flow-ignore
import React from 'react';
import Renderer from 'react-test-renderer';

import { viewport } from '../../core/mocks';
import Nebula from '../../../modules/react/src/lib/nebula-react';
import HtmlTooltipOverlay from '../../../modules/react/src/lib/overlays/html-tooltip-overlay';

it('test HtmlTooltipOverlay no items shown', () => {
  const Component = (
    <Nebula viewport={viewport} layers={[]}>
      <HtmlTooltipOverlay />
    </Nebula>
  );
  const renderer = Renderer.create(Component);
  expect(renderer.toJSON()).toMatchSnapshot();
});

import React from 'react';
import Renderer from 'react-test-renderer';

import DeckGL from '@deck.gl/react';
import HtmlTooltipOverlay from '../src/html-tooltip-overlay';

it('test HtmlTooltipOverlay no items shown', () => {
  const Component = (
    // @ts-ignore
    <DeckGL>
      <HtmlTooltipOverlay />
    </DeckGL>
  );
  const renderer = Renderer.create(Component);
  expect(renderer.toJSON()).toMatchSnapshot();
});

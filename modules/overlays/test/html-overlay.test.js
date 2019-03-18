// @flow-ignore
import React from 'react';
import Renderer from 'react-test-renderer';

import DeckGL from 'deck.gl';
import HtmlOverlay from '../src/html-overlay';
import HtmlOverlayItem from '../src/html-overlay-item';

const initialViewState = {
  longitude: 0,
  latitude: 0,
  zoom: 10,
  pitch: 0,
  bearing: 0
};

it('test HtmlOverlay map center', () => {
  const Component = (
    <DeckGL initialViewState={initialViewState}>
      <HtmlOverlay>
        <HtmlOverlayItem coordinates={[0, 0, 0]}>Map Center Zero Elevation</HtmlOverlayItem>
        <HtmlOverlayItem coordinates={[0, 0, 50000]}>Map Center 50km Elevation</HtmlOverlayItem>
      </HtmlOverlay>
    </DeckGL>
  );
  const renderer = Renderer.create(Component);
  expect(renderer.toJSON()).toMatchSnapshot();
});

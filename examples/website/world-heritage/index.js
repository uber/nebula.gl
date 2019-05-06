/* global document */
import React from 'react';
import ReactDOM from 'react-dom';
import DeckGL from '@deck.gl/react';
import { HtmlOverlay, HtmlOverlayItem } from '@nebula.gl/overlays';
import { StaticMap } from 'react-map-gl';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoiZ2Vvcmdpb3MtdWJlciIsImEiOiJjanZidTZzczAwajMxNGVwOGZrd2E5NG90In0.gdsRu_UeU_uPi9IulBruXA';

const initialViewState = {
  longitude: -122.4,
  latitude: 37.7,
  zoom: 10,
  pitch: 0,
  bearing: 0
};

const layers = [];

function App() {
  return (
    <DeckGL initialViewState={initialViewState} layers={layers} controller={true}>
      <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      <HtmlOverlay>
        <HtmlOverlayItem key={1} style={{ background: 'cyan' }} coordinates={[0, 0, 0]}>
          Map Center
        </HtmlOverlayItem>
      </HtmlOverlay>
    </DeckGL>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);

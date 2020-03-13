// @flow
/* eslint-env browser */

import React from 'react';
import DeckGL from '@deck.gl/react';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { Toolbox } from '@nebula.gl/editor';
import { DrawPolygonMode } from '@nebula.gl/edit-modes';
import { StaticMap } from 'react-map-gl';

import { ModalProvider } from 'styled-react-modal';
import { FancyModalButton } from './import-modal.js';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoiZ2Vvcmdpb3MtdWJlciIsImEiOiJjanZidTZzczAwajMxNGVwOGZrd2E5NG90In0.gdsRu_UeU_uPi9IulBruXA';

const initialViewState = {
  longitude: -122.43,
  latitude: 37.775,
  zoom: 12
};

export function Example() {
  const [features, setFeatures] = React.useState({
    type: 'FeatureCollection',
    features: []
  });
  const [selectedFeatureIndexes] = React.useState([]);
  const [mode, setMode] = React.useState(() => DrawPolygonMode);
  const [modeConfig, setModeConfig] = React.useState(null);

  const layer = new EditableGeoJsonLayer({
    data: features,
    mode,
    modeConfig,
    selectedFeatureIndexes,

    onEdit: ({ updatedData }) => {
      setFeatures(updatedData);
    }
  });

  return (
    <>
      <DeckGL
        initialViewState={initialViewState}
        controller={{
          doubleClickZoom: false
        }}
        layers={[layer]}
        getCursor={layer.getCursor.bind(layer)}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
      <Toolbox
        position="topright"
        mode={mode}
        onSetMode={setMode}
        modeConfig={modeConfig}
        onSetModeConfig={setModeConfig}
      />
      <ModalProvider>
        <FancyModalButton onImport={geojson => setFeatures(geojson)} />
      </ModalProvider>
    </>
  );
}

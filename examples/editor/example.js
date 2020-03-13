// @flow

import React from 'react';
import DeckGL from '@deck.gl/react';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { Toolbox } from '@nebula.gl/editor';
import { DrawPolygonMode } from '@nebula.gl/edit-modes';
import { StaticMap } from 'react-map-gl';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoiZ2Vvcmdpb3MtdWJlciIsImEiOiJjanZidTZzczAwajMxNGVwOGZrd2E5NG90In0.gdsRu_UeU_uPi9IulBruXA';

const initialViewState = {
  longitude: -122.43,
  latitude: 37.775,
  zoom: 12
};

type ImportModalProps = {
  onImport: geojson => mixed
};

function ImportModal(props: ImportModalProps) {
  const divStyle = {
    position: 'absolute',
    top: '40px',
    left: '10px',
    display: 'flex',
    flexFlow: 'column'
  };

  const [text, setText] = React.useState('');
  return (
    <div style={divStyle}>
      Enter some text:
      <textarea onChange={event => setText(event.target.value)} />
      <button onClick={() => props.onImport(JSON.parse(text))}>Import Geometry</button>
    </div>
  );
}

export function Example() {
  const [features, setFeatures] = React.useState({
    type: 'FeatureCollection',
    features: []
  });
  const [selectedFeatureIndexes] = React.useState([]);
  const [mode, setMode] = React.useState(() => DrawPolygonMode);
  const [modeConfig, setModeConfig] = React.useState(null);

  const [showImportModal, setShowImportModal] = React.useState(false);

  const layer = new EditableGeoJsonLayer({
    data: features,
    mode,
    modeConfig,
    selectedFeatureIndexes,

    onEdit: ({ updatedData }) => {
      setFeatures(updatedData);
    }
  });

  function ImportButton() {
    const divStyle = {
      position: 'absolute',
      top: '10px',
      left: '10px',
      display: 'flex',
      flexFlow: 'column'
    };

    return (
      <div style={divStyle}>
        <button onClick={() => setShowImportModal(true)}>Import</button>
      </div>
    );
  }

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
      <ImportButton />
      {showImportModal && (
        <ImportModal
          onImport={geojson => {
            // console.log('GEOJSON!', geojson);
            setFeatures(geojson);
          }}
        />
      )}
    </>
  );
}

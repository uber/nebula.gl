/* eslint-env browser */

import * as React from 'react';
import DeckGL from '@deck.gl/react';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { Toolbox } from '@nebula.gl/editor';
import { ViewMode } from '@nebula.gl/edit-modes';
import { StaticMap } from 'react-map-gl';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoiZ2Vvcmdpb3MtdWJlciIsImEiOiJjanZidTZzczAwajMxNGVwOGZrd2E5NG90In0.gdsRu_UeU_uPi9IulBruXA';

const initialViewState = {
  longitude: -122.43,
  latitude: 37.775,
  zoom: 12,
};

export function Example() {
  const [geoJson, setGeoJson] = React.useState({
    type: 'FeatureCollection',
    features: [],
  });
  const [selectedFeatureIndexes] = React.useState([]);
  const [mode, setMode] = React.useState(() => ViewMode);

  const layer = new EditableGeoJsonLayer({
    data: geoJson,
    mode,
    selectedFeatureIndexes,
    onEdit: ({ updatedData }) => {
      setGeoJson(updatedData);
    },
  });

  return (
    <>
      <DeckGL
        initialViewState={initialViewState}
        controller={{
          doubleClickZoom: false,
        }}
        layers={[layer]}
        getCursor={layer.getCursor.bind(layer)}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
      <Toolbox
        mode={mode}
        geoJson={geoJson}
        onSetMode={setMode}
        onImport={(imported) =>
          setGeoJson({
            ...geoJson,
            features: [...geoJson.features, ...imported.features],
          })
        }
      />
    </>
  );
}

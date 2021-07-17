# Basic usage

## Imports

```jsx
import React from "react";
import DeckGL from "deck.gl";
import {
  EditableGeoJsonLayer,
  DrawLineStringMode,
  DrawPolygonMode
} from "nebula.gl";
import { StaticMap } from "react-map-gl";
```

## Inside your React component

```jsx
function GeometryEditor() {
  const [features, setFeatures] = React.useState({
    type: "FeatureCollection",
    features: []
  });
  const [mode, setMode] = React.useState(() => DrawPolygonMode);
  const [selectedFeatureIndexes] = React.useState([]);

  const layer = new EditableGeoJsonLayer({
    // id: "geojson-layer",
    data: features,
    mode,
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
      <div style={{ position: "absolute", top: 0, right: 0, color: "white" }}>
        <button
          onClick={() => setMode(() => DrawLineStringMode)}
          style={{ background: mode === DrawLineStringMode ? "#3090e0" : null }}
        >
          Line
        </button>
        <button
          onClick={() => setMode(() => DrawPolygonMode)}
          style={{ background: mode === DrawPolygonMode ? "#3090e0" : null }}
        >
          Polygon
        </button>
      </div>
    </>
  );
}
```

## See Also

- [EditableGeoJsonLayer](/docs/api-reference/layers/editable-geojson-layer)
- [Using deck.gl with React](https://deck.gl/#/documentation/getting-started/using-with-react)
- [Using deck.gl with a Base Map](https://deck.gl/#/documentation/getting-started/using-with-base-map)

# Basic usage

## Imports

```jsx
import * as React from 'react';
import DeckGL from '@deck.gl';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { StaticMap } from 'react-map-gl';
```

## Inside your React component

### Initialize

```jsx
constructor(props) {
  super(props);
  this.state = {
    geojson: {
      type: 'FeatureCollection',
      features: []
    }
  };
}
```

### Render

```jsx
render() {
  const editableLayer = new EditableGeoJsonLayer({
    id: 'geojson',
    data: this.state.geojson,
    mode: 'drawPoint',
    onEdit: ({ updatedData }) => {
      this.setState({ geojson: updatedData });
    }
  });
  return (
    <DeckGL
      initialViewState={initialViewState}
      controller={true}
      layers={[editableLayer]}
    >
      <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
    </DeckGL>
  );
}
```

## See Also

- [EditableGeoJsonLayer](/docs/api-reference/layers/editable-geojson-layer)
- [Using deck.gl with React](https://deck.gl/#/documentation/getting-started/using-with-react)
- [Using deck.gl with a Base Map](https://deck.gl/#/documentation/getting-started/using-with-base-map)

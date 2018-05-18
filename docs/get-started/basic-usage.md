# Basic usage

## Import Nebula, Layers and MapGL
```js
import {Feature, EditablePolygonsLayer, Nebula} from 'nebula.gl';
import MapGL from 'react-map-gl';
```

## Create a Layer and Provide Callbacks
```js
this.editablePolygonsLayer = new EditablePolygonsLayer({
  getData: () => [], // Your data here, data has to be objects with unique `id` field
  toNebulaFeature: data =>
    new Feature(data, {
      // Replace with your colors
      fillColor: [0, 0, 0, 0.4],
      outlineColor: [0.5, 0.5, 0.5, 1],
      lineWidthMeters: 10
    }),
  on: {
    mousedown: event => {
      // select the polygon you want to edit
      this.editablePolygonsLayer.selectedPolygonId = event.data.id;
      this.editablePolygonsLayer.selectedSubPolygonIndex = event.metadata.index;
      this.nebula.updateAllDeckObjects();
    },
    editEnd: (event, info) => {
      // Use resulting data
      console.log(info.feature.geoJson.geometry.coordinates);
    }
  }
});
```

## Render
```js
render() {
  const { editablePolygonsLayer, state } = this;
  let { viewport } = state;

  const layers = [editablePolygonsLayer];

  return (
    <div>
      <MapGL {...viewport} onChangeViewport={this._onChangeViewport}>
        <Nebula
          ref={nebula => (this.nebula = nebula || this.nebula)}
          {...{ layers, viewport }}
        />
      </MapGL>
    </div>
  );
}

_onChangeViewport = (viewport: Object) => {
  this.setState({
    viewport: { ...this.state.viewport, ...viewport }
  });
};
```

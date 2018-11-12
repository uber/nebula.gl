# SelectionLayer

This layer can be used to select deck.gl objects using mouse drawing.

```js
layers.push(
  new SelectionLayer({
    id: 'selection',
    selectionType: this.state.selectionTool,
    onSelect: ({ pickingInfos }) => {
      this.setState({ selectedFeatureIndexes: pickingInfos.map(pi => pi.index) });
    },
    layerIds: ['geojson'],

    getTentativeFillColor: () => [255, 0, 255, 100],
    getTentativeLineColor: () => [0, 0, 255, 255],
    getTentativeLineDashArray: () => [0, 0],
    lineWidthMinPixels: 3
  })
);
```


## Properties

Inherits all [deck.gl's Base Layer](https://uber.github.io/deck.gl/#/documentation/deckgl-api-reference/layers/layer) properties.

Also inherites **some** EditableGeoJsonLayer properties.

> Note: do not pass a data property.

#### `selectionType` (String, required)

* Default: `null`

SELECTION_TYPE.RECTANGLE or SELECTION_TYPE.POLYGON

#### `onSelect` (Function, required)

Called when selection is completed.

#### `layerIds` (String[], required)

Array of layer ids where we will search.


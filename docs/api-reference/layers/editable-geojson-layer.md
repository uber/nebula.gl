# EditableGeoJsonLayer

The Editable GeoJSON layer accepts a [GeoJSON](http://geojson.org) `FeatureCollection` and renders the features as editable polygons, lines, and points.

```js
import DeckGL from '@deck.gl/react';
import { EditableGeoJsonLayer, DrawPolygonMode } from 'nebula.gl';

const myFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    /* insert features here */
  ],
};

const selectedFeatureIndexes = [];

class App extends React.Component {
  state = {
    data: myFeatureCollection,
  };

  render() {
    const layer = new EditableGeoJsonLayer({
      id: 'geojson-layer',
      data: this.state.data,
      mode: DrawPolygonMode,
      selectedFeatureIndexes,

      onEdit: ({ updatedData }) => {
        this.setState({
          data: updatedData,
        });
      },
    });

    return <DeckGL {...this.props.viewport} layers={[layer]} />;
  }
}
```

## Properties

Inherits all [deck.gl's Base Layer](https://deck.gl/docs/api-reference/core/layer) properties.

`EditableGeoJSONLayer` is a [CompositeLayer](https://deck.gl/docs/api-reference/core/composite-layer) of [GeoJSONLayer](https://deck.gl/docs/api-reference/layers/geojson-layer), [ScatterPlotLayer](https://deck.gl/docs/api-reference/layers/scatterplot-layer), and [IconLayer](https://deck.gl/docs/api-reference/layers/icon-layer). Many of the properties and data getters of those layers are aliased.

#### `data` (Object, optional)

- Default: `null`

A [GeoJSON](http://geojson.org) `FeatureCollection` object. The following types of geometry are supported:

- `Point`
- `LineString`
- `Polygon`
- `MultiPoint`
- `MultiLineString`
- `MultiPolygon`
- `GeometryCollection` is not supported.

_Note: passing a single `Feature` is not supported. However, you can pass a `FeatureCollection` containing a single `Feature` and pass `selectedFeatureIndexes: [0]` to achieve the same result._

#### `mode` (Function|Object, optional)

- Default: `DrawPolygonMode`

The `mode` property defines the mode used to handle user interaction events (e.g. pointer events) in order to accomplish edits. This can either be a constructor for an `EditMode` or an instance of `EditMode`.

There are a extensive number of modes that come out-of-the-box with nebula.gl. See [modes overview](../modes/overview.md).

#### `modeConfig` (Object, optional)

- Default: `null`

An arbitrary object used to further configure the current mode.

Snapping-related `modeConfig` properties:

- `enableSnapping` (Boolean, optional) - Enables snapping for modes that support snapping such as translate mode.
- `additionalSnapTargets` (Object[], optional) - An array of GeoJSON Features that can be snapped to. This property only needs to be specified if you want to snap to features in other deck.gl layers. All features in this `EditableGeoJsonLayer` will be snap targets.

#### `selectedFeatureIndexes` (Array, optional)

- Default: `[]`

The `selectedFeatureIndexes` property distinguishes which features to treat as selected. This property is required when using the `DrawPolygonMode` edit mode.

- Features are identified by their index in the collection.

- Selection of a feature causes style accessors to render a different style, defined in function such as `getLineColor` and `getFillColor`.

- Selected features in mode `modify` will render edit handles. Only one feature may be selected while in mode `drawLineString` or `drawPolygon` to draw a feature.

_Note: make sure to pass in the same array instance on each render if you are not changing selection. Otherwise, nebula.gl may clear state on every render (e.g. may clear a drawing in progress if the viewport changes)._

#### `onEdit` (Function, optional)

The `onEdit` event is the core event provided by this layer and must be handled in order to accept and render edits. The `event` argument includes the following properties:

- `updatedData` (Object): A new `FeatureCollection` with the edit applied.

  - To accept the edit as is, supply this object into the `data` prop on the next render cycle (e.g. by calling React's `setState` function)

  - To reject the edit, do nothing

  - You may also supply a modified version of this object into the `data` prop on the next render cycle (e.g. if you have your own snapping logic).

- `editType` (String): The type of edit requested. One of:

  - `updateTentativeFeature`: Fired whenever a feature is near completion, and user continued dragging the cursor mid-editing. It fires on pointer move for `DrawPointMode`. The tentative feature created is different for each mode.

  - `movePosition`: A position was moved.

  - `addPosition`: A position was added (either at the beginning, middle, or end of a feature's coordinates).

  - `removePosition`: A position was removed. Note: it may result in multiple positions being removed in order to maintain valid GeoJSON (e.g. removing a point from a triangular hole will remove the hole entirely).

  - `addFeature`: A new feature was added. Its index is reflected in `featureIndexes`

  - `cancelFeature`: The new drawing was cancelled.

  - `finishMovePosition`: A position finished moving (e.g. user finished dragging).

  - `scaling`: A feature is being scaled.

  - `scaled`: A feature finished scaling (increase/decrease) (e.g. user finished dragging).

  - `rotating`: A feature is being rotated.

  - `rotated`: A feature finished rotating (e.g. user finished dragging).

  - `translating`: A feature is being translated.

  - `translated`: A feature finished translating (e.g. user finished dragging).

  - `startExtruding`: An edge started extruding (e.g. user started dragging).

  - `extruding`: An edge is extruding.
  - `extruded`: An edge finished extruding (e.g. user finished dragging).

  - `split`: A feature finished splitting.

* `featureIndexes` (Array&lt;number&gt;): The indexes of the edited/added features.

* `editContext` (Object): `null` or an object containing additional context about the edit. This is populated by the active mode, see [modes overview](../modes/overview.md).

### Guide style properties and data getters

#### `editHandleType`: (String, optional)

- Default `point`

Edit handles are points that are part of an existing geometry used for manipulation or snapping.

- `existing`
- `snap-source`
- `snap-target`
- `intermediate`
- `existing`
- `snap`

See the 'Edit Handles' section below.

#### `getTentativeLineColor` (Array|Function, optional)

- Default: `[0, 0, 0, 255]`

The line color for features that are being edited and are not yet finalized. See `getLineColor`in [DeckGl GeoJSONLayer](https://deck.gl/docs/api-reference/layers/geojson-layer).

#### `getTentativeFillColor` (Array|Function, optional)

- Default `[0, 0, 0, 255]`

The fill color for features that are being edited and are not yet finalized. See `getFillColor`in [DeckGl GeoJSONLayer](https://deck.gl/docs/api-reference/layers/geojson-layer).

#### `getTentativeLineWidth` (Function|Number, optional)

- Default `3`

The line width for features that are being edited and are not yet finalized, in units specified by lineWidthUnits (default meters). See `getLineWidth`in [DeckGl GeoJSONLayer](https://deck.gl/docs/api-reference/layers/geojson-layer).

If a number is provided, it is used as the outline width for all objects.
If a function is provided, it is called on each object to retrieve its outline width.
If not provided, it falls back to strokeWidth.

#### `editHandlePointRadiusScale`: (Function|Number, optional)

- Default: `1`

A global radius multiplier for all edit handle points. See `radiusScale` in [DeckGl ScatterplotLayer](https://deck.gl/docs/api-reference/layers/scatterplot-layer).

#### `editHandlePointOutline`: (Boolean|Function, optional)

- Default: `true`

Only draw outline of points. It falls back to outline if not provided. See `stroke` in [DeckGl ScatterplotLayer](https://deck.gl/docs/api-reference/layers/scatterplot-layer).

#### `editHandlePointStrokeWidth`: (Function|Number)

- Default: `2`

#### `editHandlePointRadiusMinPixels`: (Function|Number)

- Default: `4`

The minimum radius of the edit handle in pixels. This prop can be used to prevent the circle from getting too small when zoomed out. See `radiusMinPixels` in [DeckGl ScatterplotLayer](https://deck.gl/docs/api-reference/layers/scatterplot-layer).

#### `editHandlePointRadiusMaxPixels`: (Function|Number, optional)

- Default: `8`

The maximum radius of the edit handle in pixels. This prop can be used to prevent the circle from getting too big when zoomed in. See `radiusMaxPixels` in [DeckGl ScatterplotLayer](https://deck.gl/docs/api-reference/layers/scatterplot-layer).

#### `getEditHandlePointColor` (Array|Function, optional)

- Default: `[0, 0, 0, 255]`

The rgba color is in the format of `[r, g, b, [a]]`. Each channel is a number between 0-255 and `a` is 255 if not supplied.

If an array is provided, it is used as the filled color for all objects.

If a function is provided, it is called on each object to retrieve its color.

See `getFillColor` in [DeckGl ScatterplotLayer](https://deck.gl/docs/api-reference/layers/scatterplot-layer).

#### `getEditHandlePointOutlineColor` (Array|Function, optional)

- Default `[0, 0, 0, 255]`

The outline color of the edit handle point. See in DeckGl

The rgba color is in the format of `[r, g, b, [a]]`. Each channel is a number between 0-255 and `a` is 255 if not supplied.

If an array is provided, it is used as the outline color for all objects.

If a function is provided, it is called on each object to retrieve its color.

See `getLineColor` in [DeckGl ScatterplotLayer](https://deck.gl/docs/api-reference/layers/scatterplot-layer).

#### `getEditHandlePointRadius` (Function|Number, optional)

- Default: `1`

The radius of each edit handle, in units specified by radiusUnits (default `meters`).

If a number is provided, it is used as the radius for all objects.

If a function is provided, it is called on each object to retrieve its radius.

See `getRadius` in [DeckGl ScatterplotLayer](https://deck.gl/docs/api-reference/layers/scatterplot-layer).

---

#### `editHandleIconAtlas` (String|Texture2D|Image|ImageData|HTMLCanvasElement|HTMLVideoElement|ImageBitmap|Object, optional)

Default: `null`

See `iconAtlas`in [DeckGl IconLayer](https://deck.gl/docs/api-reference/layers/icon-layer).

#### `editHandleIconMapping` (Object|String, optional)

The atlas image.

If a string is supplied, it is interpreted as a URL or a Data URL.
One of the valid pixel sources for WebGL texture
A luma.gl Texture2D instance
A plain object that can be passed to the Texture2D constructor, e.g. `{width: <number>, height: <number>, data: <Uint8Array>}`. Note that whenever this object shallowly changes, a new texture will be created.
The image data will be converted to a Texture2D object. See textureParameters prop for advanced customization.

If you go with pre-packed strategy, this prop is required.

If you choose to use auto packing, this prop should be left empty.

See `iconMapping` in [DeckGl IconLayer](https://deck.gl/docs/api-reference/layers/icon-layer).

#### `editHandleIconSizeScale` (Number, optional)

- Default `1`

Edit handle icon size multiplier.

See `sizeScale` in [DeckGl IconLayer](https://deck.gl/docs/api-reference/layers/icon-layer).

#### `getEditHandleIcon` (Function, optional)

- Default: `d => d.icon`

Method called to retrieve the icon name of each edit handle, returns string or object.

If you go with pre-packed strategy, then getIcon should return a string representing name of the icon, used to retrieve icon definition from given iconMapping.

If you choose to use auto packing, then getIcon should return an object which contains the following properties.

- `url` (String, required): url to fetch the icon
- `height` (Number, required): height of icon
- `width` (Number, required): width of icon
- `id`: (String, optional): unique identifier of the icon, fall back to url if not specified
- `anchorX`, `anchorY`, `mask` are the same as mentioned in iconMapping

`IconLayer` use `id` (fallback to url) to dedupe icons. If for the same icon identifier, getIcon returns different `width` or `height`, `IconLayer` will only apply the first occurrence and ignore the rest of them.

See `getIcon` in [DeckGl IconLayer](https://deck.gl/docs/api-reference/layers/icon-layer).

#### `getEditHandleIconSize` (Function|Number, optional)

- Default `10`

The height of each edit handle icon, in units specified by `sizeUnits` (default pixels).

If a number is provided, it is used as the size for all objects.
If a function is provided, it is called on each object to retrieve its size.

See `getSize` in [DeckGl IconLayer](https://deck.gl/docs/api-reference/layers/icon-layer).

#### `getEditHandleIconColor` (Function|Array, optional)

- Default: `[0, 0, 0, 255]`

The rgba color is in the format of `[r, g, b, [a]]`. Each channel is a number between 0-255 and `a` is 255 if not supplied.

- If an array is provided, it is used as the color for all objects.
- If a function is provided, it is called on each object to retrieve its color.
- If `mask` = false, only the alpha component will be used to control the opacity of the icon.

See `getColor` in [DeckGl IconLayer](https://deck.gl/docs/api-reference/layers/icon-layer).

#### `getEditHandleIconAngle` (Function|Number, optional)

- Default `0`

The rotating angle of each edit handle icon, in degrees.

- If a number is provided, it is used as the angle for all objects.
- If a function is provided, it is called on each object to retrieve its angle.

See `getAngle` in [DeckGl IconLayer](https://deck.gl/docs/api-reference/layers/icon-layer).

#### `billboard` (Boolean, optional)

- Default: `true`

If on, the edit handle icon always faces camera. Otherwise the icon faces up (z)

##### Example

Consider the user removed the third position from a `Polygon`'s first ring, and that `Polygon` was the fourth feature in the `FeatureCollection`. The `event` argument would look like:

```js
{
  updatedData: {...},
  editType: 'removePosition',
  featureIndexes: [3],
  editContext: {
    positionIndexes: [1, 2],
    position: null
  }
}
```

#### `pickable` (Boolean, optional)

- Default: `true`

Defaulted to `true` for interactivity.

#### `pickingRadius` (Number, optional)

- Default: `10`

Number of pixels around the mouse cursor used for picking. This value determines, for example, what feature is considered to be clicked and what is close enough to be snapped to.

#### `pickingDepth` (Number, optional)

- Default: `5`

Number of layers of overlapping features that will be picked. Useful in cases where features overlap.

#### `pickingLineWidthExtraPixels` (Number, optional)

- Default: `0`

Additional line width in pixels used for picking. Can be useful when `EditableGeojsonLayer` is over a deck.gl layer and precise picking is problematic, and when usage of `pickingDepth` introduces performance issues.

### Sub Layers

`EditableGeoJsonLayer` renders the following sub-layers:

- `geojson`: a [GeoJsonLayer](https://deck.gl/docs/api-reference/layers/geojson-layer) that renders the GeoJSON features passed into the `data` property.
- `guides`: a [GeoJsonLayer](https://deck.gl/docs/api-reference/layers/geojson-layer) that renders GeoJSON features that aid in editing.
- `tooltips`: a [TextLayer](https://deck.gl/docs/api-reference/layers/text-layer) that renders tooltips used in some editing modes.

The styling and functionality of `EditableGeoJsonLayer` can be customized by providing the [\_subLayerProps](https://deck.gl/docs/api-reference/core/composite-layer#_sublayerprops) property. For example:

```js
new EditableGeoJsonLayer({
  // ...
  _subLayerProps: {
    geojson: {
      getFillColor: (feature) => getFillColorForFeature(feature),
      getLineColor: (feature) => getLineColorForFeature(feature),
    },
  },
});
```

#### `geojson` Sub Layer

The features being edited are rendered in the `geojson` sub layer whether they are selected or not. If you want to style selected features differently than unselected features, you can accomplish it like this:

```js
const [data] = React.useState(/* some GeoJSON */);
const [selectedFeatureIndexes] = React.useState(/* array of selected features */);

new EditableGeoJsonLayer({
  // ...
  data,
  selectedFeatureIndexes,
  _subLayerProps: {
    geojson: {
      getFillColor: (feature) => {
        if (selectedFeatureIndexes.some((i) => data.features[i] === feature)) {
          return SELECTED_FILL_COLOR;
        } else {
          return UNSELECTED_FILL_COLOR;
        }
      },
    },
  },
});
```

#### `guides` Sub Layer

There are two types of "guides" rendered in the `guides` sub layer differentiated by `properties.guideType` of each feature.

##### Tentative Features

While creating a new feature in any of the `draw` modes, portion of a feature which has not been "committed" yet can hold its own props. For example, in `drawLineString` mode, the tentative feature is the last line segment moving under the mouse. For polygons and ellipses, this would be the whole feature during drawing. A tentative feature can be identified by checking if `properties.guideType === 'tentative'`.

##### HotKey Support

Only `Escape` hotkey is currently supported to drop the Tentative feature entirely. However, if the feature is already committed, the `Escape` will do nothing. For example, when a point is drawn, it is finalized and no in drawing status.

##### Edit Handles

Edit handles are the points rendered on a feature to indicate interactive capabilities (e.g. vertices that can be moved). Edit Handles can be identified by checking if `properties.guideType === 'editHandle'`.

There are also different types of edit handles differentiated by `properties.editHandleType`:

- `existing`: this is an edit handle rendered at an existing position of a feature
- `intermediate`: this is an edit handle rendered between existing positions (e.g. to add new positions)
- `snap-source`: this is an edit handle being moved that can snap to a `snap-target` edit handle
- `snap-target`: this is an edit handle that will be snapped to if the pointer moves close enough

##### Example

This shows how you can override how guides are rendered:

```js
new EditableGeoJsonLayer({
  // ...
  _subLayerProps: {
    guides: {
      getFillColor: (guide) => {
        if (guide.properties.guideType === 'tentative') {
          return TENTATIVE_FILL_COLOR;
        } else {
          return EDIT_HANDLE_FILL_COLOR;
        }
      },
    },
  },
});
```

#### `tooltips` Sub Layer

Some modes will render tooltips. For example, the measure modes. These modes will render text in the `tooltips` sub layer.

```js
new EditableGeoJsonLayer({
  // ...
  _subLayerProps: {
    tooltips: {
      getSize: 32,
    },
  },
});
```

### Using without React

It is possible to use EditableGeoJsonLayer without react. Here's a working CodeSandbox:

https://codesandbox.io/s/deckgl-and-nebulagl-editablegeojsonlayer-no-react-p9yrs

Credit: [Graham Bates](https://github.com/mogmog) and [Andy Baker](https://github.com/andybak)

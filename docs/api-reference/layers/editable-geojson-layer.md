# EditableGeoJsonLayer

The Editable GeoJSON layer accepts a [GeoJSON](http://geojson.org) `FeatureCollection` and renders the features as editable polygons, lines, and points.

```js
import DeckGL from 'deck.gl';
import { EditableGeoJsonLayer } from 'nebula.gl';

const myFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    /* insert features here */
  ]
};

class App extends React.Component {
  state = {
    mode: 'modify',
    selectedFeatureIndexes: [0],
    data: myFeatureCollection
  };

  render() {
    const layer = new EditableGeoJsonLayer({
      id: 'geojson-layer',
      data: this.state.data,
      mode: this.state.mode,
      selectedFeatureIndexes: this.state.selectedFeatureIndexes,

      onEdit: ({ updatedData }) => {
        this.setState({
          data: updatedData,
        });
      }
    });

    return <DeckGL {...this.props.viewport} layers={[layer]} />;
  }
}
```

## Properties

Inherits all [deck.gl's Base Layer](https://uber.github.io/deck.gl/#/documentation/deckgl-api-reference/layers/layer) properties.

#### `data` (Object, optional)

* Default: `null`

A [GeoJSON](http://geojson.org) `FeatureCollection` object. The following types of geometry are supported:

* `Point`
* `LineString`
* `Polygon`
* `MultiPoint`
* `MultiLineString`
* `MultiPolygon`
* `GeometryCollection` is not supported.

_Note: passing a single `Feature` is not supported. However, you can pass a `FeatureCollection` containing a single `Feature` and pass `selectedFeatureIndexes: [0]` to achieve the same result._

#### `mode` (String, optional)

* Default: `modify`

The `mode` property dictates which `ModeHandler` from the `modeHandlers` prop will be used to handle user interaction events (e.g. pointer events) in order to accomplish edits. See [mode handlers overview](../mode-handlers/overview.md) for a description of the built-in modes.

#### `modeConfig` (Object, optional)

* Default: `null`

An arbitrary object used to further configure the current `ModeHandler`.

Snapping-related `modeConfig` properties:

* `enableSnapping` (Boolean, optional) - Enables snapping for modes that support snapping such as translate mode.
* `additionalSnapTargets` (Object[], optional) - An array of GeoJSON Features that can be snapped to. This property only needs to be specified if you want to snap to features in other deck.gl layers. All features in this `EditableGeoJsonLayer` will be snap targets.

#### `modeHandlers` (Object, optional)

* Default: see [mode handlers overview](../mode-handlers/overview.md)

A object containing a mapping of mode name (string) to an instance of a `ModeHandler`.

##### Example

For example, you can use this to provide your own custom `ModeHandler`:

```javascript
{
  //...
  modeHandlers: {
    ...EditableGeoJsonLayer.defaultProps.modeHandlers,
    myCustomMode: new MyCustomModeHandler()
  }
}
```

#### `selectedFeatureIndexes` (Array, optional)

* Default: `[]`

The `selectedFeatureIndexes` property distinguishes which features to treat as selected.

* Features are identified by their index in the collection.

* Selection of a feature causes style accessors to render a different style, defined in function such as `getLineColor` and `getFillColor`.

* Selected features in mode `modify` will render edit handles. Only one feature may be selected while in mode `drawLineString` or `drawPolygon` to draw a feature.

#### `onEdit` (Function, optional)

The `onEdit` event is the core event provided by this layer and must be handled in order to accept and render edits. The `event` argument includes the following properties:

* `updatedData` (Object): A new `FeatureCollection` with the edit applied.

  * To accept the edit as is, supply this object into the `data` prop on the next render cycle (e.g. by calling React's `setState` function)

  * To reject the edit, do nothing

  * You may also supply a modified version of this object into the `data` prop on the next render cycle (e.g. if you have your own snapping logic).

* `editType` (String): The type of edit requested. One of:

  * `movePosition`: A position was moved.

  * `addPosition`: A position was added (either at the beginning, middle, or end of a feature's coordinates).

  * `removePosition`: A position was removed. Note: it may result in multiple positions being removed in order to maintain valid GeoJSON (e.g. removing a point from a triangular hole will remove the hole entirely).

  * `addFeature`: A new feature was added. Its index is reflected in `featureIndexes`

  * `finishMovePosition`: A position finished moving (e.g. user finished dragging).

  * `scaling`: A feature is being scaled.

  * `scaled`: A feature finished scaling (increase/decrease) (e.g. user finished dragging).

  * `rotating`: A feature is being rotated.

  * `rotated`: A feature finished rotating (e.g. user finished dragging).

  * `translating`: A feature is being translated.

  * `translated`: A feature finished translating (e.g. user finished dragging).

  * `startExtruding`: An edge started extruding (e.g. user started dragging).

  * `extruding`: An edge is extruding.

  * `extruded`: An edge finished extruding (e.g. user finished dragging).

  * `split`: A feature finished splitting.

* `featureIndexes` (Array&lt;number&gt;): The indexes of the edited/added features.

* `editContext` (Object): `null` or an object containing additional context about the edit. This is populated by the active mode handler, see [mode handlers overview](../mode-handlers/overview.md).

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

* Default: `true`

Defaulted to `true` for interactivity.

#### `pickingRadius` (Number, optional)

* Default: `10`

Number of pixels around the mouse cursor used for picking. This value determines, for example, what feature is considered to be clicked and what is close enough to be snapped to.

#### `pickingDepth` (Number, optional)

* Default: `5`

Number of layers of overlapping features that will be picked. Useful in cases where features overlap.

### GeoJsonLayer Options

The following properties from [GeoJsonLayer](https://uber.github.io/deck.gl/#/documentation/deckgl-api-reference/layers/geojson-layer) are supported and function the same:

* `filled`
* `stroked`
* `lineWidthScale`
* `lineWidthMinPixels`
* `lineWidthMaxPixels`
* `lineWidthUnits`
* `lineJointRounded`
* `lineMiterLimit`
* `pointRadiusScale`
* `pointRadiusMinPixels`
* `pointRadiusMaxPixels`
* `lineDashJustified`
* `fp64`

The following accessors function the same, but can accept additional arguments:

* `getLineColor`
* `getFillColor`
* `getRadius`
* `getLineWidth`
* `getLineDashArray`

The additional arguments (in order) are:

* `feature`: the given feature
* `isSelected`: indicates if the given feature is a selected feature
* `mode`: the current value of the `mode` prop

### Tentative Features

While creating a new feature in any of the `draw` modes, portion of a feature which has not been "committed" yet can hold its own props. For example, in `drawLineString` mode, the tentative feature is the last line segment moving under the mouse. For polygons and ellipses, this would be the whole feature during drawing. Define the properties with the following accessors:

* `getTentativeLineColor`
* `getTentativeFillColor`
* `getTentativeLineWidth`
* `getTentativeLineDashArray`

The following accessors default to the same values as the existing feature accessors above. The arguments in order:

* `feature`: the segment/polygon that represents the tentative feature
* `mode`: the current value of the `mode` prop

### Edit Handles

Edit handles are the points rendered on a feature to indicate interactive capabilities (e.g. vertices that can be moved).

* `type` (String): either `existing` for existing positions or `intermediate` for positions half way between two other positions.

#### `editHandleType` (String, optional)

* Default: `point`

* `point`: Edit handles endered as points

* `icons`: Edit handles rendered as provided icons

Edit handle objects can be represented by either points or icons. `editHandlePoint...` are proxies for the [`ScatterplotLayer`](https://github.com/uber/deck.gl/blob/master/docs/layers/scatterplot-layer.md#properties) props, and `editHandleIcon...` are proxies for the [`IconLayer`](https://github.com/uber/deck.gl/blob/master/docs/layers/icon-layer.md#properties) props.

#### `editHandleParameters` (Object, optional)

* Default: `{}`

* Set luma.gl parameters for handles (eg. depthTest, blend)

#### `editHandlePointRadiusScale` (Number, optional)

* Default: `1`

#### `editHandlePointOutline` (Boolean, optional)

* Default: `false`

#### `editHandlePointStrokeWidth` (Number, optional)

* Default: `1`

#### `editHandlePointRadiusMinPixels` (Number, optional)

* Default: `4`

#### `editHandlePointRadiusMaxPixels` (Number, optional)

* Default: `Number.MAX_SAFE_INTEGER`

#### `getEditHandlePointColor` (Function | Array, optional)

* Default: `handle => handle.type === 'existing' ? [0xc0, 0x0, 0x0, 0xff] : [0x0, 0x0, 0x0, 0x80]`

#### `getEditHandlePointRadius` (Function | Number, optional)

* Default: `handle => (handle.type === 'existing' ? 5 : 3)`

#### `editHandleIconAtlas` (Texture2D | String, optional)

* Default: `null`

Atlas image url or texture.

#### `editHandleIconMapping` (Object | String, optional)

* Default: `null`

Icon names mapped to icon definitions. See [`Icon Layer`](https://github.com/uber/deck.gl/blob/master/docs/layers/icon-layer.md#iconmapping-object--string-required).

#### `editHandleIconSizeScale` (Number | optional)

* Default: `null`

Edit handle icon size multiplier.

#### `getEditHandleIcon` (Function, optional)

* Default: `handle => handle.type`

Method called to retrieve the icon name of each edit handle, returns string.

#### `getEditHandleIconSize` (Function | Number, optional)

* Default: `10`

The height of each edit handle, in pixels.

#### `getEditHandleIconColor` (Function | Array, optional)

* Default: `handle => handle.type === 'existing' ? [0xc0, 0x0, 0x0, 0xff] : [0x0, 0x0, 0x0, 0x80]`

#### `getEditHandleIconAngle` (Function | Number, optional)

* Default: `0`

The rotating angle of each object, in degrees.

## Methods

These methods can be overridden in a derived class in order to customize event handling.

### `onLayerClick`

The pointer went down and up without dragging. This method is called regardless if something was picked.

#### `event` argument

* `picks` (Array): An array containing [deck.gl Picking Info Objects](https://uber.github.io/deck.gl/#/documentation/developer-guide/adding-interactivity?section=what-can-be-picked-) for all objects that were under the pointer when clicked, or an empty array if nothing from this layer was under the pointer.
* `screenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas.
* `groundCoords` (Array): `[lng, lat]` ground coordinates.

### `onStartDragging`

The pointer went down on something rendered by this layer and the pointer started to move.

* `picks` (Array): An array containing [deck.gl Picking Info Objects](https://uber.github.io/deck.gl/#/documentation/developer-guide/adding-interactivity?section=what-can-be-picked-) for all objects that were under the pointer when it went down.
* `screenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer was when it was considered to start dragging (should be very close to `pointerDownScreenCoords`).
* `groundCoords` (Array): `[lng, lat]` ground coordinates where the pointer was when it was considered to start dragging (should be very close to `pointerDownGroundCoords`).
* `pointerDownScreenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer went down.
* `pointerDownGroundCoords` (Array): `[lng, lat]` ground coordinates where the pointer went down.

_Note: this method is not called if nothing was picked when the pointer went down_

### `onStopDragging`

The pointer went down on something rendered by this layer, the pointer moved, and now the pointer is up.

* `picks` (Array): An array containing [deck.gl Picking Info Objects](https://uber.github.io/deck.gl/#/documentation/developer-guide/adding-interactivity?section=what-can-be-picked-) for all objects that were under the pointer when it went down.
* `screenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer went up.
* `groundCoords` (Array): `[lng, lat]` ground coordinates where the pointer went up.
* `pointerDownScreenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer went down.
* `pointerDownGroundCoords` (Array): `[lng, lat]` ground coordinates where the pointer went down.

### `onPointerMove`

The pointer moved, regardless of whether the pointer is down, up, and whether or not something was picked

* `screenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer is now.
* `groundCoords` (Array): `[lng, lat]` ground coordinates where the pointer is now.
* `picks` (Array): An array containing [deck.gl Picking Info Objects](https://uber.github.io/deck.gl/#/documentation/developer-guide/adding-interactivity?section=what-can-be-picked-) for all objects that are under the pointer now.
* `isDragging` (Boolean): `true` if the pointer went down and has moved enough to consider the movement a drag gesture, otherwise `false`.
* `pointerDownPicks` (Array): An array containing [deck.gl Picking Info Objects](https://uber.github.io/deck.gl/#/documentation/developer-guide/adding-interactivity?section=what-can-be-picked-) for all objects that were under the pointer when it went down, if any. This will be populated even if the pointer hasn't yet moved enough to set `isDragging` to `true`.
* `pointerDownScreenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer went down.
* `pointerDownGroundCoords` (Array): `[lng, lat]` ground coordinates where the pointer went down.

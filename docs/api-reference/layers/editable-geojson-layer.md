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

      onEdit: ({ updatedData, updatedMode, updatedSelectedFeatureIndexes }) => {
        this.setState({
          data: updatedData,
          mode: updatedMode,
          selectedFeatureIndexes: updatedSelectedFeatureIndexes
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

The `mode` property dictates what type of edits the user can perform and how to handle user interaction events (e.g. pointer events) in order to accomplish those edits.

* `view`: no edits are possible, but selection is still possible.

* `modify`: user can move existing points, add intermediate points along lines, and remove points.

* `drawLineString`: user can draw a `LineString` feature by clicking positions to add.

  * If no feature is selected, clicking will create a new feature `Point` feature and select it (by passing its index as `updatedSelectedFeatureIndexes`).

  * If a `Point` feature is selected, clicking will convert it to a `LineString` and add the clicked position to it.

  * If a `LineString` feature is selected, clicking will add the clicked position to it.

  * If multiple features are selected, the user will be prevented from drawing

* `drawPolygon`: user can draw a new `Polygon` feature by clicking positions to add then closing the polygon.

  * If no feature is selected, clicking will create a new `Point` feature and select it (by passing its index as `updatedSelectedFeatureIndexes`).

  * If a `Point` feature is selected, clicking will convert it to a `LineString` and add the clicked position to it.

  * If a `LineString` feature is selected, clicking will add the clicked position to it. If that clicked position is the first position, the feature will be converted to a `Polygon` feature.

  * If multiple features are selected, the user will be prevented from drawing.

* `drawRectangle`: user can draw a new rectanglular `Polygon` feature by clicking two opposing corners of the rectangle.

  * If no feature is selected, clicking will create a new `Point` feature and select it (by passing its index as `updatedSelectedFeatureIndexes`).

  * If a `Point` feature is selected, clicking will convert it to a `Polygon` whose two opposing corners are the original point and the position clicked.

  * If a `LineString` feature is selected, the user will be prevented from drawing a rectangle.

  * If multiple features are selected, the user will be prevented from drawing.

* `drawCircle`: user can draw a new circular `Polygon` feature by clicking the center then along the ring.

  * If no feature is selected, clicking will create a new `Point` feature and select it (by passing its index as `updatedSelectedFeatureIndexes`).

  * If a `Point` feature is selected, clicking will convert it to a `Polygon` whose center is the original point and radius is the distance to the clicked position.

  * If a `LineString` feature is selected, the user will be prevented from drawing a circle.

  * If multiple features are selected, the user will be prevented from drawing.

* `drawEllipseByBoundingBox`: user can draw a new ellipse shape `Polygon` feature by clicking two corners of bounding box.

  * The center of ellipse will be center of two corners of bounding box.

  * If no feature is selected, clicking will create a new `Point` feature and select it (by passing its index as `updatedSelectedFeatureIndexes`).

  * If a `Point` feature is selected, clicking will convert it to a `Polygon` whose two opposing corners are the original point and the position clicked.

  * If a `LineString` feature is selected, the user will be prevented from drawing a rectangle.

  * If multiple features are selected, the user will be prevented from drawing.

#### `selectedFeaturesIndexes` (Array, optional)

* Default: `[]`

* The `selectedFeatueIndexes` property distinguishes which features to treat as selected.

  * Features are identified by their index in the collection.

  * Selection of a feature causes style accessors to render a different style, defined in function such as `getLineColor` and `getFillColor`.

  * Selected features in mode `modify` will render edit handles. Only one feature may be selected while in mode `drawLineString` or `drawPolygon` to draw a feature.

#### `onEdit` (Function, optional)

The `onEdit` event is the core event provided by this layer and must be handled in order to accept and render edits. The `event` argument includes the following properties:

* `updatedData` (Object): A new `FeatureCollection` with the edit applied.

  * To accept the edit as is, supply this object into the `data` prop on the next render cycle (e.g. by calling React's `setState` function)

  * To reject the edit, do nothing

  * You may also supply a modified version of this object into the `data` prop on the next render cycle (e.g. if you have your own snapping logic).

* `updatedMode` (String): A suggested value to use for `mode` after the edit is applied. Often this is the same value. But occasionally, an edit will need to transition the layer from one mode to another.

* `updatedSelectedFeatureIndexes` (Number): A suggested array to use for `selectedFeatureIndexes` after the edit is applied. Often this is the same array. But occasionally, an edit will change the selected features (e.g. when creating a new feature, it goes from `[]` to an array holding the index of the newly created feature).

* `editType` (String): The type of edit requested. One of:

  * `movePosition`: A position was moved.

  * `addPosition`: A position was added (either at the beginning, middle, or end of a feature's coordinates). Note: this may result in a feature being "upgraded" from one type to another (e.g. `Point` to `LineString` or `LineString` to `Polygon`).

  * `removePosition`: A position was removed. Note: this may result in a feature being "downgraded" from one type to another (e.g. `Polygon` to `LineString` or `LineString` to `Point`). It also may result in multiple positions being removed in order to maintain valid GeoJSON (e.g. removing a point from a triangular hole will remove the hole entirely).

  * `addFeature`: A new feature was added. Its index is reflected in `featureIndex`

  * `finishMovePosition`: A position finished moving (indicated by `pointerup`).

* `featureIndex` (Number): The index of the edited/added feature.

* `positionIndexes` (Array): An array of numbers representing the indexes of the edited position within the features' `coordinates` array

* `position` (Array): An array containing the ground coordinates (i.e. [lng, lat]) of the edited position (or `null` if it doesn't apply to the type of edit performed)

##### Example

Consider the user removed the third position from a `Polygon`'s first ring, and that `Polygon` was the fourth feature in the `FeatureCollection`. The `event` argument would look like:

```js
{
  updatedData: {...},
  updatedMode: 'modify',
  updatedSelectedFeatureIndexes: [3],
  editType: 'removePosition',
  featureIndex: 3,
  positionIndexes: [1, 2],
  position: null
}
```

#### `pickable` (Boolean, optional)

* Default: `true`

Defaulted to `true` for interactivity.

### GeoJsonLayer Options

The following properties from [GeoJsonLayer](https://uber.github.io/deck.gl/#/documentation/deckgl-api-reference/layers/geojson-layer) are supported and function the same:

* `filled`
* `stroked`
* `lineWidthScale`
* `lineWidthMinPixels`
* `lineWidthMaxPixels`
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

### Drawing Feature

While creating a new feature in any of the `draw` modes, portion of a feature which has not been "committed" yet can hold its own props. For a LineString, this would be the last line segment moving under the mouse. For a Polygon, this would be the last segment and the fill moving under the mouse. For Rectangles and Circles, this would be the whole feature during drawing. Define the properties with the following accessors:

* `getDrawLineColor`
* `getDrawFillColor`
* `getDrawLineWidth`
* `getDrawLineDashArray`

The following accessors default to the same values as the existing feature accessors above. The arguments in order:

* `feature`: the segment/polygon that represents the "uncommitted" feature
* `selectedFeature`: the "committed" feature which is being drawn/extended
* `mode`: the current value of the `mode` prop

### Edit Handles

Edit handles are the points rendered on a feature to indicate interactive capabilities (e.g. vertices that can be moved).

* `type` (String): either `existing` for existing positions or `intermediate` for positions half way between two other positions.

#### `editHandleType` (String, optional)

* Default: `point`

* `point`: Edit handles endered as points

* `icons`: Edit handles rendered as provided icons

Edit handle objects can be represented by either points or icons. `editHandlePoint...` are proxies for the [`ScatterplotLayer`](https://github.com/uber/deck.gl/blob/master/docs/layers/scatterplot-layer.md#properties) props, and `editHandleIcon...` are proxies for the [`IconLayer`](https://github.com/uber/deck.gl/blob/master/docs/layers/icon-layer.md#properties) props.

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

### `onClick`

The pointer went down and up without dragging. This method is called regardless if something was picked.

#### `event` argument

* `picks` (Array): An array containing [deck.gl Picking Info Objects](https://uber.github.io/deck.gl/#/documentation/developer-guide/adding-interactivity?section=what-can-be-picked-) for all objects that were under the pointer when clicked, or an empty array if nothing from this layer was under the pointer.
* `screenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas.
* `groundCoords` (Array): `[lng, lat]` ground coordinates.

### `onStartDragging`

The pointer went down on something rendered by this layer and the pointer started to move.

* `picks` (Array): An array containing [deck.gl Picking Info Objects](https://uber.github.io/deck.gl/#/documentation/developer-guide/adding-interactivity?section=what-can-be-picked-) for all objects that were under the pointer when it went down.
* `screenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer was when it was considered to start dragging (should be very close to `dragStartScreenCoords`).
* `groundCoords` (Array): `[lng, lat]` ground coordinates where the pointer was when it was considered to start dragging (should be very close to `dragStartGroundCoords`).
* `dragStartScreenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer went down.
* `dragStartGroundCoords` (Array): `[lng, lat]` ground coordinates where the pointer went down.

_Note: this method is not called if nothing was picked when the pointer went down_

### `onDragging`

The pointer went down on something rendered by this layer and the pointer is moving.

* `picks` (Array): An array containing [deck.gl Picking Info Objects](https://uber.github.io/deck.gl/#/documentation/developer-guide/adding-interactivity?section=what-can-be-picked-) for all objects that were under the pointer when it went down.
* `screenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer is now.
* `groundCoords` (Array): `[lng, lat]` ground coordinates where the pointer is now.
* `dragStartScreenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer went down.
* `dragStartGroundCoords` (Array): `[lng, lat]` ground coordinates where the pointer went down.

### `onStopDragging`

The pointer went down on something rendered by this layer, the pointer moved, and now the pointer is up.

* `picks` (Array): An array containing [deck.gl Picking Info Objects](https://uber.github.io/deck.gl/#/documentation/developer-guide/adding-interactivity?section=what-can-be-picked-) for all objects that were under the pointer when it went down.
* `screenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer went up.
* `groundCoords` (Array): `[lng, lat]` ground coordinates where the pointer went up.
* `dragStartScreenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer went down.
* `dragStartGroundCoords` (Array): `[lng, lat]` ground coordinates where the pointer went down.

### `onPointerMove`

The pointer moved, regardless of whether the pointer is down, up, and whether or not something was picked

* `screenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer is now.
* `groundCoords` (Array): `[lng, lat]` ground coordinates where the pointer is now.
* `isDragging` (Boolean): `true` if the pointer is moving but it is considered a drag, in this case you likely want to handle `onDragging`
* `pointerDownPicks` (Array): An array containing [deck.gl Picking Info Objects](https://uber.github.io/deck.gl/#/documentation/developer-guide/adding-interactivity?section=what-can-be-picked-) for all objects that were under the pointer when it went down, or `null` if pointer is moving without pointer down.

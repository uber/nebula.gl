# nebula.gl Editing Modes

`EditMode`s provide a way of handling user interactions in order to manipulate GeoJSON features and geometries.

The following are the built-in `EditMode`s provided by nebula.gl:

## [ViewMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/view-mode.js)

No edits are possible, but selection is still possible.

## [ModifyMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/modify-mode.js)

User can move existing points, add intermediate points along lines, and remove points.

### Edit Context

`editContext` argument to the `onEdit` callback contains the following properties:

* `positionIndexes` (Array): An array of numbers representing the indexes of the edited position within the feature's `coordinates` array

* `position` (Array): An array containing the ground coordinates (i.e. [lng, lat]) of the edited position

## [ExtrudeMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/extrude-mode.js)

User can move edge. Click and drag from anywhere between 2 points in edge.

## [ScaleMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/scale-mode.js)

User can scale a feature about its centroid by clicking and dragging (inward or outward) the selected geometry. This mode supports multiple selections.

## [RotateMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/rotate-mode.js)

User can rotate a feature about its centroid by clicking and dragging the selected geometry. This mode supports multiple selections.

## [TranslateMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/translate-mode.js)

The user can move a feature by selecting one or more features and dragging anywhere within the screen.
_Additionally, the user can initiate snapping by clicking and dragging the selected feature's vertex handles. If the vertex handle is close enough to another feature's vertex, the two features will snap together._

## [DuplicateMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/duplicate-mode.js)

User can duplicate and translate a feature by clicking selected feature and dragging anywhere on the screen.
This mode is extends TranslateMode. This mode supports multiple selections.

## [DrawPointMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-point-mode.js)

User can draw a new `Point` feature by clicking where the point is to be.

## [DrawLineStringMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-line-string-mode.js)

User can draw a new `LineString` feature by clicking positions to add.

* If a `LineString` feature is selected, clicking will add a position to it.

* If no feature is selected, a new `LineString` feature will be added. *Note*: you must select the new feature (via the `onEdit` callback) in order to start extending it.

* If multiple features are selected, or a non-`LineString` is selected, the user will be prevented from drawing.

### ModeConfig

The following options can be provided in the `modeConfig` object:

* `drawAtFront` (optional):  `<boolean>`
  * If `true`, will render the tentative feature at the "beginning" of the line, i.e. relative to the start of the coordinates array.

### Edit Context

`editContext` argument to the `onEdit` callback contains the following properties:

* `positionIndexes` (Array): An array of numbers representing the indexes of the added position within the feature's `coordinates` array

* `position` (Array): An array containing the ground coordinates (i.e. [lng, lat]) of the added position

## [DrawPolygonMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-polygon-mode.js)

User can draw a new `Polygon` feature by clicking positions to add then closing the polygon (or double-clicking).

### Edit Context

`editContext` argument to the `onEdit` callback contains the following properties:

* `positionIndexes` (Array): An array of numbers representing the indexes of the added position within the feature's `coordinates` array

* `position` (Array): An array containing the ground coordinates (i.e. [lng, lat]) of the added position

## [Draw90DegreePolygonMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-90degree-polygon-mode.js)

User can draw a new `Polygon` feature with 90 degree corners (right angle) by clicking positions to add then closing the polygon (or double-clicking). After clicking the 2 points, the draw mode guides/allows to have right angle polygon.

## [DrawRectangleMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-rectangle-mode.js)

User can draw a new rectangular `Polygon` feature by clicking two opposing corners of the rectangle.

## [DrawRectangleUsingThreePointsMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-rectangle-using-three-points-mode.js)

User can draw a new rectangular `Polygon` feature by clicking three corners of the rectangle.

## [DrawCircleFromCenterMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-circle-from-center-mode.js)

User can draw a new circular `Polygon` feature by clicking the center then along the ring.

### ModeConfig

The following options can be provided in the `modeConfig` object:

* `steps` (optional):  `x <number>`
  * If steps: `x` means the circle will be drawn using `x` number of points.

## [DrawCircleByBoundingBoxMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-circle-by-bounding-box-mode.js)

User can draw a new circular `Polygon` feature by clicking the two corners of bounding box.

### ModeConfig

The following options can be provided in the `modeConfig` object:

* `steps` (optional):  `x <number>`
  * If steps: `x` means the circle will be drawn using `x` number of points.

## [DrawEllipseByBoundingBoxMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-ellipse-by-bounding-box-mode.js)

User can draw a new ellipse shape `Polygon` feature by clicking two corners of bounding box.

## [DrawEllipseUsingThreePointsMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-ellipse-using-three-points-mode.js)

User can draw a new ellipse shape `Polygon` feature by clicking center and two corners of the ellipse.

## [SplitPolygonMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/split-polygon-mode.js)

User can split a polygon by drawing a new `LineString` feature on top of the polygon.

* If the first and the last click is outside the polygon, it will split the polygon

* If the clicked position is inside the polygon, it will not split the polygon

## [ElevationMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/elevation-mode.js)

User can move a point up and down.

### ModeConfig

The following options can be provided in the `modeConfig` object:

* `minElevation` (Number, optional)
  * The minimum elevation to allow
  * Default: `0`

* `maxElevation` (Number, optional)
  * The maximum elevation to allow
  * Default: `20000`

* `calculateElevationChange` (Function, optional)
  * A function to use to calculate the elevation change in response to mouse movement
  * Default: `10 * <vertical movement in pixels>`
  * Configure to use movement based on viewport:

```javascript
if (mode === 'elevation') {
  modeConfig.calculateElevationChange = (opts) =>
    ElevationMode.calculateElevationChangeWithViewport(viewport, opts);
}
```

## Boolean Operations

For all polygon drawing modes, the following options can be provided in the `modeConfig` object:

* `booleanOperation` (optional):  `null|'union'|'difference'|'intersection'`
  * If non-null, requires a single `Polygon` or `MultiPolygon` selection
  * If `null`, the drawn `Polygon` is added as a new feature regardless of selection
  * If `union`, the drawn `Polygon` is unioned with the selected geometry
  * If `difference`, the drawn `Polygon` is subtracted from the selected geometry
  * If `intersection`, the drawn `Polygon` is intersected with the selected geometry

## Composite Mode

Use `CompositeMode` to combine multiple modes.
_Not all combinations are guaranteed to work._

### Constructor

`new CompositeMode(modes, options = {})`

* `modes`: `Array<EditMode>` Modes you want to combine. **Order is very important.**
* `options` (optional): Options to be added later.

### Example

```
new CompositeMode([new DrawLineStringMode(), new ModifyMode()])
```

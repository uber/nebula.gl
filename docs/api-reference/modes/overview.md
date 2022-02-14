# Editing Modes

`EditMode`s provide a way of handling user interactions in order to manipulate GeoJSON features and geometries.

The following are the built-in `EditMode`s provided by nebula.gl:

## [ViewMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/view-mode.ts)

No edits are possible, but selection is still possible.

## [ModifyMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/modify-mode.ts)

User can move existing points, add intermediate points along lines, and remove points.

The following options can be provided in the `modeConfig` object for ModifyMode:

- `lockRectangles` (optional): `<boolean>`
  - If `true`, features with `properties.shape === 'Rectangle'` will preserve rectangular shape.

### Edit Context

`editContext` argument to the `onEdit` callback contains the following properties:

- `positionIndexes` (Array): An array of numbers representing the indexes of the edited position within the feature's `coordinates` array

- `position` (Array): An array containing the ground coordinates (i.e. [lng, lat]) of the edited position

## [ExtrudeMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/extrude-mode.ts)

User can move edge. Click and drag from anywhere between 2 points in edge.

## [ScaleMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/scale-mode.ts)

User can scale a feature about its centroid by clicking and dragging (inward or outward) the selected geometry. This mode supports multiple selections.

## [RotateMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/rotate-mode.ts)

User can rotate a feature about its centroid by clicking and dragging the selected geometry. This mode supports multiple selections.

## [TranslateMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/translate-mode.ts)

The user can move a feature by selecting one or more features and dragging anywhere within the screen.
_Additionally, the user can initiate snapping by clicking and dragging the selected feature's vertex handles. If the vertex handle is close enough to another feature's vertex, the two features will snap together._
The following options can be provided in the `modeConfig` object for TranslateMode:

- `screenSpace` (optional): `<boolean>`
  - If `true`, the features will be translated without distortion in screen space.

## [TransformMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/transform-mode.ts)

A single mode that provides translating, rotating, and scaling capabilities. Translation can be performed by clicking and dragging the selected feature itself. Rotating can be performed by clicking and dragging the top-most edit handle around a centroid pivot. Scaling can be performed by clicking and dragging one of the corner edit handles. Just like the individual modes, this mode supports multiple selections and feature snapping.

## [DuplicateMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/duplicate-mode.ts)

User can duplicate and translate a feature by clicking selected feature and dragging anywhere on the screen.
This mode is extends TranslateMode. This mode supports multiple selections.

## [DrawPointMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-point-mode.ts)

User can draw a new `Point` feature by clicking where the point is to be.

## [DrawLineStringMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-line-string-mode.ts)

User can draw a new `LineString` feature by clicking positions to add. User finishes drawing by double-clicking.

## [ExtendLineStringMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/extend-line-string-mode.ts)

User can extend an existing `LineString` feature by clicking positions to add. A single `LineString` feature must be selected for this mode.

### ModeConfig

The following options can be provided in the `modeConfig` object:

- `drawAtFront` (optional): `<boolean>`
  - If `true`, will extend from the "beginning" of the line, i.e. relative to the start of the coordinates array.

### Edit Context

`editContext` argument to the `onEdit` callback contains the following properties:

- `positionIndexes` (Array): An array of numbers representing the indexes of the added position within the feature's `coordinates` array

- `position` (Array): An array containing the ground coordinates (i.e. [lng, lat]) of the added position

## [ResizeCircleMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/resize-circle-mode.js)

User can resize an existing circular Polygon feature by clicking and dragging along the ring.

## [DrawPolygonMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-polygon-mode.js)

User can draw a new `Polygon` feature by clicking positions to add then closing the polygon (or double-clicking).

### ModeConfig

The following options can be provided in the `modeConfig` object:

- `preventOverlappingLines` (optional): `boolean`
  - If `true`, it will not be possible to add a polygon point if the current line overlaps any other lines on the same polygon.

### Edit Context

`editContext` argument to the `onEdit` callback contains the following properties:

- `positionIndexes` (Array): An array of numbers representing the indexes of the added position within the feature's `coordinates` array

- `position` (Array): An array containing the ground coordinates (i.e. [lng, lat]) of the added position

## [Draw90DegreePolygonMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-90degree-polygon-mode.ts)

User can draw a new `Polygon` feature with 90 degree corners (right angle) by clicking positions to add then closing the polygon (or double-clicking). After clicking the 2 points, the draw mode guides/allows to have right angle polygon.

## [DrawPolygonByDraggingMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-polygon-by-dragging-mode.ts)

User can draw a new `Polygon` feature by dragging (similar to the lasso tool commonly found in photo editing software).

### ModeConfig

The following options can be provided in the `modeConfig` object:

- `throttleMs` (optional): `number`
  - If provided, the dragging function will be throttled by the specified number of milliseconds.

## [DrawRectangleMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-rectangle-mode.ts)

User can draw a new rectangular `Polygon` feature by clicking two opposing corners of the rectangle.

### ModeConfig

The following options can be provided in the `modeConfig` object:

- `dragToDraw` (optional): `boolean`
  - If `true`, user can click and drag instead of clicking twice. Note however, that the user will not be able to pan the map while drawing.

## [DrawRectangleFromCenterMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-rectangle-from-center-mode.ts)

User can draw a new rectangular `Polygon` feature by clicking the center then along a corner of the rectangle.

### ModeConfig

The following options can be provided in the `modeConfig` object:

- `dragToDraw` (optional): `boolean`
  - If `true`, user can click and drag instead of clicking twice. Note however, that the user will not be able to pan the map while drawing.

## [DrawRectangleUsingThreePointsMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-rectangle-using-three-points-mode.ts)

User can draw a new rectangular `Polygon` feature by clicking three corners of the rectangle.

## [DrawSquareMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-square-mode.ts)

User can draw a new square-shaped `Polygon` feature by clicking two opposing corners of the square.

## [DrawSquareFromCenterMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-square-from-center-mode.ts)

User can draw a new square-shaped `Polygon` feature by clicking the center and then along one of the corners of the square.

### ModeConfig

The following options can be provided in the `modeConfig` object:

- `dragToDraw` (optional): `boolean`
  - If `true`, user can click and drag instead of clicking twice. Note however, that the user will not be able to pan the map while drawing.

## [DrawCircleFromCenterMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-circle-from-center-mode.ts)

User can draw a new circular `Polygon` feature by clicking the center then along the ring.

### ModeConfig

The following options can be provided in the `modeConfig` object:

- `steps` (optional): `x <number>`
  - If steps: `x` means the circle will be drawn using `x` number of points.
- `dragToDraw` (optional): `boolean`
  - If `true`, user can click and drag instead of clicking twice. Note however, that the user will not be able to pan the map while drawing.

## [DrawCircleByDiameterMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-circle-by-diameter-mode.ts)

User can draw a new circular `Polygon` feature by clicking the two ends of its diameter.

### ModeConfig

The following options can be provided in the `modeConfig` object:

- `steps` (optional): `x <number>`
  - If steps: `x` means the circle will be drawn using `x` number of points.
- `dragToDraw` (optional): `boolean`
  - If `true`, user can click and drag instead of clicking twice. Note however, that the user will not be able to pan the map while drawing.

## [DrawEllipseByBoundingBoxMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-ellipse-by-bounding-box-mode.ts)

User can draw a new ellipse shape `Polygon` feature by clicking two corners of bounding box.

### ModeConfig

The following options can be provided in the `modeConfig` object:

- `dragToDraw` (optional): `boolean`
  - If `true`, user can click and drag instead of clicking twice. Note however, that the user will not be able to pan the map while drawing.

## [DrawEllipseUsingThreePointsMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/draw-ellipse-using-three-points-mode.ts)

User can draw a new ellipse shape `Polygon` feature by clicking center and two corners of the ellipse.

## [SplitPolygonMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/split-polygon-mode.ts)

User can split a polygon by drawing a new `LineString` feature on top of the polygon.

- If the first and the last click is outside the polygon, it will split the polygon

- If the clicked position is inside the polygon, it will not split the polygon

## [MeasureDistanceMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/measure-distance-mode.ts)

User can measure a distance between two points.

### ModeConfig

The following options can be provided in the `modeConfig` object:

- `turfOptions` (Object, optional)

  - `options` object passed to turf's [distance](https://turfjs.org/docs/#distance) function
  - Default: `undefined`

- `formatTooltip` (Function, optional)

  - Function to format tooltip text (argument is the numeric distance)
  - Default: `(distance) => parseFloat(distance).toFixed(2) + units`

- `measurementCallback` (Function, optional)

  - Function to call as measurements are calculated
  - Default: `undefined`

- `centerTooltipsOnLine` (Boolean, optional)

  - If true, the measurement tooltips appear on the middle of their respective line segments rather than at the end
  - Default: `false`

## [MeasureAreaMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/measure-area-mode.ts)

User can measure an area by drawing an arbitrary polygon.

### ModeConfig

The following options can be provided in the `modeConfig` object:

- `formatTooltip` (Function, optional)

  - Function to format tooltip text (argument is the numeric area)
  - Default: `(distance) => parseFloat(distance).toFixed(2) + units`

- `measurementCallback` (Function, optional)
  - Function to call as measurements are calculated
  - Default: `undefined`

## [MeasureAngleMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/measure-angle-mode.ts)

User can measure an angle by drawing two lines.

### ModeConfig

The following options can be provided in the `modeConfig` object:

- `formatTooltip` (Function, optional)

  - Function to format tooltip text (argument is the numeric area)
  - Default: `(distance) => parseFloat(angle).toFixed(2) + units`

- `measurementCallback` (Function, optional)
  - Function to call as measurements are calculated
  - Default: `undefined`

## [ElevationMode](https://github.com/uber/nebula.gl/blob/master/modules/edit-modes/src/lib/elevation-mode.ts)

User can move a point up and down.

### ModeConfig

The following options can be provided in the `modeConfig` object:

- `minElevation` (Number, optional)

  - The minimum elevation to allow
  - Default: `0`

- `maxElevation` (Number, optional)

  - The maximum elevation to allow
  - Default: `20000`

- `calculateElevationChange` (Function, optional)
  - A function to use to calculate the elevation change in response to mouse movement
  - Default: `10 * <vertical movement in pixels>`
  - Configure to use movement based on viewport:

```javascript
if (mode === 'elevation') {
  modeConfig.calculateElevationChange = (opts) =>
    ElevationMode.calculateElevationChangeWithViewport(viewport, opts);
}
```

## Boolean Operations

For all polygon drawing modes, the following options can be provided in the `modeConfig` object:

- `booleanOperation` (optional): `null|'union'|'difference'|'intersection'`
  - If non-null, requires a single `Polygon` or `MultiPolygon` selection
  - If `null`, the drawn `Polygon` is added as a new feature regardless of selection
  - If `union`, the drawn `Polygon` is unioned with the selected geometry
  - If `difference`, the drawn `Polygon` is subtracted from the selected geometry
  - If `intersection`, the drawn `Polygon` is intersected with the selected geometry

## Composite Mode

Use `CompositeMode` to combine multiple modes.
_Not all combinations are guaranteed to work._

### Constructor

`new CompositeMode(modes, options = {})`

- `modes`: `Array<EditMode>` Modes you want to combine. **Order is very important.**
- `options` (optional): Options to be added later.

### Example

```
new CompositeMode([new DrawLineStringMode(), new ModifyMode()])
```

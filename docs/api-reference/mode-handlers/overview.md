# Mode Handlers

`ModeHandler`s provide a way of handling user interactions in order to manipulate GeoJSON features and geometries.

The following are the built-in, and default `ModeHandler`s provided by nebula.gl:

## [ViewHandler](https://github.com/uber/nebula.gl/blob/clay/mode-handlers/modules/core/src/lib/mode-handlers/view-handler.js)

* Mode name: `view`

No edits are possible, but selection is still possible.

## [ModifyHandler](https://github.com/uber/nebula.gl/blob/clay/mode-handlers/modules/core/src/lib/mode-handlers/modify-handler.js)

* Mode name: `modify`

User can move existing points, add intermediate points along lines, and remove points.

### ModeConfig

A `modeConfig` object can be provided:

* If action: `transformRotate` means the feature will be transform rotated by default the pivot as centroid.

* If pivot: [120, 5] means the point is used as pivot for rotate. if the value is null or undefined then pivot is centroid.

* If usePickAsPivot: true, means the pivot will be nearest point of feature for mouse pointer position. pivot value is ignored.

## [DrawPointHandler](https://github.com/uber/nebula.gl/blob/clay/mode-handlers/modules/core/src/lib/mode-handlers/draw-point-handler.js)

* Mode name: `drawPoint`

User can draw a new `Point` feature by clicking where the point is to be.

## [DrawLineStringHandler](https://github.com/uber/nebula.gl/blob/clay/mode-handlers/modules/core/src/lib/mode-handlers/draw-line-string-handler.js)

* Mode name: `drawLineString`

User can draw a new `LineString` feature by clicking positions to add.

* If a `LineString` feature is selected, clicking will add a position to it.

* If no feature is selected, a new `LineString` feature will be added. *Note*: you must select the new feature (via the `onEdit` callback) in order to start extending it.

* If multiple features are selected, or a non-`LineString` is selected, the user will be prevented from drawing.

## [DrawPolygonHandler](https://github.com/uber/nebula.gl/blob/clay/mode-handlers/modules/core/src/lib/mode-handlers/draw-polygon-handler.js)

* Mode name: `drawPolygon`

User can draw a new `Polygon` feature by clicking positions to add then closing the polygon (or double-clicking).

## [DrawRectangleHandler](https://github.com/uber/nebula.gl/blob/clay/mode-handlers/modules/core/src/lib/mode-handlers/draw-rectangle-handler.js)

* Mode name: `drawRectangle`

User can draw a new rectanglular `Polygon` feature by clicking two opposing corners of the rectangle.

## [DrawRectangleUsingThreePointsHandler](https://github.com/uber/nebula.gl/blob/clay/mode-handlers/modules/core/src/lib/mode-handlers/draw-rectangle-using-three-points-handler.js)

* Mode name: `drawRectangleUsing3Points`

User can draw a new rectanglular `Polygon` feature by clicking three corners of the rectangle.

## [DrawCircleFromCenterHandler](https://github.com/uber/nebula.gl/blob/clay/mode-handlers/modules/core/src/lib/mode-handlers/draw-circle-from-center-handler.js)

* Mode name: `drawCircleFromCenter`

User can draw a new circular `Polygon` feature by clicking the center then along the ring.

## [DrawCircleByBoundingBoxHandler](https://github.com/uber/nebula.gl/blob/clay/mode-handlers/modules/core/src/lib/mode-handlers/draw-circle-by-bounding-box-handler.js)

* Mode name: `drawCircleByBoundingBox`

User can draw a new circular `Polygon` feature by clicking the two corners of bounding box.

## [DrawEllipseByBoundingBoxHandler](https://github.com/uber/nebula.gl/blob/clay/mode-handlers/modules/core/src/lib/mode-handlers/draw-ellipse-by-bounding-box-handler.js)

* Mode name: `drawEllipseByBoundingBox`

User can draw a new ellipse shape `Polygon` feature by clicking two corners of bounding box.

## [DrawEllipseUsingThreePointsHandler](https://github.com/uber/nebula.gl/blob/clay/mode-handlers/modules/core/src/lib/mode-handlers/draw-ellipse-using-three-points-handler.js)

* Mode name: `drawEllipseUsing3Points`

User can draw a new ellipse shape `Polygon` feature by clicking center and two corners of the ellipse.

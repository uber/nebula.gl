
# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- ## [Unreleased](https://github.com/uber/nebula.gl/compare/v0.7.4...master) -->

## [0.7.4](https://github.com/uber/nebula.gl/compare/v0.7.3...v0.7.4) - 2018-12-10

* Ability to draw polygon with only right angles

## [0.7.3](https://github.com/uber/nebula.gl/compare/v0.7.2...v0.7.3) - 2018-11-26

* Handle null modeConfig
* Implement Split Polygon
* Ability to drag(extrude) an edge

## [0.7.2](https://github.com/uber/nebula.gl/compare/v0.7.1...v0.7.2) - 2018-11-12

* Implement selection-layer
* Detach event listeners on component unmount
* Disable hacky loop sync behind feature flag property

## [0.7.1](https://github.com/uber/nebula.gl/compare/v0.7.0...v0.7.1) - 2018-10-24
* Fix Nebula crashes on attempt to edit polygon layer over segment layer

## [0.7.0](https://github.com/uber/nebula.gl/compare/v0.6.1...v0.7.0) - 2018-10-23

### Added

* Ability to duplicate a feature ([#109](https://github.com/uber/nebula.gl/pull/109))
* Option to configure number of points for circle ([#103](https://github.com/uber/nebula.gl/pull/103))

### Changed

* `EditableGeoJsonLayer`'s `drawAtFront` prop should now be supplied via `modeConfig` prop ([#115](https://github.com/uber/nebula.gl/pull/115))

### Fixed

* Specify 6.0.5 as the minimum version for [deck.gl](https://github.com/uber/deck.gl)
* Fix turf v5 compatibility with boolean operations ([#111](https://github.com/uber/nebula.gl/pull/111))

## [0.6.1](https://github.com/uber/nebula.gl/compare/v0.5.1...v0.6.1) - 2018-10-10

### Added

* Ability to customize existing modes or add new modes using `ModeHandler`s
* `rotate` mode
* `translate` mode
* `scale` mode
* Boolean operations (union, difference, intersection) for polygon draw modes

### Changed

* Renamed `dragStartScreenCoords` to `pointerDownScreenCoords` and `dragStartGroundCoords` to `pointerDownGroundCoords` in `onStartDragging()`, `onStopDragging()`, and `onPointerMove()` events
* `isDragging` is now true whether or not something was picked in `onPointerMove()` event
* Edit handles will now only appear in `modify` and `drawPolygon` modes
* Can add new intermediate points anywhere along a line rather than just from the midpoint

## [0.5.1](https://github.com/uber/nebula.gl/compare/v0.4.3...v0.5.1) - 2018-09-24

### Removed

* `updatedMode` and `updatedSelectedFeatureIndexes` are no longer passed to the `onEdit` callback. It is now up to the consuming application to determine when/if mode or selection should be changed. See `examples/deck` for a demonstration.

### Changed

* Geometry type will no longer be "upgraded" or "downgraded" by nebula. `onEdit` will only be called once the desired geometry type is achieved (e.g. when completing the polygon).
* Renamed `getDrawLineColor` to `getTentativeLineColor`
* Renamed `getDrawFillColor` to `getTentativeFillColor`
* Renamed `getDrawLineWidth` to `getTentativeLineWidth`
* Renamed `getDrawLineDashArray` to `getTentativeLineDashArray`

### Fixes

* Double-click to complete polygon adds a point where the double-click happened

## [0.1.1 through 0.4.3](https://github.com/uber/nebula.gl/compare/v0.1.0...v0.4.3)

* See [commit history](https://github.com/uber/nebula.gl/compare/v0.1.0...v0.4.3) for changelog

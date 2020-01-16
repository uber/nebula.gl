# Changelog

_All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)._

<!-- INSERT HERE -->

<!-- NEXT VERSION
* Call `event.cancelPan()` instead of `event.sourceEvent.stopPropagation()` in custom edit modes
* `PointerMoveEvent` no longer has an `isDragging` flag. Instead, use the new `handleDragging` event.
-->

## [0.17.0](https://github.com/uber/nebula.gl/compare/v0.16.0...v0.17.0) - 2020-01-10

### Changes

* Fix deck 8 (#317)
* Rename DrawCircleByBoundingBoxMode to DrawCircleByDiameterMode (#314)
* upgrade deckgl to 8.0 using upgrade script
* update ocular-gatsby
* Measure distance mode + tooltips (#299)
* Use deck.gl mesh layer, update example to use it (#296)
* Fix register events and respect selectedFeatureIndex passed from… (#287)
* Update readme example

### Breaking changes

* DrawCircleByBoundingBoxMode renamed to DrawCircleByDiameterMode (#314)
* The following props of `EditableGeoJsonLayer` are no longer proxied by nebula.gl (instead use deck.gl's [_subLayerProps](https://deck.gl/#/documentation/deckgl-api-reference/layers/composite-layer?section=_sublayerprops-object-experimental)):
  * `getLineDashArray`
  * `lineDashJustified`
  * `getTentativeLineDashArray`

## [0.16.0](https://github.com/uber/nebula.gl/compare/v0.15.0...v0.16.0) - 2019-09-25

### Changes

* You can now style edit handles with an outline (which is now also the default) by supplying `getEditHandlePointOutlineColor`
* Swap EditableGeoJsonLayer to use edit-modes module (#283)
* Unwrap guide object when using `_subLayerProps` (#284)
* Remove deprecated usage. #281 (#282)

### Breaking changes for `EditableGeoJsonLayer`

* `featureIndexes` is now nested under `editContext.featureIndexes` in parameter passed to `onEdit` callback
* Edit handle type is now under `properties.editHandleType` instead of `type` for edit handle styling accessors:
  * `getEditHandlePointColor`
  * `getEditHandlePointRadius`
  * `getEditHandleIcon`
  * `getEditHandleIconSize`
  * `getEditHandleIconColor`
  * `getEditHandleIconAngle`
* _Deprecated:_ The `mode` prop is intended to take a constructor or instance rather than a string.
  * `import {DrawPolygonMode} from 'nebula.gl'; new EditableGeoJsonLayer({mode: DrawPolygonMode})`
* `editHandleType` no longer supports passing a function/constructor. Use `_subLayerProps` instead.
* `editHandleParameters` removed. Use `_subLayerProps` instead.
* `editHandleLayerProps` removed. Use `_subLayerProps` instead.

### Breaking changes between `ModeHandler` and `GeoJsonEditMode`

If you built a custom `ModeHandler`, note the following breaking changes:

* Extend `GeoJsonEditMode` instead of `ModeHandler`
* Each function now takes a `props` parameter with the state, so use `props` rather than `this.get...()` (e.g. `this.getFeatureCollection()`, `this.getModeConfig()`, etc).
* `handleClick`
  * Call `props.onEdit` instead of returning an `EditAction`
* `handlePointerMove`
  * Call `props.onEdit` instead of returning an `EditAction`
  * Call `event.sourceEvent.stopPropagation()` instead of returning `{cancelMapPan: true}`
* `handleStartDragging`
  * Call `props.onEdit` instead of returning an `EditAction`
* `handleStopDragging`
  * Call `props.onEdit` instead of returning an `EditAction`
* Guides
  * Edit handles and tentative features are now encompassed as "guides"
  * Guides are formatted as GeoJSON FeatureCollection
  * Override `getGuides` instead of `getEditHandles`
  * Format edit handles as GeoJSON Features instead of custom objects
  * Override `getGuides` instead of calling `this._setTentativeFeature()`
* `getCursor`
  * Instead of defining a `getCursor` function, call `props.onUpdateCursor`
* `groundCoords` renamed to `mapCoords` in event objects

## [0.15.0](https://github.com/uber/nebula.gl/compare/v0.14.7...v0.15.0) - 2019-09-16

### Changes

* Improve react-map-gl-draw API (#270)
* Port ModeHandlers over to edit-modes module (#222)
* Upgrade jest and istanbul (#267)
* Fix react-map-gl-draw selectedFeature and event register (#265)
* bump viewport-mercator-project (#264)
* refactor react-map-gl-draw part 1 - break down mode handlers (#253)
* Export ViewHandler (#261)
* Simplify EditMode interface to be more stateless (#258)
* Fix clickRadius and insert a point to line segment (#260)
* Bump js-yaml from 3.12.0 to 3.13.1 in /examples/sf (#259)
* Modified the Travis configuration file to enable automated FOSSA scans. (#219)
* Simplify onPan propagation check (#256)

## [0.14.7](https://github.com/uber/nebula.gl/compare/v0.14.4...v0.14.7) - 2019-07-12

### Changes

* React-map-gl-draw: propagating onSelect mouse event (#254)
* Make dragging features more resilient to lagging feature element (#251)
* add clipboard support and featureMenu to advanced example (#250)
* Only permit drags on the currently selected feature (#246)

## [0.14.4](https://github.com/uber/nebula.gl/compare/v0.14.0...v0.14.4) - 2019-07-02

### Changes

* Exposing ReactMapGl Draw constants: RENDER_TYPE and RENDER_STATE (#248)
* support customized react-map-gl-draw-editor style (#247)
* Support polygon closing styling (#241)
* Support pan gestures when not interacting with a feature (#242)
* Update advanced example style to dark mode (#239)
* RFC: react-map-gl-draw (#229)

## [0.14.0](https://github.com/uber/nebula.gl/compare/v0.13.0...v0.14.0) - 2019-06-18

### Changes

* Implement elevation-aware nearestPointOnLine (#236)
* add billboard prop to editable-geojson-layer (#234)
* upgrade deck to 7.1 (#235)
* Refactor react-map-gl-draw (#230)
* Enable flow for react-map-gl-draw (#227)

## [0.13.0](https://github.com/uber/nebula.gl/compare/v0.12.1...v0.13.0) - 2019-05-13

### Breaking changes

* For `translate` mode:
  * Specify `modeConfig.additionalSnapTargets`, which is a list of Features, instead of `modeConfig.layerIdsToSnapTo`.
  * Specify `EditableGeoJsonLayer.pickingRadius` rather than `modeConfig.snapPixels`.

### Added

* For snapping functionality, can now specify `modeConfig.additionalSnapTargets` to support snapping to an array GeoJSON features whether or not they are rendered
* Can override `pickingRadius` and `pickingDepth`

### Changes

* Create `@nebula.gl/edit-modes` module (#225)
* Decouple snapping functionality from deck.gl (#224)
* Remove dependency on deck.gl from ElevationHandler (#223)
* Ability to toggle GeoJSON text in example (#220)

## [0.12.1](https://github.com/uber/nebula.gl/compare/v0.12.0...v0.12.1) - 2019-05-07

### Changes

* Use functions to get to private properties (#218)
* rename react-editor-lite to react-map-gl-draw (#215)
* Fixed SelectionLayer: pickObjects to be called from deck (#214)
* Fixed snapping: Changed _context.layerManager.pickObject (#213)
* Port react-map-gl draw control to @nebula.gl/react-editor-lite (#204)
* Pass through lineWidthUnits to GeoJSONLayer (#203)

## [0.12.0](https://github.com/uber/nebula.gl/compare/v0.11.2...v0.12.0) - 2019-04-22

### Changes

* v0.12.0
* Upgrade to deck 7.0 (#183)
* fix: remove extraneous console.log (#201)

## [0.11.2](https://github.com/uber/nebula.gl/compare/v0.11.1...v0.11.2) - 2019-04-11

### Changes

* fix version bug
* Add support to SnappableHandler to pick from other layers (#199)

## [0.11.1](https://github.com/uber/nebula.gl/compare/v0.11.0...v0.11.1) - 2019-04-06

### Changes

* Create ElevatedEditHandleLayer for better elevation editing (#195)
* Add snapping to translate mode (#177)
* Update immutable-feature-collection.js to copy elevation values when replacing coordinates (#194)
* add textarea to examples/deck
* Initial gatsby website structure (#186)
* Fix HtmlOverlay to handle possible null children (#192)

## [0.11.0](https://github.com/uber/nebula.gl/compare/v0.10.5...v0.11.0) - 2019-03-21

### Changes

* Setup coveralls (#191)
* Create @nebula.gl/layers (#189)
* Increase complexity of sample data (#190)
* Remove @nebula.gl/react (#188)
* Add zIndex property to html-overlay.js (#187)

## [0.10.5](https://github.com/uber/nebula.gl/compare/v0.10.4...v0.10.5) - 2019-03-19

### Changes

* Composite Mode Handler for creating and modifying at the same time (#184)
* Create @nebula.gl/overlays (#182)

## [0.10.4](https://github.com/uber/nebula.gl/compare/v0.10.3...v0.10.4) - 2019-03-15

### Changes

* add gitattributes
* Add elevation-handler mode (experimental) (#178)
* remove EditableJunctionsLayer (#180)
* Move path-marker-layer and path-outline-layer from deck.gl, remove experimental-layers dep (#176)
* Tweak changelog script

## [0.10.3](https://github.com/uber/nebula.gl/compare/v0.10.2...v0.10.3) - 2019-03-01

### Changes

* Fix publishing of readme to npm (#174)
* Add Design Goals (#173)

## [0.10.2](https://github.com/uber/nebula.gl/compare/v0.10.1...v0.10.2) - 2019-02-27

### Changes

* v0.10.2
* Add support for simultaneously editing multiple polygons in translate, rotate, scale, duplicate modes (#160)

## [0.10.1](https://github.com/uber/nebula.gl/compare/v0.10.0...v0.10.1) - 2019-02-14

### Changes

* fix getClusterObjects (#167)
* add scripts/changelog.sh

## [0.10.0](https://github.com/uber/nebula.gl/compare/v0.9.1...v0.10.0)

### Changes

* `featureIndex` renamed to `featureIndexes` (now an array of numbers instead of single number) for the `onEdit` callback.
* `positionIndexes` and `position` now nested under a new `editContext` property for the `onEdit` callback

## [0.9.1](https://github.com/uber/nebula.gl/compare/v0.9.0...v0.9.1)

* move supercluster to react module, upgrade version

## [0.9.0](https://github.com/uber/nebula.gl/compare/v0.8.0...v0.9.0)

### Fixes

* Fix issue with clicking edit handle while drawing polygon (#156)
* Issue 157. Pass Nebula childrens to Deck. (#158)
* Issue 154, avoid crash when nebula getChildContext being called before didMount (#155)

## [0.8.0](https://github.com/uber/nebula.gl/compare/v0.7.6...v0.8.0)

### Changed

* Upgraded deck.gl to 6.3.2
* Renamed `EditableGeoJsonLayer.onClick` to `EditableGeoJsonLayer.onLayerClick`

## [0.7.5](https://github.com/uber/nebula.gl/compare/v0.7.4...v0.7.5) - 2018-12-12

* Ability to split polygon with only right angles

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

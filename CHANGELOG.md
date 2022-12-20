# Changelog

_All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)._

<!-- INSERT HERE -->

## [1.0.4](https://github.com/uber/nebula.gl/compare/v1.0.2...v1.0.4) - 2022-10-04

### Changes

* v1.0.4
* Fix #786: bug in EditableGeojsonLayer.getCursor (#802)
* Set default value to zIndex (#756)
* v1.0.3
* Fix issue where overlay items ignored z-index (#753)

## [v1.0.2-alpha.2](https://github.com/uber/nebula.gl/compare/v1.0.2-alpha.1...v1.0.2-alpha.2) - Feb 22, 2022

### Changes

- Add option to prevent overlapping lines when drawing a polygon (#549)
- Add draw square mode (#528)
- Support for tooltips for measure modes in react-map-gl-draw (#601)
- Update the basic usage documentation (#606)
- Add option to MeasureDistanceMode to center tooltips on line (#642)
- Fix incorrectly positioned arrows in path-marker-layer (#730)
- Fix example for path-marker-layer (#728)

## [v1.0.2-alpha.1](https://github.com/uber/nebula.gl/compare/v1.0.2-alpha.0...v1.0.2-alpha.1) - Feb 9, 2022

### Changes

- Fix EditingMode drag to move (react-map-gl-draw) (#600)
- Add Draw Rectangle From Center mode (#530)
- Expose addTentativePosition (react-map-gl-draw) (#610)
- Fix cursor issue when using the scale mode (#522)
- Remove broken calculateZLevels (#678)
- Fix link to modes in overview (#679)
- Translate mode: translate shapes in screen space (#692)
- EditableGeojsonLayer: pickingLineWidthExtraPixels prop (#694)
- feat(modify-mode): an option to lock shape or rectangles and prevent insertion of point (#691)

## [v1.0.2-alpha.0](https://github.com/uber/nebula.gl/compare/v1.0.1-alpha.0...v1.0.2-alpha.0) - Dec 8, 2021

### Changes

- bump deck types and prett fix (#676)

## [v1.0.1-alpha.0](https://github.com/uber/nebula.gl/compare/v1.0.0-alpha.0...v1.0.1-alpha.0) - Dec 5, 2021

### Changes

- Update deck typings for deck 8.6 (#670)
- Fix "Cannot read properties of undefined (reading 'clone')" (#671)

## [v1.0.0-alpha.0](https://github.com/uber/nebula.gl/compare/v0.23.6...v1.0.0-alpha.0) - Nov 17, 2021

### Changes

- Bump deck.gl from 8.4.6 to 8.6.0, luma.gl from 8.4.3 to 8.5.10 (#660)

## [0.23.6](https://github.com/uber/nebula.gl/compare/v0.23.3...v0.23.6) - 2021-09-08

### Changes

- Update outdated links (#631)
- fix: "this.state is null" error (#628)

## [0.23.3](https://github.com/uber/nebula.gl/compare/v0.22.3...v0.23.3) - 2021-07-14

### Changes

- Nearest point on line (#611)
- Update EditableGeoJSONLayer docs and update outdated links (#587)
- chore: Bump to deck/luma v8.4 (#529)
- Add 'Draw Square From Center' mode (#531)
- fix for optional properties (#546)

## [0.22.3](https://github.com/uber/nebula.gl/compare/v0.22.2...v0.22.3) - 2021-02-22

### Changes

- [path-marker-layer] Fix arrow direction (#533)

## [0.22.2](https://github.com/uber/nebula.gl/compare/v0.21.0...v0.22.2) - 2021-02-18

### Changes

- [path-marker-layer] Fix arrow direction for deck.gl version > 8.0 (#527)
- Hide the intermediate edit handle when resizing a circle (#524)
- Add resize circle mode (#521)
- Remove handles / vertices (#433)
- feat: Convert class properties to overridable methods. (#458)
- fix: add support for DrawPolygonByDragging mode (#516)
- feat(measure-distance-mode): Add multipoint support (#504)
- Add missing @turf/helpers depenedency to overlays module (#488)
- fix: issue with updateState when autoHighlight and pickable on (#486)
- Flesh out the Toolbox component (#484)

## [0.21.0](https://github.com/uber/nebula.gl/compare/v0.20.2...v0.21.0) - 2020-10-01

### Changes

- Create EditableH3ClusterLayer && Refactor Edit Modes to support updateTentativeFeature edit type (#483)
- Updates to import and export components (#481)

## [0.20.2](https://github.com/uber/nebula.gl/compare/v0.20.0...v0.20.2) - 2020-09-22

### Changes

- Remove polygon fill from bounding guide in rotate and scale edit modes and fix scale mode cursor (#480)

## [0.20.0](https://github.com/uber/nebula.gl/compare/v0.19.3...v0.20.0) - 2020-08-31

### Changes

- Add finish drawing after pressing Enter (#463)

## [0.19.3](https://github.com/uber/nebula.gl/compare/v0.19.2...v0.19.3) - 2020-08-20

### Changes

- fix select feature error when lastPointerMoveEvent is null (#445)
- Expose edit-modes utils (#444)
- Better handle null/undefined mode prop (#454)

## [0.19.2](https://github.com/uber/nebula.gl/compare/v0.19.1...v0.19.2) - 2020-07-28

### Changes

- Change the geometry of polygons and rectangles ring directions. Outer rings use CCW and inner rings follow CW. (#434)

## [0.19.1](https://github.com/uber/nebula.gl/compare/v0.19.0...v0.19.1) - 2020-07-09

### Changes

- Fix getScreenCoords for Edge Browser (#437)
- Correct the document for DeckGL import (#430)

## [0.19.0](https://github.com/uber/nebula.gl/compare/v0.18.4...v0.19.0) - 2020-06-24

### Changes

- Add the Escape as hotkey to cancel the tentative drawings. (#423)
- Fix mode usage in docs (#424)
- Bump websocket-extensions from 0.1.3 to 0.1.4 (#412)
- Remove double click handlers from nebula layers and edit-modes (#410)
- docs: fix selection-layer doc (#404)
- feat: better prettier support (#403)
- Add react-map-gl-sandbox (#400)
- fix website

## [0.18.4](https://github.com/uber/nebula.gl/compare/v0.18.3...v0.18.4) - 2020-05-10

### Changes

- v0.18.4
- react-map-gl-draw: fix customize styling (#399)
- chore: update react import style (#382)

## [0.18.3](https://github.com/uber/nebula.gl/compare/v0.18.2...v0.18.3) - 2020-05-07

### Changes

- v0.18.3
- react-map-gl-draw: fix onSelection exception (#395)
- react-map-gl-draw: allow user pan map in drawing mode (#398)

## [0.18.2](https://github.com/uber/nebula.gl/compare/v0.17.7...v0.18.2) - 2020-05-01

### Changes

- v0.18.2
- react-map-gl-draw: update docs and examples (#392)
- Fix mode links in documentation
- Update html-overlay-item.md (#381)
- Update README.md

- v0.18.1
- react-map-gl-draw: use nebula.gl/edit-modes (#376)
- edit-modes: support shape property for circles and rectangles (#375)

- v0.18.0
- Fix double-click to complete (#389)
- update changelog

## [0.17.7](https://github.com/uber/nebula.gl/compare/v0.17.3...v0.17.7) - 2020-04-14

### Changes

- v0.17.7
- edit-modes: fix dependencies and resolving dependencies in local… (#384)
- fix website example
- Fix examples/advanced
- Typescript migration (#377)
- DrawLineString improvements (#370)
- react-map-gl-draw: customized modes (#360)
- react-map-gl-draw: extend from @nebula.gl/edit-mode (#366)
- v0.17.6
- Add editor module with components for importing and exporting geometries (#357)
- v0.17.5
- Export GeoJsonEditMode (#363)
- v0.17.4
- Draw polygon by dragging mode (#362)
- Add closing code tick (#358)
- Remove TODO since #1918 landed (#353)
- Check yarn.lock in examples also (#351)
- Add transform edit mode (#340)
- Add new editor module and example app (#349)
- Configuration option to disable dragging features (#300)
- v0.17.3 CHANGELOG

## [0.17.3](https://github.com/uber/nebula.gl/compare/v0.17.2...v0.17.3) - 2020-03-10

### Changes

- Assign key prop to html-overlay children that don't already have one specified (#348)
- react-map-gl-draw: fix onUpdate to callback when anything is upd… (#339)
- react-map-gl-draw: fix onUpdate bubbling up when dragging finish… (#337)
- react-map-gl-draw: Closing polygon drawing on dblclick (#341)
- Ability to measure angles with MeasureAngleMode (#332)
- Change documentation to recommend using \_subLayerProps (#329)

## [0.17.2](https://github.com/uber/nebula.gl/compare/v0.17.1...v0.17.2) - 2020-02-06

### Changes

- v0.17.2
- react-map-gl-draw: fix lagging between viewport and editor updating (#331)
- MeasureAreaMode (#325)
- Implement ability to drag and draw in certain modes (#323)

## [0.17.1](https://github.com/uber/nebula.gl/compare/v0.17.0...v0.17.1) - 2020-01-16

### Changes

- Use mjolnir.js for event handling (#319)
- Bump handlebars from 4.1.2 to 4.7.2 (#321)
- Fix edit handle icons (#318)
- Cleanup EditMode adapters (#316)

### Breaking changes

- Call `event.cancelPan()` instead of `event.sourceEvent.stopPropagation()` in custom edit modes
- `PointerMoveEvent` no longer has an `isDragging` flag. Instead, use the new `handleDragging` event.

## [0.17.0](https://github.com/uber/nebula.gl/compare/v0.16.0...v0.17.0) - 2020-01-10

### Changes

- Fix deck 8 (#317)
- Rename DrawCircleByBoundingBoxMode to DrawCircleByDiameterMode (#314)
- upgrade deckgl to 8.0 using upgrade script
- update ocular-gatsby
- Measure distance mode + tooltips (#299)
- Use deck.gl mesh layer, update example to use it (#296)
- Fix register events and respect selectedFeatureIndex passed from… (#287)
- Update readme example

### Breaking changes

- DrawCircleByBoundingBoxMode renamed to DrawCircleByDiameterMode (#314)
- The following props of `EditableGeoJsonLayer` are no longer proxied by nebula.gl (instead use deck.gl's [\_subLayerProps](https://deck.gl/#/documentation/deckgl-api-reference/layers/composite-layer?section=_sublayerprops-object-experimental)):
  - `getLineDashArray`
  - `lineDashJustified`
  - `getTentativeLineDashArray`

## [0.16.0](https://github.com/uber/nebula.gl/compare/v0.15.0...v0.16.0) - 2019-09-25

### Changes

- You can now style edit handles with an outline (which is now also the default) by supplying `getEditHandlePointOutlineColor`
- Swap EditableGeoJsonLayer to use edit-modes module (#283)
- Unwrap guide object when using `_subLayerProps` (#284)
- Remove deprecated usage. #281 (#282)

### Breaking changes for `EditableGeoJsonLayer`

- `featureIndexes` is now nested under `editContext.featureIndexes` in parameter passed to `onEdit` callback
- Edit handle type is now under `properties.editHandleType` instead of `type` for edit handle styling accessors:
  - `getEditHandlePointColor`
  - `getEditHandlePointRadius`
  - `getEditHandleIcon`
  - `getEditHandleIconSize`
  - `getEditHandleIconColor`
  - `getEditHandleIconAngle`
- _Deprecated:_ The `mode` prop is intended to take a constructor or instance rather than a string.
  - `import {DrawPolygonMode} from 'nebula.gl'; new EditableGeoJsonLayer({mode: DrawPolygonMode})`
- `editHandleType` no longer supports passing a function/constructor. Use `_subLayerProps` instead.
- `editHandleParameters` removed. Use `_subLayerProps` instead.
- `editHandleLayerProps` removed. Use `_subLayerProps` instead.

### Breaking changes between `ModeHandler` and `GeoJsonEditMode`

If you built a custom `ModeHandler`, note the following breaking changes:

- Extend `GeoJsonEditMode` instead of `ModeHandler`
- Each function now takes a `props` parameter with the state, so use `props` rather than `this.get...()` (e.g. `this.getFeatureCollection()`, `this.getModeConfig()`, etc).
- `handleClick`
  - Call `props.onEdit` instead of returning an `EditAction`
- `handlePointerMove`
  - Call `props.onEdit` instead of returning an `EditAction`
  - Call `event.sourceEvent.stopPropagation()` instead of returning `{cancelMapPan: true}`
- `handleStartDragging`
  - Call `props.onEdit` instead of returning an `EditAction`
- `handleStopDragging`
  - Call `props.onEdit` instead of returning an `EditAction`
- Guides
  - Edit handles and tentative features are now encompassed as "guides"
  - Guides are formatted as GeoJSON FeatureCollection
  - Override `getGuides` instead of `getEditHandles`
  - Format edit handles as GeoJSON Features instead of custom objects
  - Override `getGuides` instead of calling `this._setTentativeFeature()`
- `getCursor`
  - Instead of defining a `getCursor` function, call `props.onUpdateCursor`
- `groundCoords` renamed to `mapCoords` in event objects

## [0.15.0](https://github.com/uber/nebula.gl/compare/v0.14.7...v0.15.0) - 2019-09-16

### Changes

- Improve react-map-gl-draw API (#270)
- Port ModeHandlers over to edit-modes module (#222)
- Upgrade jest and istanbul (#267)
- Fix react-map-gl-draw selectedFeature and event register (#265)
- bump viewport-mercator-project (#264)
- refactor react-map-gl-draw part 1 - break down mode handlers (#253)
- Export ViewHandler (#261)
- Simplify EditMode interface to be more stateless (#258)
- Fix clickRadius and insert a point to line segment (#260)
- Bump js-yaml from 3.12.0 to 3.13.1 in /examples/sf (#259)
- Modified the Travis configuration file to enable automated FOSSA scans. (#219)
- Simplify onPan propagation check (#256)

## [0.14.7](https://github.com/uber/nebula.gl/compare/v0.14.4...v0.14.7) - 2019-07-12

### Changes

- React-map-gl-draw: propagating onSelect mouse event (#254)
- Make dragging features more resilient to lagging feature element (#251)
- add clipboard support and featureMenu to advanced example (#250)
- Only permit drags on the currently selected feature (#246)

## [0.14.4](https://github.com/uber/nebula.gl/compare/v0.14.0...v0.14.4) - 2019-07-02

### Changes

- Exposing ReactMapGl Draw constants: RENDER_TYPE and RENDER_STATE (#248)
- support customized react-map-gl-draw-editor style (#247)
- Support polygon closing styling (#241)
- Support pan gestures when not interacting with a feature (#242)
- Update advanced example style to dark mode (#239)
- RFC: react-map-gl-draw (#229)

## [0.14.0](https://github.com/uber/nebula.gl/compare/v0.13.0...v0.14.0) - 2019-06-18

### Changes

- Implement elevation-aware nearestPointOnLine (#236)
- add billboard prop to editable-geojson-layer (#234)
- upgrade deck to 7.1 (#235)
- Refactor react-map-gl-draw (#230)
- Enable flow for react-map-gl-draw (#227)

## [0.13.0](https://github.com/uber/nebula.gl/compare/v0.12.1...v0.13.0) - 2019-05-13

### Breaking changes

- For `translate` mode:
  - Specify `modeConfig.additionalSnapTargets`, which is a list of Features, instead of `modeConfig.layerIdsToSnapTo`.
  - Specify `EditableGeoJsonLayer.pickingRadius` rather than `modeConfig.snapPixels`.

### Added

- For snapping functionality, can now specify `modeConfig.additionalSnapTargets` to support snapping to an array GeoJSON features whether or not they are rendered
- Can override `pickingRadius` and `pickingDepth`

### Changes

- Create `@nebula.gl/edit-modes` module (#225)
- Decouple snapping functionality from deck.gl (#224)
- Remove dependency on deck.gl from ElevationHandler (#223)
- Ability to toggle GeoJSON text in example (#220)

## [0.12.1](https://github.com/uber/nebula.gl/compare/v0.12.0...v0.12.1) - 2019-05-07

### Changes

- Use functions to get to private properties (#218)
- rename react-editor-lite to react-map-gl-draw (#215)
- Fixed SelectionLayer: pickObjects to be called from deck (#214)
- Fixed snapping: Changed \_context.layerManager.pickObject (#213)
- Port react-map-gl draw control to @nebula.gl/react-editor-lite (#204)
- Pass through lineWidthUnits to GeoJSONLayer (#203)

## [0.12.0](https://github.com/uber/nebula.gl/compare/v0.11.2...v0.12.0) - 2019-04-22

### Changes

- v0.12.0
- Upgrade to deck 7.0 (#183)
- fix: remove extraneous console.log (#201)

## [0.11.2](https://github.com/uber/nebula.gl/compare/v0.11.1...v0.11.2) - 2019-04-11

### Changes

- fix version bug
- Add support to SnappableHandler to pick from other layers (#199)

## [0.11.1](https://github.com/uber/nebula.gl/compare/v0.11.0...v0.11.1) - 2019-04-06

### Changes

- Create ElevatedEditHandleLayer for better elevation editing (#195)
- Add snapping to translate mode (#177)
- Update immutable-feature-collection.js to copy elevation values when replacing coordinates (#194)
- add textarea to examples/deck
- Initial gatsby website structure (#186)
- Fix HtmlOverlay to handle possible null children (#192)

## [0.11.0](https://github.com/uber/nebula.gl/compare/v0.10.5...v0.11.0) - 2019-03-21

### Changes

- Setup coveralls (#191)
- Create @nebula.gl/layers (#189)
- Increase complexity of sample data (#190)
- Remove @nebula.gl/react (#188)
- Add zIndex property to html-overlay.js (#187)

## [0.10.5](https://github.com/uber/nebula.gl/compare/v0.10.4...v0.10.5) - 2019-03-19

### Changes

- Composite Mode Handler for creating and modifying at the same time (#184)
- Create @nebula.gl/overlays (#182)

## [0.10.4](https://github.com/uber/nebula.gl/compare/v0.10.3...v0.10.4) - 2019-03-15

### Changes

- add gitattributes
- Add elevation-handler mode (experimental) (#178)
- remove EditableJunctionsLayer (#180)
- Move path-marker-layer and path-outline-layer from deck.gl, remove experimental-layers dep (#176)
- Tweak changelog script

## [0.10.3](https://github.com/uber/nebula.gl/compare/v0.10.2...v0.10.3) - 2019-03-01

### Changes

- Fix publishing of readme to npm (#174)
- Add Design Goals (#173)

## [0.10.2](https://github.com/uber/nebula.gl/compare/v0.10.1...v0.10.2) - 2019-02-27

### Changes

- v0.10.2
- Add support for simultaneously editing multiple polygons in translate, rotate, scale, duplicate modes (#160)

## [0.10.1](https://github.com/uber/nebula.gl/compare/v0.10.0...v0.10.1) - 2019-02-14

### Changes

- fix getClusterObjects (#167)
- add scripts/changelog.sh

## [0.10.0](https://github.com/uber/nebula.gl/compare/v0.9.1...v0.10.0)

### Changes

- `featureIndex` renamed to `featureIndexes` (now an array of numbers instead of single number) for the `onEdit` callback.
- `positionIndexes` and `position` now nested under a new `editContext` property for the `onEdit` callback

## [0.9.1](https://github.com/uber/nebula.gl/compare/v0.9.0...v0.9.1)

- move supercluster to react module, upgrade version

## [0.9.0](https://github.com/uber/nebula.gl/compare/v0.8.0...v0.9.0)

### Fixes

- Fix issue with clicking edit handle while drawing polygon (#156)
- Issue 157. Pass Nebula childrens to Deck. (#158)
- Issue 154, avoid crash when nebula getChildContext being called before didMount (#155)

## [0.8.0](https://github.com/uber/nebula.gl/compare/v0.7.6...v0.8.0)

### Changed

- Upgraded deck.gl to 6.3.2
- Renamed `EditableGeoJsonLayer.onClick` to `EditableGeoJsonLayer.onLayerClick`

## [0.7.5](https://github.com/uber/nebula.gl/compare/v0.7.4...v0.7.5) - 2018-12-12

- Ability to split polygon with only right angles

<!-- ## [Unreleased](https://github.com/uber/nebula.gl/compare/v0.7.4...master) -->

## [0.7.4](https://github.com/uber/nebula.gl/compare/v0.7.3...v0.7.4) - 2018-12-10

- Ability to draw polygon with only right angles

## [0.7.3](https://github.com/uber/nebula.gl/compare/v0.7.2...v0.7.3) - 2018-11-26

- Handle null modeConfig
- Implement Split Polygon
- Ability to drag(extrude) an edge

## [0.7.2](https://github.com/uber/nebula.gl/compare/v0.7.1...v0.7.2) - 2018-11-12

- Implement selection-layer
- Detach event listeners on component unmount
- Disable hacky loop sync behind feature flag property

## [0.7.1](https://github.com/uber/nebula.gl/compare/v0.7.0...v0.7.1) - 2018-10-24

- Fix Nebula crashes on attempt to edit polygon layer over segment layer

## [0.7.0](https://github.com/uber/nebula.gl/compare/v0.6.1...v0.7.0) - 2018-10-23

### Added

- Ability to duplicate a feature ([#109](https://github.com/uber/nebula.gl/pull/109))
- Option to configure number of points for circle ([#103](https://github.com/uber/nebula.gl/pull/103))

### Changed

- `EditableGeoJsonLayer`'s `drawAtFront` prop should now be supplied via `modeConfig` prop ([#115](https://github.com/uber/nebula.gl/pull/115))

### Fixed

- Specify 6.0.5 as the minimum version for [deck.gl](https://github.com/uber/deck.gl)
- Fix turf v5 compatibility with boolean operations ([#111](https://github.com/uber/nebula.gl/pull/111))

## [0.6.1](https://github.com/uber/nebula.gl/compare/v0.5.1...v0.6.1) - 2018-10-10

### Added

- Ability to customize existing modes or add new modes using `ModeHandler`s
- `rotate` mode
- `translate` mode
- `scale` mode
- Boolean operations (union, difference, intersection) for polygon draw modes

### Changed

- Renamed `dragStartScreenCoords` to `pointerDownScreenCoords` and `dragStartGroundCoords` to `pointerDownGroundCoords` in `onStartDragging()`, `onStopDragging()`, and `onPointerMove()` events
- `isDragging` is now true whether or not something was picked in `onPointerMove()` event
- Edit handles will now only appear in `modify` and `drawPolygon` modes
- Can add new intermediate points anywhere along a line rather than just from the midpoint

## [0.5.1](https://github.com/uber/nebula.gl/compare/v0.4.3...v0.5.1) - 2018-09-24

### Removed

- `updatedMode` and `updatedSelectedFeatureIndexes` are no longer passed to the `onEdit` callback. It is now up to the consuming application to determine when/if mode or selection should be changed. See `examples/deck` for a demonstration.

### Changed

- Geometry type will no longer be "upgraded" or "downgraded" by nebula. `onEdit` will only be called once the desired geometry type is achieved (e.g. when completing the polygon).
- Renamed `getDrawLineColor` to `getTentativeLineColor`
- Renamed `getDrawFillColor` to `getTentativeFillColor`
- Renamed `getDrawLineWidth` to `getTentativeLineWidth`
- Renamed `getDrawLineDashArray` to `getTentativeLineDashArray`

### Fixes

- Double-click to complete polygon adds a point where the double-click happened

## [0.1.1 through 0.4.3](https://github.com/uber/nebula.gl/compare/v0.1.0...v0.4.3)

- See [commit history](https://github.com/uber/nebula.gl/compare/v0.1.0...v0.4.3) for changelog

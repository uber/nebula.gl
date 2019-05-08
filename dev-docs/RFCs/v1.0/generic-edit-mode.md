# Generic EditMode

* **Author**: Clay Anderson

## Summary

Create a generic `EditMode` class in `@nebula/core` that is independent of deck.gl, react-map-gl, and GeoJSON. This generic class can then be integrated into `EditableGeoJsonLayer` as well as the [upcoming DrawControl feature for react-map-gl](https://github.com/uber/react-map-gl/issues/734)

We will also refactor all the existing `ModeHandler` implementations of nebula to extend this class so that they can be used seamlessly between `nebula.gl` and `react-map-gl-draw`.

## Motivation

There are two limitations with nebula's `ModeHandler` interface.

1. It is dependent on deck.gl. This makes it unusable for `react-map-gl` which doesn't have a dependency on deck.gl.

2. It is specific to GeoJSON. But there are desires to support editing other kinds of geometries (e.g. Hexagons using [H3](https://uber.github.io/h3/#/)).

## API

The `EditMode` interface serves as the core abstraction to editing using nebula.gl. It uses a reactive style approach using callbacks to notify of changes to state and reacting to state changes via exposing an `updateState` function.

```javascript

export type ModeState<TData, TGuides> = {
  // The data being edited, this can be an array or an object
  data: TData,

  // Additional configuration for this mode
  modeConfig: any,

  // The indexes of the selected features
  selectedIndexes: number[],

  // Features that can be used as a guide for editing the data
  guides: ?TGuides,

  // The cursor type, as a [CSS Cursor](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)
  cursor: string,

  // Callback used to notify applications of an edit action
  onEdit: (editAction: EditAction<TData>) => void,

  // Callback used to update guides
  onUpdateGuides: (guides: ?TGuides) => void,

  // Callback used to update cursor
  onUpdateCursor: (cursor: string) => void
};

export interface EditMode<TData, TGuides> {
  // Called every time something in `state` changes
  updateState(state: ModeState<TData, TGuides>): void;

  // Called when the pointer went down and up without dragging regardless of whether something was picked
  handleClick(event: ClickEvent): void;

  // Called when the pointer moved, regardless of whether the pointer is down, up, and whether something was picked
  handlePointerMove(event: PointerMoveEvent): void;

  // Called when the pointer went down on something rendered by this layer and the pointer started to move
  handleStartDragging(event: StartDraggingEvent): void;

  // Called when the pointer went down on something rendered by this layer, the pointer moved, and now the pointer is up
  handleStopDragging(event: StopDraggingEvent): void;
}
```

A user of this interface will need to call `updateState` anytime the data within `ModeState` change. This is similar to how React calls `render` and how deck.gl calls `Layer.updateState` function.

An implementation of a mode is intended to override the `handle...` functions in order to handle user input. The mode can then call the callbacks provided in `ModeState` (e.g. `onEdit`).

## Integration to react-map-gl-draw

TODO

## Integration with nebula

### Module layout

We will need a `@nebula.gl/core` module separate from `nebula.gl` module. The reason is because this new `@nebula/core` should have no deck.gl dependency.

* `nebula.gl`
  * depends on `@nebula.gl/core`, `@nebula.gl/layers`, and all the other `@nebula/...` modules.
  * doesn't have anything in it, just basically imports from the others and re-exports them
* `@nebula.gl/core`
  * no (large) dependencies, ideally no dependencies
  * contains `EditMode` class
  * contains other general purpose types and classes (e.g. event types like `ClickEvent`)
* `@nebula.gl/layers`
  * depends on `@nebula.gl/core` and `deck.gl`
  * contains `EditableGeoJsonLayer`, a deck.gl `CompositeLayer`
* `@nebula.gl/geojson-modes`
  * depends on `@nebula.gl/core` and [turf.js](http://turfjs.org/)
  * contains all the modes for editing GeoJSON (e.g. `DrawPolygonMode`)
  * this module can then be reused by `react-map-gl-draw`

### Breaking changes

There will be breaking changes to refactor nebula's `ModeHandler` interface to adhere to `EditMode`'s interface. Specifics will be listed in the changelog.

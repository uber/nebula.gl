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

```javascript
// Represents an edit action, i.e. a suggestion to update the data based on user interaction events
export type EditAction<TData> = {
  updatedData: TData,
  editType: string,
  affectedIndexes: number[],
  editContext: any
};

// Represents an object "picked" from the screen. This usually reflects an object under the cursor
export type Pick = {
  object: any,
  index: number,
  isGuide: boolean
};

// Represents a click event
export type ClickEvent = {
  picks: Pick[],
  screenCoords: Position,
  mapCoords: Position,
  sourceEvent: any
};

// Represents a double-click event
export type DoubleClickEvent = {
  mapCoords: Position,
  sourceEvent: any
};

// Represents an event that occurs when the pointer goes down and the cursor starts moving
export type StartDraggingEvent = {
  picks: Pick[],
  screenCoords: Position,
  mapCoords: Position,
  pointerDownScreenCoords: Position,
  pointerDownMapCoords: Position,
  sourceEvent: any
};

// Represents an event that occurs after the pointer goes down, moves some, then the pointer goes back up
export type StopDraggingEvent = {
  picks: Pick[],
  screenCoords: Position,
  mapCoords: Position,
  pointerDownScreenCoords: Position,
  pointerDownMapCoords: Position,
  sourceEvent: any
};

// Represents an event that occurs every time the pointer moves
export type PointerMoveEvent = {
  screenCoords: Position,
  mapCoords: Position,
  picks: Pick[],
  isDragging: boolean,
  pointerDownPicks: ?(Pick[]),
  pointerDownScreenCoords: ?Position,
  pointerDownMapCoords: ?Position,
  sourceEvent: any
};

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

export class EditMode<TData, TGuides> {
  state: ModeState<TData, TGuides>;

  getState(): ModeState<TData, TGuides> {
    return this.state;
  }

  updateState(state: ModeState<TData, TGuides>) {
    const changedEvents: (() => void)[] = [];
    if (this.state && this.state.data !== state.data) {
      changedEvents.push(this.onDataChanged);
    }
    if (this.state && this.state.modeConfig !== state.modeConfig) {
      changedEvents.push(this.onModeConfigChanged);
    }
    if (this.state && this.state.selectedIndexes !== state.selectedIndexes) {
      changedEvents.push(this.onSelectedIndexesChanged);
    }
    if (this.state && this.state.guides !== state.guides) {
      changedEvents.push(this.onGuidesChanged);
    }
    this.state = state;

    changedEvents.forEach(fn => fn.bind(this)());
  }

  // Overridable user interaction handlers
  handleClick(event: ClickEvent): void {}
  handlePointerMove(event: PointerMoveEvent): void {}
  handleStartDragging(event: StartDraggingEvent): void {}
  handleStopDragging(event: StopDraggingEvent): void {}

  // Convenience functions to handle state changes
  onDataChanged(): void {}
  onModeConfigChanged(): void {}
  onSelectedIndexesChanged(): void {}
  onGuidesChanged(): void {}

  // Convenience functions to access state
  getModeConfig(): any {
    return this.state.modeConfig;
  }
  getSelectedIndexes(): number[] {
    return this.state.selectedIndexes;
  }
  getGuides(): ?TGuides {
    return this.state && this.state.guides;
  }
  onEdit(editAction: EditAction<TData>): void {
    this.state.onEdit(editAction);
  }
  onUpdateGuides(guides: ?TGuides): void {
    this.state.onUpdateGuides(guides);
  }
  onUpdateCursor(cursor: string): void {
    this.state.onUpdateCursor(cursor);
  }
}
```

A user of this class will need to call `updateState` anytime the data within `ModeState` change. This is similar to how React calls `render` and how deck.gl calls each layer's `updateState` function.

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
  * contains all the modes for editing GeoJSON
  * this module can then be reused by `react-map-gl-draw`

### Breaking changes

There will be breaking changes to refactor nebula's `ModeHandler` interface to adhere to `EditMode`'s interface. Specifics will be listed in the changelog.

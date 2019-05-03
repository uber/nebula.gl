# Generic EditMode

* **Author**: Clay Anderson

## Summary

Create a generic `EditMode` class in `@nebula/core` that is independent of deck.gl, react-map-gl, and GeoJSON. This generic class can then be integrated into `EditableGeoJsonLayer` as well as the [upcoming DrawControl feature of react-map-gl](https://github.com/uber/react-map-gl/issues/734)

We will also refactor all the existing `ModeHandler` implementations of nebula to extend this class so that they can be used seamlessly between nebula.gl and react-map-gl.

## Motivation

There are two limitations with nebula's `ModeHandler` interface.

1. It is dependent on deck.gl. This makes it unusable for `react-map-gl` which doesn't have a dependency on deck.gl.

2. It is specific to GeoJSON. But there are desires to support editing other kinds of geometries (e.g. Hexagons using [H3](https://uber.github.io/h3/#/)).

## API

```javascript
export type ModeState<TData, TGuides> = {
  data: TData,
  modeConfig: any,
  selectedIndexes: number[],
  guides: ?TGuides,
  onEdit: (data: TData, editContext: any) => void
  onUpdateGuides: (guides: ?TGuides) => void,
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

  getModeConfig(): any {
    return this.state.modeConfig;
  }

  getSelectedIndexes(): number[] {
    return this.state.selectedIndexes;
  }

  getGuides(): ?TGuides {
    return this.state && this.state.guides;
  }

  onDataChanged(): void {}
  onModeConfigChanged(): void {}
  onSelectedIndexesChanged(): void {}
  onGuidesChanged(): void {}

  handleClick(event: ClickEvent): void {}
  handlePointerMove(event: PointerMoveEvent): { cancelMapPan: boolean } {}
  handleStartDragging(event: StartDraggingEvent): void {}
  handleStopDragging(event: StopDraggingEvent): void {}
}
```

A user of this class will need to call `updateState` anytime the data within `ModeState` change. This is similar to how React calls `render` and how deck.gl calls each layer's `updateState` function.

An implementation of a mode is intended to override the `handle...` functions in order to handle user input. The mode can then call the callbacks provided in `ModeState` (e.g. `onEdit`).

## Integration to react-map-gl

TODO

## Integration with nebula's `ModeHandler`

### Breaking changes

TODO

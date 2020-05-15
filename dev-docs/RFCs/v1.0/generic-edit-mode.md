# Generic EditMode

- **Author**: Clay Anderson

## Summary

Create a generic `EditMode` interface that will serve as the core interface for handling user interaction and manipulating data. It will not be dependent on deck.gl, react-map-gl, or GeoJSON. This generic class will then be integrated into `EditableGeoJsonLayer` as well as the [upcoming DrawControl feature for react-map-gl](https://github.com/uber/react-map-gl/issues/734)

We will also refactor all the existing `ModeHandler` implementations of nebula to implement this interface instead so that they can be used seamlessly between `nebula.gl` and `react-map-gl-draw`.

## Motivation

There are two limitations with nebula's `ModeHandler` interface.

1. It is dependent on deck.gl. This makes it unusable for `react-map-gl` which doesn't have a dependency on deck.gl.

2. It is specific to GeoJSON. But there are desires to support editing other kinds of geometries (e.g. Hexagons using [H3](https://uber.github.io/h3/#/)).

## API

The `EditMode` interface serves as the core abstraction to editing using nebula.gl. It uses a reactive style approach using callbacks to notify of changes to state and reacting to state changes by receiving a `props` parameter in its functions.

```javascript
export type ModeProps<TData> = {
  // The data being edited, this can be an array or an object
  data: TData,

  // Additional configuration for this mode
  modeConfig: any,

  // The indexes of the selected features
  selectedIndexes: number[],

  // The cursor type, as a [CSS Cursor](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)
  cursor: ?string,

  // The last pointer move event that occurred
  lastPointerMoveEvent: PointerMoveEvent,

  // Callback used to notify applications of an edit action
  onEdit: (editAction: EditAction<TData>) => void,

  // Callback used to update cursor
  onUpdateCursor: (cursor: ?string) => void,
};

export interface EditMode<TData, TGuides> {
  // Called when the pointer went down and up without dragging regardless of whether something was picked
  handleClick(event: ClickEvent, props: ModeProps<TData>): void;

  // Called when the pointer moved, regardless of whether the pointer is down, up, and whether something was picked
  handlePointerMove(event: PointerMoveEvent, props: ModeProps<TData>): void;

  // Called when the pointer went down on something rendered by this layer and the pointer started to move
  handleStartDragging(event: StartDraggingEvent, props: ModeProps<TData>): void;

  // Called when the pointer went down on something rendered by this layer, the pointer moved, and now the pointer is up
  handleStopDragging(event: StopDraggingEvent, props: ModeProps<TData>): void;

  // Return features that can be used as a guide for editing the data, expected to be called when `props` change
  getGuides(props: ModeProps<TData>): TGuides;
}
```

An implementation of a mode is intended to override the `handle...` functions in order to handle user input. The mode implementation can then call the callbacks provided in `props` (e.g. `onEdit` to change the data being edited).

## Integration with nebula

### Usage from EditableGeoJsonLayer

`EditableGeoJsonLayer` will be responsible for the following:

- Register event handlers with the browser and call the active `EditMode`'s functions
- Pick objects (i.e. determining all objects that are under or near the cursor) and pass those to the active `EditMode`
- Forward `onEdit` calls from the active edit mode to a consuming application
- Render the data
- Render the guides (which are obtained by calling `getGuides`)

Pseudocode:

```js
class EditableGeoJsonLayer {
  initialize() {
    window.addEventListener('click', this.onClick);
  }

  getModeProps() {
    return {
      data: this.props.data,
      onEdit: (editAction) => {
        this.props.onEdit(editAction);
      },
      // ...
    };
  }

  onClick(rawBrowserEvent) {
    const screenCoords = this.getScreenCoordsFromPointerEvent(rawBrowserEvent);
    const clickEvent = {
      picks: this.pickObjectsUnderCursor(rawBrowserEvent), // this will utilize deck.gl's picking functionality
      screenCoords,
      mapCoords: this.unproject(screenCoords),
    };
    this.activeMode.handleClick(clickEvent, this.getModeProps());
  }

  render() {
    this.renderData(this.props.data);

    const guides = this.activeMode.getGuides(this.getModeProps());
    this.renderGuides(guides);
  }
}
```

### Module layout

We will need a `@nebula.gl/edit-modes` module separate from the `nebula.gl` module. The reason is because this new `@nebula/edit-modes` should have no deck.gl dependency.

- `nebula.gl`
  - depends on `@nebula.gl/edit-modes`, `@nebula.gl/layers`, and all the other `@nebula/...` modules.
  - doesn't have much in it, just basically imports from the others and re-exports them
- `@nebula.gl/edit-modes`
  - depends [turf.js](http://turfjs.org/), no (large) dependencies like deck.gl
  - contains all the modes for editing GeoJSON (e.g. `DrawPolygonMode`)
  - contains `EditMode` interface
  - contains other general purpose types and classes (e.g. event types like `ClickEvent`)
  - this module will be reused by `react-map-gl-draw`
- `@nebula.gl/layers`
  - depends on `@nebula.gl/edit-modes` and `deck.gl`
  - contains `EditableGeoJsonLayer`, a deck.gl `CompositeLayer`
- Other modules are unaffected (e.g. `@nebula.gl/overlays`)

### Breaking changes

There will be breaking changes to refactor nebula's `ModeHandler` interface to adhere to `EditMode`'s interface. Specifics will be listed in the changelog and possibly a migration guide.

## Integration to react-map-gl-draw

`react-map-gl-draw` will follow a similar approach as `EditableGeoJsonLayer` and be responsible for the same things.

## GeoJSON

The primary implementation of `EditMode` will be for editing GeoJSON. We will expose a `GeoJsonEditMode` class with helpers for editing GeoJSON.

```javascript
export class GeoJsonEditMode implements EditMode<FeatureCollection, FeatureCollection> {
  //...
}
```

All `ModeHandler` implementations will be refactored to extend this base class.

### Data

The data is represented as a GeoJSON FeatureCollection.

### Guides

The guides will also be represented as a GeoJSON FeatureCollection. Guides are visual elements that assist the user with editing the geometries. They are often rendered as dashed lines or some other style to reflect that they are helping you edit the data but they aren't the data itself.

![guide](https://i.imgur.com/Lx9puHJ.png)
![guide](https://i.imgur.com/JMfPDz6.png)

The `GeoJsonEditMode` will support 2 types of guides, tentative and edit handles.

#### Tentative

Tentative features are intended to show you the tentative geometry that can be committed (e.g. by clicking). They will be represented with the following `properties` in the GeoJSON:

```js
{
  guideType: 'tentative';
}
```

#### Edit handles

Edit handles are points that are part of an existing geometry used for manipulation or snapping. They will be represented with the following `properties` in the GeoJSON:

```js
{
  guideType: 'editHandle',
  editHandleType: /* existing, intermediate, or snap */
}
```

#### Example

Here's an example guides object after drawing two points of a line string:

```js
{
  type: 'FeatureCollection',
  features: [
    // Line string that follows the mouse as it moves
    {
      type: 'Feature',
      properties: {
        guideType: 'tentative'
      },
      geometry: {
        type: 'LineString',
        coordinates: []
      }
    },
    // Point 0 (first one clicked)
    {
      type: 'Feature',
      properties: {
        guideType: 'editHandle',
        editHandleType: 'existing',
        positionIndexes: [0],
        featureIndex: 0
      },
      geometry: {
        type: 'Point',
        coordinates: [...]
      }
    },
    // Point 1 (second one clicked)
    {
      type: 'Feature',
      properties: {
        guideType: 'editHandle',
        editHandleType: 'existing',
        positionIndexes: [1],
        featureIndex: 0
      },
      geometry: {
        type: 'Point',
        coordinates: [...]
      }
    }
  ]
};
```

## Custom EditMode

A user can provide their own `EditMode` implementation. If it is for editing GeoJSON, it is likely easier to extend `GeoJsonEditMode` or one of the existing edit modes implemented in nebula.

The following example demonstrates the `EditMode` interface. This `DrawPointsMode` class implements the ability to add a point to an array of points upon click.

```javascript
class DrawPointsMode implements EditMode {
  handleClick(event, props) {
    // props.data is an array of points and should not be mutated directly
    // event.mapCoords is the coordinates on the map (lat/long) that the user clicked
    const updatedData = [...props.data, event.mapCoords];

    // props.onEdit is the edit callback sent to the application using nebula.gl
    // updatedData is the immutably-updated data
    // nebula.gl will subsequently call updateState with the updated data
    props.onEdit({ updatedData, editType: 'ADD_POINT' });
  }

  // No special handling for dragging
  handlePointerMove(event) {}
  handleStartDragging(event) {}
  handleStopDragging(event) {}
}
```

# Nebula (React Components)

The `Nebula` class is a subclass of the React [Component] class that you can use as the main class.


## Usage

Define a composite layer that renders a set of sublayers.

```jsx
<Nebula
  viewport={viewport}
  layers={layers}
  selectionType={selectionType}
  onSelection={onSelection}
  onMapMouseEvent={onMapMouseEvent}
  logger={logger}
/>
```


## Properties

### viewport
The viewport as explained in [react-map-gl docs](https://uber.github.io/react-map-gl/#/Documentation/getting-started/state-management)

### layers
An array of layers you want to render.
Include Deck.gl or Nebula.gl layers but not overlays. The order matters.

### selectionType
Value of ```SELECTION_TYPE```. The default is ```NONE```.
Set it to a different value to start selection of objects.

### onSelection
Callback. Called when user object selection is completed.
You can set ```selectionType``` to ```NONE``` in this callback if you are done selecting objects.

### onMapMouseEvent
Callback. Called when mouse is moved over the map.

### logger
Optional. Pass an object that will be used to log messages like ```console```.



## Methods

##### `updateAllDeckObjects`

Update all objects in all layers and re-render.

Parameters: None.

##### `updateDeckObjectsByIds`

Update objects with specified ids in all layers and re-render.

Parameters:

- `ids` (Array)
  * Array of strings with ids that need updating.

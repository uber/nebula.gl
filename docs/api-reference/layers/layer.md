# Layer

## Methods

### constructor

`new Layer({getData, toNebulaFeature})`

* `getData`: A function that returns an `array` of `objects` that need rendering.
Each `object` must have a unique `id` string property.
* `toNebulaFeature`: A function that converts any object of the above array into a [Feature](documentation/api-reference/feature).
* `on`: An optional `object` with event names as keys and functions as values.


## Edit Event Callbacks

Only editable layers emit these events.

### editStart

* `LayerMouseEvent` parameter.
* `object` parameter


### editUpdate

* `LayerMouseEvent` parameter.
* `object` parameter


### editEnd

* `LayerMouseEvent` parameter.
* `object` parameter



## Event Callbacks

The following mouse events are emitted

### click

* `LayerMouseEvent` parameter.

### dblclick

* `LayerMouseEvent` parameter.

### mousemove

* `LayerMouseEvent` parameter.

### mouseup

* `LayerMouseEvent` parameter.


### mousedown

* `LayerMouseEvent` parameter.



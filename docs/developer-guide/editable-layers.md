# Layers

## Common layer API

Each layer takes a `config Object` in the constructor. This `Object` must contain:
- `getData`: A function that returns an `array` of `objects` that need rendering.
- `toNebulaFeature`: A function that converts any object in the array into `Feature`.



### Callbacks
The following mouse events are emitted:
- click
- dblclick
- mousemove
- mouseup
- mousedown

Each of them provides a `LayerMouseEvent` parameter.


## Editable layers additional APIs


### Editable layers additional callbacks
- editStart
- editUpdate
- editEnd

These provide a `LayerMouseEvent` parameter and an additional `object` parameter.



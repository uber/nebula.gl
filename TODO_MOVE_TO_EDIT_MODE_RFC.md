## Methods

These methods can be overridden in a derived class in order to customize event handling.

### `onLayerClick`

The pointer went down and up without dragging. This method is called regardless if something was picked.

#### `event` argument

* `picks` (Array): An array containing [deck.gl Picking Info Objects](https://uber.github.io/deck.gl/#/documentation/developer-guide/adding-interactivity?section=what-can-be-picked-) for all objects that were under the pointer when clicked, or an empty array if nothing from this layer was under the pointer.
* `screenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas.
* `groundCoords` (Array): `[lng, lat]` ground coordinates.

### `onStartDragging`

The pointer went down on something rendered by this layer and the pointer started to move.

* `picks` (Array): An array containing [deck.gl Picking Info Objects](https://uber.github.io/deck.gl/#/documentation/developer-guide/adding-interactivity?section=what-can-be-picked-) for all objects that were under the pointer when it went down.
* `screenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer was when it was considered to start dragging (should be very close to `pointerDownScreenCoords`).
* `groundCoords` (Array): `[lng, lat]` ground coordinates where the pointer was when it was considered to start dragging (should be very close to `pointerDownGroundCoords`).
* `pointerDownScreenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer went down.
* `pointerDownGroundCoords` (Array): `[lng, lat]` ground coordinates where the pointer went down.

_Note: this method is not called if nothing was picked when the pointer went down_

### `onStopDragging`

The pointer went down on something rendered by this layer, the pointer moved, and now the pointer is up.

* `picks` (Array): An array containing [deck.gl Picking Info Objects](https://uber.github.io/deck.gl/#/documentation/developer-guide/adding-interactivity?section=what-can-be-picked-) for all objects that were under the pointer when it went down.
* `screenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer went up.
* `groundCoords` (Array): `[lng, lat]` ground coordinates where the pointer went up.
* `pointerDownScreenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer went down.
* `pointerDownGroundCoords` (Array): `[lng, lat]` ground coordinates where the pointer went down.

### `onPointerMove`

The pointer moved, regardless of whether the pointer is down, up, and whether or not something was picked

* `screenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer is now.
* `groundCoords` (Array): `[lng, lat]` ground coordinates where the pointer is now.
* `picks` (Array): An array containing [deck.gl Picking Info Objects](https://uber.github.io/deck.gl/#/documentation/developer-guide/adding-interactivity?section=what-can-be-picked-) for all objects that are under the pointer now.
* `isDragging` (Boolean): `true` if the pointer went down and has moved enough to consider the movement a drag gesture, otherwise `false`.
* `pointerDownPicks` (Array): An array containing [deck.gl Picking Info Objects](https://uber.github.io/deck.gl/#/documentation/developer-guide/adding-interactivity?section=what-can-be-picked-) for all objects that were under the pointer when it went down, if any. This will be populated even if the pointer hasn't yet moved enough to set `isDragging` to `true`.
* `pointerDownScreenCoords` (Array): `[x, y]` screen pixel coordinates relative to the deck.gl canvas where the pointer went down.
* `pointerDownGroundCoords` (Array): `[lng, lat]` ground coordinates where the pointer went down.

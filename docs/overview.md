# Overview

[nebula.gl](https://neb.gl) provides editable and interactive map overlay layers, built using the power of [deck.gl](https://uber.github.io/deck.gl).

## EditableGeoJsonLayer

[EditableGeoJsonLayer](./api-reference/layers/editable-geojson-layer.md) is implemented as a deck.gl layer. It provides the ability to view and edit multiple types of geometry formatted as [GeoJSON](https://tools.ietf.org/html/rfc7946) (an open standard format for geometry).

## Nebula Layers

nebula.gl includes a react component. In order to use it you need to put it inside `MapGL` and provide
`viewport` and `layers`. `layers` is an array, there are multiple types of layers.

These are the **native** type of layers for nebula.gl. There are multiple examples here.
They may just display objects or display and allow you to edit objects.
These layers are rendered using ```WebGL```.

### Callbacks

When there is the ability to edit, callbacks are provided to inform you of edits.
More details in [Using Editable Layers](documentation/developer-guide/using-editable-layers)

### Deck.gl Layers

You can use Deck.gl layers inside nebula.gl. These layers would work the same way as in Deck.gl.
This way you can combine both types of layers for maximum flexibility.
These layers are rendered using `WebGL`.

### Overlay Layers
These layers are based on HTML and rendered by the browser. You can use them
for complicated objects that follow map points. They are less performant
but more flexible. For more details see [Using Html Overlays](documentation/developer-guide/using-html-overlays)

# Overview

[nebula.gl](https://neb.gl) provides editable and interactive map overlay layers, built using the power of [deck.gl](https://uber.github.io/deck.gl).

## Design Goals

nebula.gl aspires to be an ultra-performant, fully 3D-enabled GeoJSON editing system primarily focused on geospatial editing use cases.

- * Maximal rendering and editing performance, without need for complex application logic (such as splitting data into subgroups etc).
- * Target performance: Editing at 60fps (e.g. dragging sub objects) in GeoJSON payloads with 100K features (points, lines or polygons).
- * Handles GeoJSON corner cases, e.g. automatically changing object types from `Polygon` to `MultiPolygon` when addition polygons are added.
- * Fully 3D enabled (Can e.g. use WebGL z-buffer so that lines being rendered are properly occluded by other geometry).
- * Seamless integration with deck.gl and all geospatial deck.gl layers, allowing for GeoJSON editing to be interleaved with rich 3D visualizations.
- * Handle all aspects of event handling, including touch screen support.


## Why nebula.gl?

You should strongly consider nebula.gl:

* You want a full-featured, ultra-high-performance editing solution for GeoJson.
* You are already using e.g. `deck.gl` or `react-map-gl`.

You may want to look at alternatives if:

* If you have very simple editing requirements (just a simple polygon etc)

If nebula.gl is more than what you need (e.g. in terms of bundle size), and you may want to look at other solutions, e.g. the simple polygon editor overlay being developed in react-map-gl.

That said, if you are already using `deck.gl` the additional overhead of nebula.gl is small, and the seamless integration with deck.gl should be valuable.


## Quick Overview of the nebula.gl API

### EditableGeoJsonLayer

[EditableGeoJsonLayer](./api-reference/layers/editable-geojson-layer.md) is implemented as a deck.gl layer. It provides the ability to view and edit multiple types of geometry formatted as [GeoJSON](https://tools.ietf.org/html/rfc7946) (an open standard format for geometry).

### Nebula Layers

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

### Overlays

These layers are based on HTML and rendered by the browser. You can use them
for complicated objects that follow map points. They are less performant
but more flexible. For more details see [Using Html Overlays](documentation/developer-guide/using-html-overlays)

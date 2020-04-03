# [MiniRFC] react-map-gl-draw: Support customized modes

- **Authors**: Xintong Xia
- **Date**: March 2020
- **Status**: Draft


## Summary

`react-map-gl-draw` gets more and more public interests, some users requested new drawing modes, i.e. drawing circle,
some want to customize drawing and editing behaviors, i.e. disable dragging while editing, drawing rectangle without releasing mouse.
Current API is not scalable to support customizations. Additionally Nebula.gl already support customized modes. 

## Proposal

Change the options `mode` type to be a `ModeHandler` object. And expose all the existing modes, and a method to allow user re-deregister events. 

- `mode` (Object, Optional)
  - default to `null`
   
  - `EditorModes.SELECT` - Lets you select features.
  - `EditorModes.EDITTING` - Lets you select and drag vertices; and drag features.
  - `EditorModes.DRAW_PATH` - Lets you draw a GeoJson `LineString` feature.
  - `EditorModes.DRAW_POLYGON` - Lets you draw a GeoJson `Polygon` feature.
  - `EditorModes.DRAW_POINT` - Lets you draw a GeoJson `Point` feature.
  - `EditorModes.DRAW_RECTANGLE` - Lets you draw a `Rectangle` (represented as GeoJson `Polygon` feature) with two clicks - start drawing on first click, and finish drawing on second click .
  - `EditorModes.DRAW_RECTANGLE_ONE_CLICK` - Lets you draw a `Rectangle` (represented as GeoJson `Polygon` feature) with one click - start drawing when mouse down and finish drawing when mouse released.

Customized edit mode should follow [BaseMode](https://github.com/uber/nebula.gl/blob/master/modules/react-map-gl-draw/src/edit-modes/base-mode.js)

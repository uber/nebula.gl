# nebula.gl Developer Guide

## API Summary

### Editing modes

With nebula.gl,  geometry editing is accomplished through editing modes. These modes instruct nebula.gl how it should handle user interactions in order to manipulate GeoJSON features and geometries. nebula.gl provides several modes for creating and manipulating points, lines, and polygons.

### EditableGeoJsonLayer

EditableGeoJsonLayer is a deck.gl layer that can be passed to deck.gl the same way as other deck.gl layers, and can even be used in conjunction with other deck.gl layers.

### react-map-gl-draw

react-map-gl-draw is a lighter weight module that supports the same editing modes as the deck.gl implementation, but utilizes SVG for rendering. It is dependent on react-map-gl but is not dependent on deck.gl. So, if you’re already using react-map-gl, but do not need the power of deck.gl, then this could be a great option.

## Guide

`EditableGeoJsonLayer` supports the ability to create and edit GeoJSON geometries. This layer can be passed to deck.gl the same way as other deck.gl layers, and can even be used in conjunction with other deck.gl layers.  Sample GeoJSON data containing a variety of GeoJSON features.

```
{
 "type": "FeatureCollection",
 "features": [
   { "type": "Feature", "geometry": {"type": "Point", "coordinates": [...]} },
   { "type": "Feature", "geometry": {"type": "LineString", "coordinates": [...]} },
   { "type": "Feature", "geometry": {"type": "Polygon", "coordinates": [...]} },
   { "type": "Feature", "geometry": {"type": "MultiPolygon", "coordinates": [...]} }
 ]
}
```

### onEdit callback

EditableGeoJsonLayer exposes a reactive-style interface where the state of the geometries is passed in through the data prop and state is updated by handling the onEdit callback. The updated geometries are provided to the onEdit callback through the updatedData argument.

All edits are done immutably. In other words, the data passed in to the data prop is never mutated. Instead, affected features are copied and the copy is modified. This ensures that a consuming application has the flexibility to further modify, or even reject, the edit proposed by nebula.gl.

Below, we share an example of how to use the EditableGeoJsonLayer with deck.gl and React. Note that the EditableGeoJsonLayer is simply added to the list of layers passed to deck.gl.

import DeckGL from "deck.gl";
import { EditableGeoJsonLayer, DrawPolygonMode } from "nebula.gl";
import { StaticMap } from "react-map-gl";

function GeometryEditor() {
  const [features, setFeatures] = React.useState({
    type: "FeatureCollection",
    features: []
  });
  const [selectedFeatureIndexes] = React.useState([]);

  const layer = new EditableGeoJsonLayer({
    data: features,
    mode: DrawPolygonMode,
    selectedFeatureIndexes,
    onEdit: ({ updatedData }) => setFeatures(updatedData)
  });

  return (
    <DeckGL
      initialViewState={initialViewState}
      controller={{doubleClickZoom: false}}
      layers={[layer]}
    >
      <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
    </DeckGL>
  );
}

### Editing modes

With nebula.gl,  geometry editing is accomplished through editing modes. The mode prop instructs nebula.gl how it should handle user interactions in order to manipulate GeoJSON features and geometries. nebula.gl provides several modes for creating points, lines, and polygons.

Further control of a particular mode can be accomplished through a modeConfig prop. For example, you can intersect, union, and difference polygons by passing modeConfig={booleanOperation: 'difference'}.

### Extensibility

nebula.gl was built with layers that take care of many GeoJSON editing use cases. However, new edit modes can be implemented by either 1) extending and customizing one of the existing modes or 2) implementing a new mode from scratch. See the edit modes provided by nebula.gl for inspiration.

Another point of extensibility if you need to edit something other than GeoJSON is to implement a custom editable layer class. There is an EditableLayer base class that can be extended to support editing additional forms of data.

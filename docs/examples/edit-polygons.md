# Edit GeoJSON Polygons

> Click a polygon to start editing. Then use the handles.


<!-- INJECT:"EditPolygonsExample" -->


```js
this.data = [];

this.layer = new EditablePolygonsLayer({
  getData: () => this.data,
  toNebulaFeature: data => {
    const style = {
      outlineColor: [0, 0, 0, 0.8],
      fillColor: data.edited ? [1, 0, 0, 0.5] : [0, 0, 1, 0.5],
      lineWidthMeters: 50
    };
    return new Feature(data.geoJson, style);
  },
  on: {
    mousedown: event => {
      this.layer.selectedPolygonId = event.data.id;
      this.layer.selectedSubPolygonIndex = event.metadata.index;
      this.nebula.updateAllDeckObjects();
    },
    editEnd: (event, info) => {
      // Update object after edit has finished
      this.data[info.id].geoJson = info.feature.geoJson;
      this.data[info.id].edited = true;
    }
  }
});

window
  .fetch(
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/arc/counties.json'
  )
  .then(response => {
    response.json().then(json => {
      json.features.filter(feature => feature.geometry.type === 'Polygon').forEach(feature =>
        this.data.push({
          geoJson: feature,
          id: this.data.length,
          edited: false
        })
      );
      // Refresh after fetching data
      this.nebula.updateAllDeckObjects();
    });
  });
```

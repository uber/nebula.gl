# Edit GeoJSON Points

> This shows all BART train stations and lets you move them around.


<!-- INJECT:"EditPointsExample" -->


```js
this.data = [];

this.layer = new EditableJunctionsLayer({
  getData: () => this.data,
  toNebulaFeature: data => {
    const style = {
      outlineColor: [0, 0, 0],
      fillColor: data.edited ? [1, 0, 0] : [0, 0, 1],
      pointRadiusMeters: 100,
      outlineRadiusMeters: 100
    };
    const geoJson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: data.coordinates
      }
    };
    return new Feature(geoJson, style);
  },
  on: {
    editEnd: (event, info) => {
      // Update object after edit has finished
      this.data[info.id].coordinates = info.feature.geoJson.geometry.coordinates;
      this.data[info.id].edited = true;
    }
  }
});

window
  .fetch(
    'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/website/bart-stations.json'
  )
  .then(response => {
    response.json().then(json => {
      json.forEach(({ coordinates }) =>
        this.data.push({ coordinates, id: this.data.length, edited: false })
      );
      // Refresh after fetching data
      this.nebula.updateAllDeckObjects();
    });
  });
```

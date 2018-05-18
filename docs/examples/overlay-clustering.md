# Clustering Overlay Example

> Zoom out until both points merge.

<!-- INJECT:"ClusteringOverlayExample" -->


```js
class SFBridges extends HtmlClusterOverlay {
  getAllObjects() {
    return [
      { name: 'Golden Gate Bridge', coordinates: [-122.478611, 37.819722] },
      { name: 'Bay Bridge', coordinates: [-122.346667, 37.818056] }
    ];
  }

  getObjectCoordinates(object) {
    return object.coordinates;
  }

  renderObject(coordinates, object) {
    return (
      <HtmlOverlayItem
        style={{ background: 'blue', padding: 4, color: 'white' }}
        key={object.name}
        coordinates={coordinates}
      >
        {object.name}
      </HtmlOverlayItem>
    );
  }

  renderCluster(coordinates, clusterId, pointCount) {
    return (
      <HtmlOverlayItem
        style={{ background: 'pink', padding: 4, color: 'white' }}
        key={clusterId}
        coordinates={coordinates}
      >
        {pointCount} Bridges
      </HtmlOverlayItem>
    );
  }
}
```

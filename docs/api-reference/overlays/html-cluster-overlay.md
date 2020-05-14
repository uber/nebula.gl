# HtmlClusterOverlay

Use this class if you have HTML items that need to be displayed at specific geo coordinates on the map
and cluster based on the zoom level.
**You need to subclass this class**. Then use it as a `react component` inside `DeckGL`.

## Example

For example code see [Unesco World Heritage](/docs/interactive-examples/world-heritage).

## Methods to override

### getAllObjects()

Override to provide an array of `Objects` that need clustering.
If the items have not changed please provide the same array to avoid
regeneration of the cluster which causes performance issues.

### getObjectCoordinates(object)

Override to provide coordinates for each object of getAllObjects().
Return array of two numbers.

### renderObject(coordinates, object)

Override to return an `HtmlOverlayItem` for the single `object` at `coordinates`.

### renderCluster(coordinates, clusterId, pointCount)

Override to return an HtmlOverlayItem for the `cluster` at `coordinates`.
`pointCount` is the number of objects that are represented by that cluster.
Use `getClusterObjects(clusterId)` to get cluster contents.

## Methods (provided)

### getClusterObjects(clusterId)

Returns an array of objects.

### getClusterOptions()

Override to return options used when instantiating the overlay and thus the
underlying [supercluster](https://www.npmjs.com/package/supercluster#options) object.

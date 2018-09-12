# Tentative Features

In order to better support Multi* geometries, I think we'll need a concept like "tentative feature". For example, when the user adds two points of what will be a second polygon of a MultiPolygon feature. This concept would only apply to the draw* modes.

The term "tentative" makes it clear that it isn't a real thing yet. Tentative features will need to stick around between `onEdit` calls, so it can't just be the `updatedData` argument. It'll need its own state/prop.

Here's my thought:

```
new EditableGeoJsonLayer({
  data: this.state.data,
  onEdit: ({data}) => this.setState({data}), // just as onEdit functions today

  // optional: if caller wants to customize tentative feature handling
  tentativeFeature: this.state.tentativeFeature,

  // optional: if caller wants to customize tentative feature handling
  onTentativeFeatureUpdate: ({updatedTentativeFeature}) => {
      tentativeFeature: updatedTentativeFeature,
  },
})
```

A couple of examples.

## Draw new line string

* `selectedFeatureIndexes=[]`
* `mode='drawLineString'`
* user moves pointer around
  * `onTentativeFeatureUpdate` called repeatedly as pointer moves around
    * `updatedTentativeFeature` is a point feature whose coordinates follow the mouse
* user clicks
  * `onEdit` is not called because it isn't a LineString yet
  * `onTentativeFeatureUpdate` called repeatedly as pointer moves around
    * `updatedTentativeFeature` is a LineString with first coordinate where user clicked, second coordinate follows the mouse
* user clicks
  * `onEdit` called, updatedData has a new LineString feature, updatedSelectedIndexes would have the new one selected
  * `onTentativeFeatureUpdate` called repeatedly as pointer moves around
    * `updatedTentativeFeature` is a LineString with first coordinate where user clicked the second time, second coordinate follows the mouse

## Draw new line polygon

* `selectedFeatureIndexes=[]`
* `mode='drawPolygon'`
* user moves pointer around
  * `onTentativeFeatureUpdate` called repeatedly as pointer moves around
    * `updatedTentativeFeature` is a point feature whose coordinates follow the mouse
* user clicks
  * `onEdit` is not called because it isn't a Polygon yet
  * `onTentativeFeatureUpdate` called repeatedly as pointer moves around
    * `updatedTentativeFeature` is a LineString with first coordinate where user clicked, second coordinate follows the mouse
* user clicks
  * `onEdit` is not called because it isn't a Polygon yet
  * `onTentativeFeatureUpdate` called repeatedly as pointer moves around
    * `updatedTentativeFeature` is a Polygon (triangle) with first coordinate where user clicked the first time, the second coordinate where the user clicked the second time, the third coordinate follows the mouse, and the fourth coordinate loops back to the first coordinate (completing the triangle)
* user clicks
  * `onEdit` called, updatedData has a new Polygon feature, updatedSelectedIndexes would have the new one selected
    * `updatedTentativeFeature` is a new a Point again following the mouse in order to add another Polygon to the feature (thus upgrading it to a MultiPolygon)

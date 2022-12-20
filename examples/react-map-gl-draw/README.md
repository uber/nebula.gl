<div align="center">
  <img src="https://avatars3.githubusercontent.com/u/2105791?v=3&s=200" />
</div>

## Example: react-map-gl-draw

Demonstrates how to draw with `react-map-gl-draw`

```
    yarn bootstrap // from root of `nebula.gl` if you haven't done so

    // then inside this exmaple dir
    yarn
    yarn start
    // or yarn start-local if you want to apply changes in local `modules/react-map-gl-draw`
```

### Remove handles (vertexes)

Handles can also be removed.

A handle can be selected with a single click and unselected clicking a selected handle (toggle), see [styles.js](./styles.js).

In the current example a single button implements both: remove feature or handle (only in Polygon and LineString). If one ore more handles are selected, the delete button will remove the handles first.

Notice removing handles could throw an error under some circumstances, see `removePosition` method in [ImmutableFeatureCollection](../../modules/edit-modes/src/lib/immutable-feature-collection.ts).

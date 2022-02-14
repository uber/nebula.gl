# What's New

This page contains highlights of each nebula.gl release.

## nebula.gl v1.0

Release date: TBD

### Draw Rectangle From Center Mode

- new `DrawRectangleFromCenterMode`. User can draw a new rectangular `Polygon` feature by clicking the center, then along a corner of the rectangle.

### Translate mode

- `screenSpace` option can be provided in the `modeConfig` of Translate mode so the features will be translated without distortion in screen space.

### Modify mode

- `lockRectangles` option can be provided in the `modeConfig` object for ModifyMode, so the features with `properties.shape === 'Rectangle'` will preserve rectangular shape.

### EditableGeojsonLayer

- `pickingLineWidthExtraPixels` property to specify additional line width in pixels for picking. Can be useful when `EditableGeojsonLayer` is over a deck.gl layer and precise picking is problematic, and when usage of `pickingDepth` introduces performance issues.

### Other

- Check [CHANGELOG](../CHANGELOG.md) for full list of changes.

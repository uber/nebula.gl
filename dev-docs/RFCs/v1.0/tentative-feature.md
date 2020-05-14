# Tentative Features

- **Author**: Clay Anderson
- **Date**: September, 2018
- **Status**: Review

References:

- [Background conversation](https://github.com/uber/nebula.gl/pull/49#issuecomment-413948690)

## Summary

This RFC proposes a mechanism for handling work in progress edits (e.g. first point of a LineString) to better enable use cases like cancelling drawing.

## Motivation

There are 2 issues motivating this RFC:

1. Currently, geometry types are upgraded and downgraded as necessary to maintain a valid GeoJSON `FeatureCollection` after every edit/render cycle. This means that while in `drawPolygon` mode, a Feature will first be a `Point`, then a `LineString`, then, only after completing the polygon, a `Polygon`. This will likely be surprising functionality to developers and will require extra data handling and validation (e.g. an application that only allows `Polygon`s will have to throw the feature away or prevent exiting `drawPolygon` mode if the user didn't finish the polygon).

2. Currently, users can't add additional `LineString`s to a `MultiLineString` feature, nor can they add `Polygon`s to a `MultiPolygon` feature.

## Marketing Pitch

- Separate tentative features from the FeatureCollection being edited in the `data` prop.

## Proposal

Store and update `tentativeFeature` state internally in `EditableGeoJsonLayer` separate from the `data` prop. Updates to `tentativeFeature` will not trigger `onEdit` callbacks until the tentative feature is "complete" and of the desired geometry type. The tentative feature functionality will only apply to `draw*` modes (they are ignored for `view` and `modify` modes).

### Upgrading/Downgrading Geometry Types

nebula.gl will no longer change a feature's geometry type.

For example, adding points in `drawPolygon` mode would update the `tentativeFeature` until a polygon was complete, at which point a `Polygon` feature would be added to `data` (through the `onEdit` callback). Conversely, a user could remove positions from a `Polygon` until it was a triangle, at which point nebula.gl would no longer allow removing positions.

## Examples

### Draw new line string

- `selectedFeatureIndexes=[]`
- `mode='drawLineString'`
- user moves pointer around
  - `tentativeFeature` is a point feature whose coordinates follow the mouse
- user clicks
  - `onEdit` is not called because it isn't a LineString yet
  - `tentativeFeature` is a LineString with first coordinate where user clicked, second coordinate follows the mouse
- user clicks
  - `onEdit` called, `updatedData` has a new LineString feature, `featureIndexes` is the index of the new feature
- user selects a `LineString`
- user moves pointer around
  - `tentativeFeature` is a LineString with first coordinate is the end of the selected `LineString`; second coordinate follows the mouse

### Draw new line polygon

- `selectedFeatureIndexes=[]`
- `mode='drawPolygon'`
- user moves pointer around
  - `tentativeFeature` is a point feature whose coordinates follow the mouse
- user clicks
  - `onEdit` is not called because it isn't a Polygon yet
  - `tentativeFeature` is a LineString with first coordinate where user clicked, second coordinate follows the mouse
- user clicks
  - `onEdit` is not called because it isn't a Polygon yet
  - `tentativeFeature` is a Polygon (triangle) with first coordinate where user clicked the first time, the second coordinate where the user clicked the second time, the third coordinate follows the mouse, and the fourth coordinate loops back to the first coordinate (completing the triangle)
- user clicks a few more times then clicks the starting point
  - `onEdit` called, `updatedData` has a new Polygon feature, `featureIndexes` is the index of the new feature
  - `tentativeFeature` is a new Point again following the mouse in order to add a new Polygon

## Future

Tentative feature functionality is a pre-requisite to `MultiLineString` and `MultiPolygon` editing ([RFC](./multi-geometry-editing.md))

## Alternatives Considered

Also considered using GeoJSON's [GeometryCollection](https://tools.ietf.org/html/rfc7946#section-3.1.8) to handle adding additional geometries to a Multi\* geometry type. But that exacerbates the surprising factor for features being upgraded, downgraded, and converted to/from `GeometryCollection` as the user edits. This is because, for example, GeoJSON doesn't support a `MultiPolygon` with a `Polygon` and a `Point`.

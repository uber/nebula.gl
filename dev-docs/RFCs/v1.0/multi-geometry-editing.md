# MultiLineString and MultiPolygon Editing

- **Author**: Clay Anderson
- **Date**: September, 2018
- **Status**: Review

References:

- [Tentative Feature RFC](./tentative-feature.md): Tentative feature functionality must be implemented first
- [Background conversation](https://github.com/uber/nebula.gl/pull/49#issuecomment-413948690)

## Summary

This RFC proposes a mechanism for adding additional `LineString`s and `Polygon`s to `MultiLineString` and `MultiPolygon` features respectively.

## Motivation

There are 2 issues motivating this RFC:

1. Currently, geometry types are upgraded and downgraded as necessary to maintain a valid GeoJSON `FeatureCollection` after every edit/render cycle. This means that while in `drawPolygon` mode, a Feature will first be a `Point`, then a `LineString`, then, only after completing the polygon, a `Polygon`. This will likely be surprising functionality to developers and will require extra data handling and validation (e.g. an application that only allows `Polygon`s will have to throw the feature away or prevent exiting `drawPolygon` mode if the user didn't finish the polygon).

2. Currently, users can't add additional `LineString`s to a `MultiLineString` feature, nor can they add `Polygon`s to a `MultiPolygon` feature.

## Marketing Pitch

- Add ability to edit `MultiLineString` and `MultiPolygon` features.

## Proposal

TODO

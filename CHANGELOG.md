
# Changelog

All notable changes to this project will be documented in this file. This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- ## [0.5.1](https://github.com/uber/nebula.gl/compare/v0.5.1...master) -->

## [0.5.1](https://github.com/uber/nebula.gl/compare/v0.4.3...v0.5.1) - 2017-09-24

### Removed

* `updatedMode` and `updatedSelectedFeatureIndexes` are no longer passed to the `onEdit` callback. It is now up to the consuming application to determine when/if mode or selection should be changed. See `examples/deck` for a demonstration.

### Changed

* Geometry type will no longer be "upgraded" or "downgraded" by nebula. `onEdit` will only be called once the desired geometry type is achieved (e.g. when completing the polygon).
* Renamed `getDrawLineColor` to `getTentativeLineColor`
* Renamed `getDrawFillColor` to `getTentativeFillColor`
* Renamed `getDrawLineWidth` to `getTentativeLineWidth`
* Renamed `getDrawLineDashArray` to `getTentativeLineDashArray`

### Fixes

* Double-click to complete polygon adds a point where the double-click happened

## [0.1.1 through 0.4.3](https://github.com/uber/nebula.gl/compare/v0.1.0...v0.4.3)

* See [commit history](https://github.com/uber/nebula.gl/compare/v0.1.0...v0.4.3) for changelog
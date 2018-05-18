// @flow
import type { Feature as GeoJson, Geometry } from 'geojson-types';

import type { Style } from '../types';

export default class Feature {
  // geo json coordinates
  geoJson: GeoJson<Geometry>;
  style: Style;
  original: ?any;
  metadata: Object;

  constructor(
    geoJson: GeoJson<Geometry>,
    style: Style,
    original: ?any = null,
    metadata: Object = {}
  ) {
    this.geoJson = geoJson;
    this.style = style;
    this.original = original;
    this.metadata = metadata;
  }

  getCoords(): any {
    return this.geoJson.geometry.coordinates;
  }
}

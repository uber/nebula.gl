import { Feature as GeoJson, Geometry } from 'geojson';

import { Style } from '../types';

export default class Feature {
  // geo json coordinates
  geoJson: GeoJson<Geometry>;
  style: Style;
  original: any | null | undefined;
  metadata: Record<string, any>;

  constructor(
    geoJson: GeoJson<Geometry>,
    style: Style,
    original: any | null | undefined = null,
    metadata: Record<string, any> = {}
  ) {
    this.geoJson = geoJson;
    this.style = style;
    this.original = original;
    this.metadata = metadata;
  }

  getCoords(): any {
    // @ts-ignore
    return this.geoJson.geometry.coordinates;
  }
}

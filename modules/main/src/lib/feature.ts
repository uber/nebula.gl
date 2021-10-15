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
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'coordinates' does not exist on type 'Geo... Remove this comment to see the full error message
    return this.geoJson.geometry.coordinates;
  }
}

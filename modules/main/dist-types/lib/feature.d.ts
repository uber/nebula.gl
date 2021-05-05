import { Feature as GeoJson, Geometry } from 'geojson';
import { Style } from '../types';
export default class Feature {
    geoJson: GeoJson<Geometry>;
    style: Style;
    original: any | null | undefined;
    metadata: Record<string, any>;
    constructor(geoJson: GeoJson<Geometry>, style: Style, original?: any | null | undefined, metadata?: Record<string, any>);
    getCoords(): any;
}
//# sourceMappingURL=feature.d.ts.map
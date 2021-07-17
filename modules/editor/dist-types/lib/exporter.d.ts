import { AnyGeoJson } from '@nebula.gl/edit-modes';
export declare type ExportParameters = {
    data: string;
    filename: string;
    mimetype: string;
};
export declare function toGeoJson(geoJson: AnyGeoJson, filename: string): ExportParameters;
export declare function toKml(geoJson: AnyGeoJson, filename: string): ExportParameters;
export declare function toWkt(geoJson: AnyGeoJson, filename: string): ExportParameters;
export declare function toStats(geoJson: AnyGeoJson, filename: string): ExportParameters;
//# sourceMappingURL=exporter.d.ts.map
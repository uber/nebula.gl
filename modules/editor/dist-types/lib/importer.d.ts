import { Feature } from '@nebula.gl/edit-modes';
export declare type ValidImportData = {
    valid: true;
    type: 'GeoJSON' | 'KML' | 'WKT';
    features: Feature[];
};
export declare type InvalidImportData = {
    valid: false;
    validationErrors: string[];
};
export declare type ImportData = ValidImportData | InvalidImportData;
export declare function parseImport(data: string | File): Promise<ImportData>;
//# sourceMappingURL=importer.d.ts.map
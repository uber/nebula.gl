import { MjolnirEvent } from 'mjolnir.js';
import type { FeatureOf, Feature, Polygon, Position } from '@nebula.gl/edit-modes';
export declare function isNumeric(val: any): boolean;
export declare function parseEventElement(evt: MjolnirEvent, features: Feature[], guides: Feature[]): {
    object: any;
    isGuide: boolean;
    type: any;
    index: any;
    featureIndex: any;
};
export declare function getScreenCoords(evt: MjolnirEvent): number[];
export declare function findClosestPointOnLineSegment(p1: Position, p2: Position, p: Position): number[];
export declare function getFeatureCoordinates(feature: Feature): number | [number, number] | [number, number, number] | ([number, number] | [number, number, number] | import("@nebula.gl/edit-modes").LineStringCoordinates | import("@nebula.gl/edit-modes").PolygonCoordinates | import("@nebula.gl/edit-modes").MultiPointCoordinates | import("@nebula.gl/edit-modes").MultiLineStringCoordinates | import("@nebula.gl/edit-modes").MultiPolygonCoordinates)[];
export declare function updateRectanglePosition(feature: FeatureOf<Polygon>, editHandleIndex: number, mapCoords: Position): any;
//# sourceMappingURL=utils.d.ts.map
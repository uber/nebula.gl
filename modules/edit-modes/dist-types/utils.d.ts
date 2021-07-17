import { Viewport, Pick, EditHandleFeature, EditHandleType } from './types';
import { Geometry, Position, Point, LineString, FeatureOf, FeatureWithProps } from './geojson-types';
export declare type NearestPointType = FeatureWithProps<Point, {
    dist: number;
    index: number;
}>;
export declare function toDeckColor(color?: [number, number, number, number] | number, defaultColor?: [number, number, number, number]): [number, number, number, number];
export declare function recursivelyTraverseNestedArrays(array: Array<any>, prefix: Array<number>, fn: Function): boolean;
export declare function generatePointsParallelToLinePoints(p1: Position, p2: Position, mapCoords: Position): Position[];
export declare function distance2d(x1: number, y1: number, x2: number, y2: number): number;
export declare function mix(a: number, b: number, ratio: number): number;
export declare function nearestPointOnProjectedLine(line: FeatureOf<LineString>, inPoint: FeatureOf<Point>, viewport: Viewport): NearestPointType;
export declare function getPickedEditHandle(picks: Pick[] | null | undefined): EditHandleFeature | null | undefined;
export declare function getPickedSnapSourceEditHandle(picks: Pick[] | null | undefined): EditHandleFeature | null | undefined;
export declare function getNonGuidePicks(picks: Pick[]): Pick[];
export declare function getPickedExistingEditHandle(picks: Pick[] | null | undefined): EditHandleFeature | null | undefined;
export declare function getPickedIntermediateEditHandle(picks: Pick[] | null | undefined): EditHandleFeature | null | undefined;
export declare function getPickedEditHandles(picks: Pick[] | null | undefined): EditHandleFeature[];
export declare function getEditHandlesForGeometry(geometry: Geometry, featureIndex: number, editHandleType?: EditHandleType): EditHandleFeature[];
//# sourceMappingURL=utils.d.ts.map
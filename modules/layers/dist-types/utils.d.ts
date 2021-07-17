import { Position, Point, LineString, FeatureOf, FeatureWithProps, Viewport } from '@nebula.gl/edit-modes';
export declare type NearestPointType = FeatureWithProps<Point, {
    dist: number;
    index: number;
}>;
export declare function toDeckColor(color?: [number, number, number, number] | number, defaultColor?: [number, number, number, number]): [number, number, number, number];
export declare function recursivelyTraverseNestedArrays(array: Array<any>, prefix: Array<number>, fn: Function): boolean;
export declare function generatePointsParallelToLinePoints(p1: Position, p2: Position, groundCoords: Position): Position[];
export declare function distance2d(x1: number, y1: number, x2: number, y2: number): number;
export declare function mix(a: number, b: number, ratio: number): number;
export declare function nearestPointOnProjectedLine(line: FeatureOf<LineString>, inPoint: FeatureOf<Point>, viewport: Viewport): NearestPointType;
//# sourceMappingURL=utils.d.ts.map
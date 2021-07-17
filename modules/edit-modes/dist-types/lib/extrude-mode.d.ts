import { FeatureCollection } from '../geojson-types';
import { ModeProps, StartDraggingEvent, StopDraggingEvent, DraggingEvent } from '../types';
import { ModifyMode } from './modify-mode';
export declare class ExtrudeMode extends ModifyMode {
    isPointAdded: boolean;
    handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void;
    coordinatesSize(positionIndexes: number[] | null | undefined, featureIndex: number, { features }: FeatureCollection): number;
    getBearing(p1: any, p2: any): number;
    isOrthogonal(positionIndexes: number[] | null | undefined, featureIndex: number, size: number, features: FeatureCollection): boolean;
    nextPositionIndexes(positionIndexes: number[] | null | undefined, size: number): number[];
    prevPositionIndexes(positionIndexes: number[] | null | undefined, size: number): number[];
    getPointForPositionIndexes(positionIndexes: number[] | null | undefined, featureIndex: number, { features }: FeatureCollection): any;
}
//# sourceMappingURL=extrude-mode.d.ts.map
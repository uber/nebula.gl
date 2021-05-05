import { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types';
import { EditAction } from './mode-handler';
import { ModifyHandler } from './modify-handler';
export declare class ExtrudeHandler extends ModifyHandler {
    isPointAdded: boolean;
    handlePointerMove(event: PointerMoveEvent): {
        editAction: EditAction | null | undefined;
        cancelMapPan: boolean;
    };
    handleStartDragging(event: StartDraggingEvent): EditAction | null | undefined;
    handleStopDragging(event: StopDraggingEvent): EditAction | null | undefined;
    coordinatesSize(positionIndexes: number[], featureIndex: number): number;
    getBearing(p1: any, p2: any): number;
    isOrthogonal(positionIndexes: number[], featureIndex: number, size: number): boolean;
    nextPositionIndexes(positionIndexes: number[], size: number): number[];
    prevPositionIndexes(positionIndexes: number[], size: number): number[];
    getPointForPositionIndexes(positionIndexes: number[], featureIndex: number): any;
}
//# sourceMappingURL=extrude-handler.d.ts.map
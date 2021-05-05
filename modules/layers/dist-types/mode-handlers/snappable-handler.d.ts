import { Feature, FeatureCollection, Position } from '@nebula.gl/edit-modes';
import { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types';
import { EditHandle, EditAction, ModeHandler } from './mode-handler';
declare type HandlePicks = {
    pickedHandle?: EditHandle;
    potentialSnapHandle?: EditHandle;
};
export declare class SnappableHandler extends ModeHandler {
    _handler: ModeHandler;
    _editHandlePicks: HandlePicks | null | undefined;
    _startDragSnapHandlePosition: Position;
    constructor(handler: ModeHandler);
    setFeatureCollection(featureCollection: FeatureCollection): void;
    setModeConfig(modeConfig: any): void;
    setSelectedFeatureIndexes(indexes: number[]): void;
    _getSnappedMouseEvent(event: Record<string, any>, snapPoint: Position): PointerMoveEvent;
    _getEditHandlePicks(event: PointerMoveEvent): HandlePicks;
    _updatePickedHandlePosition(editAction: EditAction): void;
    _getSnapTargets(): Feature[];
    _getNonPickedIntermediateHandles(): EditHandle[];
    getEditHandles(picks?: Array<Record<string, any>>, groundCoords?: Position): any[];
    _getSnapAwareEvent(event: Record<string, any>): Record<string, any>;
    handleStartDragging(event: StartDraggingEvent): EditAction | null | undefined;
    handleStopDragging(event: StopDraggingEvent): EditAction | null | undefined;
    getCursor(event: {
        isDragging: boolean;
    }): string;
    handlePointerMove(event: PointerMoveEvent): {
        editAction: EditAction | null | undefined;
        cancelMapPan: boolean;
    };
}
export {};
//# sourceMappingURL=snappable-handler.d.ts.map
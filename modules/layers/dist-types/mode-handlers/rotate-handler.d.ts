import { FeatureCollection, Position } from '@nebula.gl/edit-modes';
import { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types';
import { EditAction, ModeHandler } from './mode-handler';
export declare class RotateHandler extends ModeHandler {
    _isRotatable: boolean;
    _geometryBeingRotated: FeatureCollection | null | undefined;
    handlePointerMove(event: PointerMoveEvent): {
        editAction: EditAction | null | undefined;
        cancelMapPan: boolean;
    };
    handleStartDragging(event: StartDraggingEvent): EditAction | null | undefined;
    handleStopDragging(event: StopDraggingEvent): EditAction | null | undefined;
    getCursor({ isDragging }: {
        isDragging: boolean;
    }): string;
    getRotateAction(startDragPoint: Position, currentPoint: Position, editType: string): EditAction;
}
//# sourceMappingURL=rotate-handler.d.ts.map
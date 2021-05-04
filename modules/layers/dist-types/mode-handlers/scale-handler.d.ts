import { FeatureCollection, Position } from '@nebula.gl/edit-modes';
import { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types';
import { EditAction, ModeHandler } from './mode-handler';
export declare class ScaleHandler extends ModeHandler {
    _isScalable: boolean;
    _geometryBeingScaled: FeatureCollection | null | undefined;
    handlePointerMove(event: PointerMoveEvent): {
        editAction: EditAction | null | undefined;
        cancelMapPan: boolean;
    };
    handleStartDragging(event: StartDraggingEvent): EditAction | null | undefined;
    handleStopDragging(event: StopDraggingEvent): EditAction | null | undefined;
    getCursor({ isDragging }: {
        isDragging: boolean;
    }): string;
    getScaleAction(startDragPoint: Position, currentPoint: Position, editType: string): EditAction;
}
//# sourceMappingURL=scale-handler.d.ts.map
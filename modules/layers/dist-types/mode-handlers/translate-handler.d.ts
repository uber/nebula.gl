import { FeatureCollection, Position } from '@nebula.gl/edit-modes';
import { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types';
import { EditAction, ModeHandler } from './mode-handler';
export declare class TranslateHandler extends ModeHandler {
    _geometryBeforeTranslate: FeatureCollection | null | undefined;
    _isTranslatable: boolean;
    handlePointerMove(event: PointerMoveEvent): {
        editAction: EditAction | null | undefined;
        cancelMapPan: boolean;
    };
    handleStartDragging(event: StartDraggingEvent): EditAction | null | undefined;
    handleStopDragging(event: StopDraggingEvent): EditAction | null | undefined;
    getCursor({ isDragging }: {
        isDragging: boolean;
    }): string;
    getTranslateAction(startDragPoint: Position, currentPoint: Position, editType: string): EditAction | null | undefined;
}
//# sourceMappingURL=translate-handler.d.ts.map
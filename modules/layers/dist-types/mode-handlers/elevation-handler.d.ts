import { Position } from '@nebula.gl/edit-modes';
import { PointerMoveEvent, StopDraggingEvent } from '../event-types';
import { EditAction } from './mode-handler';
import { ModifyHandler } from './modify-handler';
export declare class ElevationHandler extends ModifyHandler {
    makeElevatedEvent(event: PointerMoveEvent | StopDraggingEvent, position: Position): Record<string, any>;
    handlePointerMove(event: PointerMoveEvent): {
        editAction: EditAction | null | undefined;
        cancelMapPan: boolean;
    };
    handleStopDragging(event: StopDraggingEvent): EditAction | null | undefined;
    getCursor(params: {
        isDragging: boolean;
    }): string;
    static calculateElevationChangeWithViewport(viewport: any, { pointerDownScreenCoords, screenCoords, }: {
        pointerDownScreenCoords: Position;
        screenCoords: Position;
    }): number;
}
//# sourceMappingURL=elevation-handler.d.ts.map
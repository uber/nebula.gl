import { Position, FeatureOf, Point, LineString } from '@nebula.gl/edit-modes';
import { NearestPointType } from '../utils';
import { ClickEvent, PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types';
import { EditAction, EditHandle, ModeHandler } from './mode-handler';
export declare class ModifyHandler extends ModeHandler {
    _lastPointerMovePicks: any;
    getEditHandles(picks?: Array<Record<string, any>>, groundCoords?: Position): EditHandle[];
    nearestPointOnLine(line: FeatureOf<LineString>, inPoint: FeatureOf<Point>): NearestPointType;
    handleClick(event: ClickEvent): EditAction | null | undefined;
    handlePointerMove(event: PointerMoveEvent): {
        editAction: EditAction | null | undefined;
        cancelMapPan: boolean;
    };
    handleStartDragging(event: StartDraggingEvent): EditAction | null | undefined;
    handleStopDragging(event: StopDraggingEvent): EditAction | null | undefined;
    getCursor({ isDragging }: {
        isDragging: boolean;
    }): string;
}
//# sourceMappingURL=modify-handler.d.ts.map
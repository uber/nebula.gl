import { Position } from '@nebula.gl/edit-modes';
import { ClickEvent, PointerMoveEvent } from '../event-types';
import { EditAction, EditHandle, ModeHandler } from './mode-handler';
export declare class DrawPolygonHandler extends ModeHandler {
    getEditHandles(picks?: Array<Record<string, any>>, groundCoords?: Position): EditHandle[];
    handleClick(event: ClickEvent): EditAction | null | undefined;
    handlePointerMove({ groundCoords, }: PointerMoveEvent): {
        editAction: EditAction | null | undefined;
        cancelMapPan: boolean;
    };
}
//# sourceMappingURL=draw-polygon-handler.d.ts.map
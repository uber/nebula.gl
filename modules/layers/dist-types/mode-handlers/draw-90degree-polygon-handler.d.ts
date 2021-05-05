import { Position } from '@nebula.gl/edit-modes';
import { ClickEvent, PointerMoveEvent } from '../event-types';
import { EditAction, EditHandle, ModeHandler } from './mode-handler';
export declare class Draw90DegreePolygonHandler extends ModeHandler {
    getEditHandles(picks?: Array<Record<string, any>>, groundCoords?: Position): EditHandle[];
    handlePointerMove({ groundCoords, }: PointerMoveEvent): {
        editAction: EditAction | null | undefined;
        cancelMapPan: boolean;
    };
    handleClick(event: ClickEvent): EditAction | null | undefined;
    finalizedCoordinates(coords: Position[]): Position[][];
    getIntermediatePoint(coordinates: Position[]): any;
}
//# sourceMappingURL=draw-90degree-polygon-handler.d.ts.map
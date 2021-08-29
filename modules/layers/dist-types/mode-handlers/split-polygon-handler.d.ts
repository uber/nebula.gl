import { ClickEvent, PointerMoveEvent } from '../event-types';
import { EditAction, ModeHandler } from './mode-handler';
export declare class SplitPolygonHandler extends ModeHandler {
    calculateGroundCoords(clickSequence: any, groundCoords: any): any;
    handleClick(event: ClickEvent): EditAction | null | undefined;
    handlePointerMove({ groundCoords, }: PointerMoveEvent): {
        editAction: EditAction | null | undefined;
        cancelMapPan: boolean;
    };
    splitPolygon(): EditAction;
}
//# sourceMappingURL=split-polygon-handler.d.ts.map
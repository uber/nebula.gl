import { ClickEvent, PointerMoveEvent } from '../event-types';
import { EditAction, ModeHandler } from './mode-handler';
export declare class DrawLineStringHandler extends ModeHandler {
    handleClick(event: ClickEvent): EditAction | null | undefined;
    handlePointerMove(event: PointerMoveEvent): {
        editAction: EditAction | null | undefined;
        cancelMapPan: boolean;
    };
}
//# sourceMappingURL=draw-line-string-handler.d.ts.map
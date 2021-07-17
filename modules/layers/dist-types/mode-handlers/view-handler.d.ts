import { Position } from '@nebula.gl/edit-modes';
import { EditHandle, ModeHandler } from './mode-handler';
export declare class ViewHandler extends ModeHandler {
    getCursor({ isDragging }: {
        isDragging: boolean;
    }): string;
    getEditHandles(picks?: Array<Record<string, any>>, groundCoords?: Position): EditHandle[];
}
//# sourceMappingURL=view-handler.d.ts.map
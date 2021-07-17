import { StartDraggingEvent } from '../event-types';
import { EditAction } from './mode-handler';
import { TranslateHandler } from './translate-handler';
export declare class DuplicateHandler extends TranslateHandler {
    handleStartDragging(event: StartDraggingEvent): EditAction | null | undefined;
    getCursor({ isDragging }: {
        isDragging: boolean;
    }): string;
}
//# sourceMappingURL=duplicate-handler.d.ts.map
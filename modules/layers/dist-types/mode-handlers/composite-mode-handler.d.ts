import { FeatureCollection, Feature, Position } from '@nebula.gl/edit-modes';
import { ClickEvent, PointerMoveEvent, StartDraggingEvent, StopDraggingEvent } from '../event-types';
import { ModeHandler, EditAction, EditHandle } from './mode-handler';
export declare class CompositeModeHandler extends ModeHandler {
    handlers: Array<ModeHandler>;
    options: Record<string, any>;
    constructor(handlers: Array<ModeHandler>, options?: Record<string, any>);
    _coalesce<T>(callback: (arg0: ModeHandler) => T, resultEval?: (arg0: T) => boolean | null | undefined): T;
    setFeatureCollection(featureCollection: FeatureCollection): void;
    setModeConfig(modeConfig: any): void;
    setSelectedFeatureIndexes(indexes: number[]): void;
    handleClick(event: ClickEvent): EditAction | null | undefined;
    handlePointerMove(event: PointerMoveEvent): {
        editAction: EditAction | null | undefined;
        cancelMapPan: boolean;
    };
    handleStartDragging(event: StartDraggingEvent): EditAction | null | undefined;
    handleStopDragging(event: StopDraggingEvent): EditAction | null | undefined;
    getTentativeFeature(): Feature | null | undefined;
    getEditHandles(picks?: Array<Record<string, any>>, groundCoords?: Position): EditHandle[];
    getCursor({ isDragging }: {
        isDragging: boolean;
    }): string;
}
//# sourceMappingURL=composite-mode-handler.d.ts.map
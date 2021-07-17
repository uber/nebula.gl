import { Position } from '@nebula.gl/edit-modes';
export declare type DeckGLPick = {
    index: number;
    object: any;
    isEditingHandle: boolean | null | undefined;
};
export declare type ClickEvent = {
    picks: DeckGLPick[];
    screenCoords: Position;
    groundCoords: Position;
    sourceEvent: any;
};
export declare type StartDraggingEvent = {
    picks: DeckGLPick[];
    screenCoords: Position;
    groundCoords: Position;
    pointerDownScreenCoords: Position;
    pointerDownGroundCoords: Position;
    sourceEvent: any;
};
export declare type StopDraggingEvent = {
    picks: DeckGLPick[];
    screenCoords: Position;
    groundCoords: Position;
    pointerDownScreenCoords: Position;
    pointerDownGroundCoords: Position;
    sourceEvent: any;
};
export declare type PointerMoveEvent = {
    screenCoords: Position;
    groundCoords: Position;
    picks: DeckGLPick[];
    isDragging: boolean;
    pointerDownPicks: DeckGLPick[] | null | undefined;
    pointerDownScreenCoords: Position | null | undefined;
    pointerDownGroundCoords: Position | null | undefined;
    sourceEvent: any;
};
//# sourceMappingURL=event-types.d.ts.map
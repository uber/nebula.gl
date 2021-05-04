/// <reference types="deck.gl" />
import { CompositeLayer } from '@deck.gl/core';
import { ClickEvent, StartDraggingEvent, StopDraggingEvent, DraggingEvent, PointerMoveEvent } from '@nebula.gl/edit-modes';
export default class EditableLayer extends CompositeLayer<any> {
    static layerName: string;
    onLayerClick(event: ClickEvent): void;
    onStartDragging(event: StartDraggingEvent): void;
    onStopDragging(event: StopDraggingEvent): void;
    onDragging(event: DraggingEvent): void;
    onPointerMove(event: PointerMoveEvent): void;
    onLayerKeyUp(event: KeyboardEvent): void;
    initializeState(): void;
    finalizeState(): void;
    _addEventHandlers(): void;
    _removeEventHandlers(): void;
    _forwardEventToCurrentLayer(event: any): void;
    _onanyclick({ srcEvent }: any): void;
    _onkeyup({ srcEvent }: {
        srcEvent: KeyboardEvent;
    }): void;
    _onpanstart(event: any): void;
    _onpanmove(event: any): void;
    _onpanend({ srcEvent }: any): void;
    _onpointermove(event: any): void;
    getPicks(screenCoords: [number, number]): any;
    getScreenCoords(pointerEvent: any): number[];
    getMapCoords(screenCoords: number[]): any;
}
//# sourceMappingURL=editable-layer.d.ts.map
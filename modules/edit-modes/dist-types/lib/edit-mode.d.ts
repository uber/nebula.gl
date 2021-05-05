import { ClickEvent, PointerMoveEvent, StartDraggingEvent, StopDraggingEvent, DraggingEvent, Tooltip, ModeProps } from '../types';
export interface EditMode<TData, TGuides> {
    handleClick(event: ClickEvent, props: ModeProps<TData>): void;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<TData>): void;
    handleStartDragging(event: StartDraggingEvent, props: ModeProps<TData>): void;
    handleStopDragging(event: StopDraggingEvent, props: ModeProps<TData>): void;
    handleDragging(event: DraggingEvent, props: ModeProps<TData>): void;
    handleKeyUp(event: KeyboardEvent, props: ModeProps<TData>): void;
    getGuides(props: ModeProps<TData>): TGuides | undefined;
    getTooltips(props: ModeProps<TData>): Tooltip[];
}
//# sourceMappingURL=edit-mode.d.ts.map
import { ClickEvent, StartDraggingEvent, StopDraggingEvent, DraggingEvent, ModeProps } from '../types';
import { FeatureCollection } from '../geojson-types';
import { DrawPolygonMode } from './draw-polygon-mode';
declare type DraggingHandler = (event: DraggingEvent, props: ModeProps<FeatureCollection>) => void;
export declare class DrawPolygonByDraggingMode extends DrawPolygonMode {
    handleDraggingThrottled: DraggingHandler | null | undefined;
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleDraggingAux(event: DraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void;
}
export {};
//# sourceMappingURL=draw-polygon-by-dragging-mode.d.ts.map
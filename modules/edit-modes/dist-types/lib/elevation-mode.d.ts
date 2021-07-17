import { ModeProps, PointerMoveEvent, StopDraggingEvent } from '../types';
import { Position, FeatureCollection } from '../geojson-types';
import { ModifyMode } from './modify-mode';
export declare class ElevationMode extends ModifyMode {
    makeElevatedEvent(event: PointerMoveEvent | StopDraggingEvent, position: Position, props: ModeProps<FeatureCollection>): Record<string, any>;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void;
    getCursor(event: PointerMoveEvent): string | null | undefined;
    static calculateElevationChangeWithViewport(viewport: any, { pointerDownScreenCoords, screenCoords, }: {
        pointerDownScreenCoords: Position;
        screenCoords: Position;
    }): number;
}
//# sourceMappingURL=elevation-mode.d.ts.map
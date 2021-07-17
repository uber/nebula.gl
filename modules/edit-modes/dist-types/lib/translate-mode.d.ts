import { FeatureCollection, Position } from '../geojson-types';
import { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent, DraggingEvent, ModeProps } from '../types';
import { GeoJsonEditMode, GeoJsonEditAction } from './geojson-edit-mode';
export declare class TranslateMode extends GeoJsonEditMode {
    _geometryBeforeTranslate: FeatureCollection | null | undefined;
    _isTranslatable: boolean;
    handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void;
    updateCursor(props: ModeProps<FeatureCollection>): void;
    getTranslateAction(startDragPoint: Position, currentPoint: Position, editType: string, props: ModeProps<FeatureCollection>): GeoJsonEditAction | null | undefined;
}
//# sourceMappingURL=translate-mode.d.ts.map
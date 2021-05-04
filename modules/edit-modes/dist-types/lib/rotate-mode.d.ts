import { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent, DraggingEvent, ModeProps, EditHandleFeature, GuideFeatureCollection } from '../types';
import { FeatureCollection, Position } from '../geojson-types';
import { GeoJsonEditMode, GeoJsonEditAction } from './geojson-edit-mode';
export declare class RotateMode extends GeoJsonEditMode {
    _selectedEditHandle: EditHandleFeature | null | undefined;
    _geometryBeingRotated: FeatureCollection | null | undefined;
    _isRotating: boolean;
    _isSinglePointGeometrySelected: (geometry: FeatureCollection) => boolean;
    getIsRotating: () => boolean;
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
    handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void;
    updateCursor(props: ModeProps<FeatureCollection>): void;
    getRotateAction(startDragPoint: Position, currentPoint: Position, editType: string, props: ModeProps<FeatureCollection>): GeoJsonEditAction | null | undefined;
}
//# sourceMappingURL=rotate-mode.d.ts.map
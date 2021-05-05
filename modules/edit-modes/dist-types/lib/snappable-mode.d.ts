import { Feature, FeatureCollection } from '../geojson-types';
import { PointerMoveEvent, StartDraggingEvent, StopDraggingEvent, DraggingEvent, ModeProps, Pick, GuideFeatureCollection, EditHandleFeature } from '../types';
import { GeoJsonEditMode } from './geojson-edit-mode';
declare type MovementTypeEvent = PointerMoveEvent | StartDraggingEvent | StopDraggingEvent | DraggingEvent;
export declare class SnappableMode extends GeoJsonEditMode {
    _handler: GeoJsonEditMode;
    constructor(handler: GeoJsonEditMode);
    _getSnappedMouseEvent<T extends MovementTypeEvent>(event: T, snapSource: EditHandleFeature, snapTarget: EditHandleFeature): T;
    _getPickedSnapTarget(picks: Pick[]): EditHandleFeature | null | undefined;
    _getPickedSnapSource(pointerDownPicks: Pick[] | null | undefined): EditHandleFeature | null | undefined;
    _getUpdatedSnapSourceHandle(snapSourceHandle: EditHandleFeature, data: FeatureCollection): EditHandleFeature;
    _getSnapTargets(props: ModeProps<FeatureCollection>): Feature[];
    _getSnapTargetHandles(props: ModeProps<FeatureCollection>): EditHandleFeature[];
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
    _getSnapAwareEvent<T extends MovementTypeEvent>(event: T, props: ModeProps<FeatureCollection>): T;
    handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
}
export {};
//# sourceMappingURL=snappable-mode.d.ts.map
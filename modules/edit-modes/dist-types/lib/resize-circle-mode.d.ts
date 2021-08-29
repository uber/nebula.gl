import { NearestPointType } from '../utils';
import { LineString, Point, FeatureCollection, FeatureOf } from '../geojson-types';
import { ModeProps, PointerMoveEvent, StartDraggingEvent, StopDraggingEvent, DraggingEvent, Viewport, EditHandleFeature, GuideFeatureCollection } from '../types';
import { GeoJsonEditMode } from './geojson-edit-mode';
export declare class ResizeCircleMode extends GeoJsonEditMode {
    _selectedEditHandle: EditHandleFeature | null | undefined;
    _isResizing: boolean;
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
    nearestPointOnLine(line: FeatureOf<LineString>, inPoint: FeatureOf<Point>, viewport: Viewport | null | undefined): NearestPointType;
    handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void;
    getCursor(event: PointerMoveEvent): string | null | undefined;
}
//# sourceMappingURL=resize-circle-mode.d.ts.map
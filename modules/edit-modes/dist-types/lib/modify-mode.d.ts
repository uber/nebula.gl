import { NearestPointType } from '../utils';
import { LineString, Point, FeatureCollection, FeatureOf } from '../geojson-types';
import { ModeProps, ClickEvent, PointerMoveEvent, StartDraggingEvent, StopDraggingEvent, DraggingEvent, Viewport, GuideFeatureCollection } from '../types';
import { GeoJsonEditMode } from './geojson-edit-mode';
export declare class ModifyMode extends GeoJsonEditMode {
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
    nearestPointOnLine(line: FeatureOf<LineString>, inPoint: FeatureOf<Point>, viewport: Viewport | null | undefined): NearestPointType;
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void;
    getCursor(event: PointerMoveEvent): string | null | undefined;
}
//# sourceMappingURL=modify-mode.d.ts.map
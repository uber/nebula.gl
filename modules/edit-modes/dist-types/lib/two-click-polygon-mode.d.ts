import { ClickEvent, StartDraggingEvent, StopDraggingEvent, PointerMoveEvent, ModeProps, GuideFeatureCollection, TentativeFeature } from '../types';
import { Polygon, FeatureCollection, FeatureOf, Position } from '../geojson-types';
import { GeoJsonEditMode } from './geojson-edit-mode';
export declare class TwoClickPolygonMode extends GeoJsonEditMode {
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void;
    checkAndFinishPolygon(props: ModeProps<FeatureCollection>): void;
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
    getTwoClickPolygon(coord1: Position, coord2: Position, modeConfig: any): FeatureOf<Polygon> | null | undefined;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    createTentativeFeature(props: ModeProps<FeatureCollection>): TentativeFeature;
}
//# sourceMappingURL=two-click-polygon-mode.d.ts.map
import { FeatureCollection } from '../geojson-types';
import { ModeProps, ClickEvent, PointerMoveEvent, StartDraggingEvent, StopDraggingEvent, DraggingEvent, GuideFeatureCollection } from '../types';
import { GeoJsonEditMode } from './geojson-edit-mode';
export declare class CompositeMode extends GeoJsonEditMode {
    _modes: Array<GeoJsonEditMode>;
    constructor(modes: Array<GeoJsonEditMode>);
    _coalesce<T>(callback: (arg0: GeoJsonEditMode) => T, resultEval?: (arg0: T) => boolean | null | undefined): T;
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void;
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
}
//# sourceMappingURL=composite-mode.d.ts.map
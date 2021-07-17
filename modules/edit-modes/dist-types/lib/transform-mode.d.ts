import { PointerMoveEvent, ModeProps, StartDraggingEvent } from '../types';
import { FeatureCollection } from '../geojson-types';
import { CompositeMode } from './composite-mode';
export declare class TransformMode extends CompositeMode {
    constructor();
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void;
    getGuides(props: ModeProps<FeatureCollection>): import("../types").GuideFeatureCollection;
}
//# sourceMappingURL=transform-mode.d.ts.map
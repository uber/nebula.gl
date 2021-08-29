import { EditMode, GuideFeatureCollection, Feature, ClickEvent, PointerMoveEvent, StartDraggingEvent, StopDraggingEvent, FeatureCollection, Tooltip, DraggingEvent } from '@nebula.gl/edit-modes';
import { ModeProps } from '../types';
export default class BaseMode implements EditMode<FeatureCollection, GuideFeatureCollection> {
    _tentativeFeature: Feature | null | undefined;
    _editHandles: Feature[] | null | undefined;
    constructor();
    handlePan(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    handleDblClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>): void;
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection | null | undefined;
    getTooltips(props: ModeProps<FeatureCollection>): Tooltip[];
    handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void;
    getTentativeFeature(): Feature;
    getEditHandles(): Feature[];
    setTentativeFeature(feature: Feature): void;
    getEditHandlesFromFeature(feature: Feature, featureIndex: number | null | undefined): any;
    getSelectedFeature(props: ModeProps<FeatureCollection>, featureIndex: number | null | undefined): Feature;
}
//# sourceMappingURL=base-mode.d.ts.map
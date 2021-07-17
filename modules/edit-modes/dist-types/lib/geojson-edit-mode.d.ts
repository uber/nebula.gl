import { EditAction, ClickEvent, PointerMoveEvent, StartDraggingEvent, StopDraggingEvent, DraggingEvent, Pick, Tooltip, ModeProps, GuideFeatureCollection, TentativeFeature } from '../types';
import { FeatureCollection, Feature, Polygon, Geometry, Position } from '../geojson-types';
import { EditMode } from './edit-mode';
export declare type GeoJsonEditAction = EditAction<FeatureCollection>;
export declare type GeoJsonEditModeType = EditMode<FeatureCollection, FeatureCollection>;
export interface GeoJsonEditModeConstructor {
    new (): GeoJsonEditModeType;
}
export declare class GeoJsonEditMode implements EditMode<FeatureCollection, GuideFeatureCollection> {
    _clickSequence: Position[];
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
    getTooltips(props: ModeProps<FeatureCollection>): Tooltip[];
    getSelectedFeature(props: ModeProps<FeatureCollection>): Feature | null | undefined;
    getSelectedGeometry(props: ModeProps<FeatureCollection>): Geometry | null | undefined;
    getSelectedFeaturesAsFeatureCollection(props: ModeProps<FeatureCollection>): FeatureCollection;
    getClickSequence(): Position[];
    addClickSequence({ mapCoords }: ClickEvent): void;
    resetClickSequence(): void;
    getTentativeGuide(props: ModeProps<FeatureCollection>): TentativeFeature | null | undefined;
    isSelectionPicked(picks: Pick[], props: ModeProps<FeatureCollection>): boolean;
    rewindPolygon(feature: Feature): Feature;
    getAddFeatureAction(featureOrGeometry: Geometry | Feature, features: FeatureCollection): GeoJsonEditAction;
    getAddManyFeaturesAction({ features: featuresToAdd }: FeatureCollection, features: FeatureCollection): GeoJsonEditAction;
    getAddFeatureOrBooleanPolygonAction(featureOrGeometry: Polygon | Feature, props: ModeProps<FeatureCollection>): GeoJsonEditAction | null | undefined;
    createTentativeFeature(props: ModeProps<FeatureCollection>): TentativeFeature;
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>): void;
}
export declare function getIntermediatePosition(position1: Position, position2: Position): Position;
//# sourceMappingURL=geojson-edit-mode.d.ts.map
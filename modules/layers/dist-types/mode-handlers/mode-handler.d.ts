import { ImmutableFeatureCollection, FeatureCollection, Feature, Polygon, Geometry, Position } from '@nebula.gl/edit-modes';
import { ClickEvent, PointerMoveEvent, StartDraggingEvent, StopDraggingEvent, DeckGLPick } from '../event-types';
export declare type EditHandleType = 'existing' | 'intermediate' | 'snap';
export declare type EditHandle = {
    position: Position;
    positionIndexes: number[];
    featureIndex: number;
    type: EditHandleType;
};
export declare type EditAction = {
    updatedData: FeatureCollection;
    editType: string;
    featureIndexes: number[];
    editContext: any;
};
export declare class ModeHandler {
    featureCollection: ImmutableFeatureCollection;
    _tentativeFeature: Feature | null | undefined;
    _modeConfig: any;
    _selectedFeatureIndexes: number[];
    _clickSequence: Position[];
    constructor(featureCollection?: FeatureCollection);
    getFeatureCollection(): FeatureCollection;
    getImmutableFeatureCollection(): ImmutableFeatureCollection;
    getSelectedFeature(): Feature | null | undefined;
    getSelectedGeometry(): Geometry | null | undefined;
    getSelectedFeaturesAsFeatureCollection(): FeatureCollection;
    setFeatureCollection(featureCollection: FeatureCollection): void;
    getModeConfig(): any;
    setModeConfig(modeConfig: any): void;
    getSelectedFeatureIndexes(): number[];
    setSelectedFeatureIndexes(indexes: number[]): void;
    getClickSequence(): Position[];
    resetClickSequence(): void;
    getTentativeFeature(): Feature | null | undefined;
    _setTentativeFeature(tentativeFeature: Feature | null | undefined): void;
    /**
     * Returns a flat array of positions for the given feature along with their indexes into the feature's geometry's coordinates.
     *
     * @param featureIndex The index of the feature to get edit handles
     */
    getEditHandles(picks?: Array<Record<string, any>>, groundCoords?: Position): EditHandle[];
    getCursor({ isDragging }: {
        isDragging: boolean;
    }): string;
    isSelectionPicked(picks: DeckGLPick[]): boolean;
    getAddFeatureAction(geometry: Geometry): EditAction;
    getAddManyFeaturesAction(featureCollection: FeatureCollection): EditAction;
    getAddFeatureOrBooleanPolygonAction(geometry: Polygon): EditAction | null | undefined;
    handleClick(event: ClickEvent): EditAction | null | undefined;
    handlePointerMove(event: PointerMoveEvent): {
        editAction: EditAction | null | undefined;
        cancelMapPan: boolean;
    };
    handleStartDragging(event: StartDraggingEvent): EditAction | null | undefined;
    handleStopDragging(event: StopDraggingEvent): EditAction | null | undefined;
}
export declare function getPickedEditHandle(picks: any[] | null | undefined): EditHandle | null | undefined;
export declare function getIntermediatePosition(position1: Position, position2: Position): Position;
export declare function getEditHandlesForGeometry(geometry: Geometry, featureIndex: number, editHandleType?: EditHandleType): EditHandle[];
//# sourceMappingURL=mode-handler.d.ts.map
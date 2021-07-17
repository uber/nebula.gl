import { FeatureCollection, Position } from '../geojson-types';
import { ModeProps, PointerMoveEvent, StartDraggingEvent, StopDraggingEvent, DraggingEvent, EditHandleFeature, GuideFeatureCollection } from '../types';
import { GeoJsonEditMode } from './geojson-edit-mode';
export declare class ScaleMode extends GeoJsonEditMode {
    _geometryBeingScaled: FeatureCollection | null | undefined;
    _selectedEditHandle: EditHandleFeature | null | undefined;
    _cornerGuidePoints: Array<EditHandleFeature>;
    _cursor: string | null | undefined;
    _isScaling: boolean;
    _isSinglePointGeometrySelected: (geometry: FeatureCollection) => boolean;
    _getOppositeScaleHandle: (selectedHandle: import("../geojson-types").FeatureWithProps<import("../geojson-types").Point, {
        guideType: "editHandle";
        editHandleType: import("../types").EditHandleType;
        featureIndex: number;
        positionIndexes?: number[];
        shape?: string;
    }>) => import("../geojson-types").FeatureWithProps<import("../geojson-types").Point, {
        guideType: "editHandle";
        editHandleType: import("../types").EditHandleType;
        featureIndex: number;
        positionIndexes?: number[];
        shape?: string;
    }>;
    _getUpdatedData: (props: ModeProps<FeatureCollection>, editedData: FeatureCollection) => FeatureCollection;
    isEditHandleSelected: () => boolean;
    getScaleAction: (startDragPoint: Position, currentPoint: Position, editType: string, props: ModeProps<FeatureCollection>) => {
        updatedData: FeatureCollection;
        editType: string;
        editContext: {
            featureIndexes: number[];
        };
    };
    updateCursor: (props: ModeProps<FeatureCollection>) => void;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void;
    handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void;
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
}
//# sourceMappingURL=scale-mode.d.ts.map
import type { Feature, FeatureCollection, ClickEvent, StopDraggingEvent, PointerMoveEvent, Position } from '@nebula.gl/edit-modes';
import { ModeProps } from '../types';
import { GEOJSON_TYPE, GUIDE_TYPE } from '../constants';
import BaseMode from './base-mode';
export default class EditingMode extends BaseMode {
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void;
    _handleDragging(event: PointerMoveEvent | StopDraggingEvent, props: ModeProps<FeatureCollection>): void;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    _updateFeature(props: ModeProps<FeatureCollection>, type: string, options?: any): FeatureCollection;
    _getPointOnSegment(feature: Feature, picked: any, pickedMapCoords: Position): number[];
    _getCursorEditHandle(event: PointerMoveEvent, feature: Feature): {
        type: string;
        properties: {
            guideType: GUIDE_TYPE;
            shape: any;
            positionIndexes: number[];
            editHandleType: string;
        };
        geometry: {
            type: GEOJSON_TYPE;
            coordinates: number[];
        };
    };
    getGuides(props: ModeProps<FeatureCollection>): {
        type: string;
        features: any;
    };
}
//# sourceMappingURL=editing-mode.d.ts.map
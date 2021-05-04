/// <reference types="deck.gl" />
import { GeoJsonLayer, TextLayer } from '@deck.gl/layers';
import { DrawPolygonMode, EditAction, ClickEvent, StartDraggingEvent, StopDraggingEvent, DraggingEvent, PointerMoveEvent, GeoJsonEditModeType, GeoJsonEditModeConstructor, FeatureCollection } from '@nebula.gl/edit-modes';
import EditableLayer from './editable-layer';
declare function getEditHandleColor(handle: any): number[];
declare function getEditHandleOutlineColor(handle: any): number[];
declare function getEditHandleRadius(handle: any): 3 | 5 | 7;
declare type Props = {
    mode: string | GeoJsonEditModeConstructor | GeoJsonEditModeType;
    onEdit: (arg0: EditAction<FeatureCollection>) => void;
    [key: string]: any;
};
export default class EditableGeoJsonLayer extends EditableLayer {
    static layerName: string;
    static defaultProps: {
        mode: typeof DrawPolygonMode;
        onEdit: () => void;
        pickable: boolean;
        pickingRadius: number;
        pickingDepth: number;
        fp64: boolean;
        filled: boolean;
        stroked: boolean;
        lineWidthScale: number;
        lineWidthMinPixels: number;
        lineWidthMaxPixels: number;
        lineWidthUnits: string;
        lineJointRounded: boolean;
        lineMiterLimit: number;
        pointRadiusScale: number;
        pointRadiusMinPixels: number;
        pointRadiusMaxPixels: number;
        getLineColor: (feature: any, isSelected: any, mode: any) => number[];
        getFillColor: (feature: any, isSelected: any, mode: any) => number[];
        getRadius: (f: any) => any;
        getLineWidth: (f: any) => any;
        getTentativeLineColor: (f: any) => number[];
        getTentativeFillColor: (f: any) => number[];
        getTentativeLineWidth: (f: any) => any;
        editHandleType: string;
        editHandlePointRadiusScale: number;
        editHandlePointOutline: boolean;
        editHandlePointStrokeWidth: number;
        editHandlePointRadiusMinPixels: number;
        editHandlePointRadiusMaxPixels: number;
        getEditHandlePointColor: typeof getEditHandleColor;
        getEditHandlePointOutlineColor: typeof getEditHandleOutlineColor;
        getEditHandlePointRadius: typeof getEditHandleRadius;
        editHandleIconAtlas: any;
        editHandleIconMapping: any;
        editHandleIconSizeScale: number;
        getEditHandleIcon: (handle: any) => any;
        getEditHandleIconSize: number;
        getEditHandleIconColor: typeof getEditHandleColor;
        getEditHandleIconAngle: number;
        billboard: boolean;
    };
    renderLayers(): any;
    initializeState(): void;
    shouldUpdateState(opts: any): any;
    updateState({ props, oldProps, changeFlags, }: {
        props: Props;
        oldProps: Props;
        changeFlags: any;
    }): void;
    getModeProps(props: Props): {
        modeConfig: any;
        data: any;
        selectedIndexes: any;
        lastPointerMoveEvent: any;
        cursor: any;
        onEdit: (editAction: EditAction<FeatureCollection>) => void;
        onUpdateCursor: (cursor: string) => void;
    };
    selectionAwareAccessor(accessor: any): any;
    isFeatureSelected(feature: Record<string, any>): any;
    getPickingInfo({ info, sourceLayer }: Record<string, any>): any;
    createGuidesLayers(): GeoJsonLayer<unknown>[];
    createTooltipsLayers(): TextLayer<unknown>[];
    onLayerClick(event: ClickEvent): void;
    onLayerKeyUp(event: KeyboardEvent): void;
    onStartDragging(event: StartDraggingEvent): void;
    onDragging(event: DraggingEvent): void;
    onStopDragging(event: StopDraggingEvent): void;
    onPointerMove(event: PointerMoveEvent): void;
    getCursor({ isDragging }: {
        isDragging: boolean;
    }): any;
    getActiveMode(): GeoJsonEditModeType;
}
export {};
//# sourceMappingURL=editable-geojson-layer.d.ts.map
import { Position, Point, Geometry, FeatureWithProps } from './geojson-types';
export declare type ScreenCoordinates = [number, number];
export declare type EditAction<TData> = {
    updatedData: TData;
    editType: string;
    editContext: any;
};
export declare type Pick = {
    object: any;
    index: number;
    isGuide: boolean;
};
export declare type Viewport = {
    width: number;
    height: number;
    longitude: number;
    latitude: number;
    zoom: number;
    bearing?: number;
    pitch?: number;
};
export declare type BasePointerEvent = {
    picks: Pick[];
    screenCoords: ScreenCoordinates;
    mapCoords: Position;
    sourceEvent: any;
};
export declare type ClickEvent = BasePointerEvent;
export declare type StartDraggingEvent = BasePointerEvent & {
    pointerDownPicks?: Pick[] | null | undefined;
    pointerDownScreenCoords: ScreenCoordinates;
    pointerDownMapCoords: Position;
    cancelPan: () => void;
};
export declare type StopDraggingEvent = BasePointerEvent & {
    pointerDownPicks?: Pick[] | null | undefined;
    pointerDownScreenCoords: ScreenCoordinates;
    pointerDownMapCoords: Position;
};
export declare type DraggingEvent = BasePointerEvent & {
    pointerDownPicks?: Pick[] | null | undefined;
    pointerDownScreenCoords: ScreenCoordinates;
    pointerDownMapCoords: Position;
    cancelPan: () => void;
};
export declare type PointerMoveEvent = BasePointerEvent & {
    pointerDownPicks?: Pick[] | null | undefined;
    pointerDownScreenCoords?: ScreenCoordinates | null | undefined;
    pointerDownMapCoords?: Position | null | undefined;
    cancelPan: () => void;
};
export declare type Tooltip = {
    position: Position;
    text: string;
};
export declare type EditHandleType = 'existing' | 'intermediate' | 'snap-source' | 'snap-target' | 'scale' | 'rotate';
export declare type EditHandleFeature = FeatureWithProps<Point, {
    guideType: 'editHandle';
    editHandleType: EditHandleType;
    featureIndex: number;
    positionIndexes?: number[];
    shape?: string;
}>;
export declare type TentativeFeature = FeatureWithProps<Geometry, {
    guideType: 'tentative';
    shape?: string;
}>;
export declare type GuideFeature = EditHandleFeature | TentativeFeature;
export declare type GuideFeatureCollection = {
    type: 'FeatureCollection';
    features: Readonly<GuideFeature>[];
    properties?: {};
};
export declare type ModeProps<TData> = {
    data: TData;
    modeConfig: any;
    selectedIndexes: number[];
    cursor: string | null | undefined;
    lastPointerMoveEvent: PointerMoveEvent;
    onEdit: (editAction: EditAction<TData>) => void;
    onUpdateCursor: (cursor: string | null | undefined) => void;
};
//# sourceMappingURL=types.d.ts.map
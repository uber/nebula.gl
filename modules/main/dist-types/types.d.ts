export declare type LayerMouseEventResult = {
    eventConsumed?: boolean;
    eventSoftConsumed?: boolean;
    mousePointer?: string | null | undefined;
    shouldRedraw?: boolean | string[];
};
export declare type Color = [number, number, number, number];
export declare type Style = {
    dashArray?: number[];
    fillColor?: Color;
    lineColor?: Color;
    lineWidthMeters?: number;
    pointRadiusMeters?: number;
    outlineRadiusMeters?: number;
    outlineColor?: Color;
    mousePriority?: number;
    arrowColor?: Color;
    arrowStyle?: number;
    arrowCount?: number;
    iconNumber?: number;
    text?: string;
    tooltip?: string;
    zLevel?: number;
};
export declare type Viewport = {
    width: number;
    height: number;
    longitude: number;
    latitude: number;
    zoom: number;
    isDragging?: boolean;
    isMoving?: boolean;
    bearing?: number;
    pitch?: number;
};
//# sourceMappingURL=types.d.ts.map
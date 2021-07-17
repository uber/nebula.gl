export declare const SELECTION_TYPE: {
    NONE: any;
    RECTANGLE: string;
    POLYGON: string;
};
export default class DeckDrawer {
    nebula: Record<string, any>;
    usePolygon: boolean;
    validPolygon: boolean;
    landPoints: [number, number][];
    mousePoints: [number, number][];
    constructor(nebula: Record<string, any>);
    _getLayerIds(): any;
    _selectFromPickingInfos(pickingInfos: Record<string, any>[]): void;
    _getBoundingBox(): Record<string, any>;
    _selectRectangleObjects(): void;
    _selectPolygonObjects(): void;
    _getMousePosFromEvent(event: Record<string, any>): [number, number];
    handleEvent(event: Record<string, any>, lngLat: [number, number], selectionType: number): {
        redraw: boolean;
        deactivate: boolean;
    };
    reset(): void;
    _makeStartPointHighlight(center: [number, number]): number[];
    render(): any[];
}
//# sourceMappingURL=deck-drawer.d.ts.map
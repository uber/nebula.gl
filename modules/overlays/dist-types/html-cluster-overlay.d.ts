import HtmlOverlay from './html-overlay';
export default class HtmlClusterOverlay<ObjType> extends HtmlOverlay {
    _superCluster: Record<string, any>;
    _lastObjects: ObjType[] | null | undefined;
    getItems(): Record<string, any>[];
    getClusterObjects(clusterId: number): ObjType[];
    getAllObjects(): ObjType[];
    getObjectCoordinates(obj: ObjType): [number, number];
    getClusterOptions(): Record<string, any> | null | undefined;
    renderObject(coordinates: number[], obj: ObjType): Record<string, any> | null | undefined;
    renderCluster(coordinates: number[], clusterId: number, pointCount: number): Record<string, any> | null | undefined;
}
//# sourceMappingURL=html-cluster-overlay.d.ts.map
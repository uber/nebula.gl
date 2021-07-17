/// <reference types="deck.gl" />
import { CompositeLayer } from '@deck.gl/core';
import { SimpleMeshLayer } from '@deck.gl/mesh-layers';
import Arrow2DGeometry from './arrow-2d-geometry';
export default class PathMarkerLayer extends CompositeLayer<any> {
    static layerName: string;
    static defaultProps: {
        getZLevel: {
            type: string;
            value: number;
        };
    } & {
        MarkerLayer: typeof SimpleMeshLayer;
        markerLayerProps: {
            mesh: Arrow2DGeometry;
        };
        sizeScale: number;
        fp64: boolean;
        hightlightIndex: number;
        highlightPoint: any;
        getPath: (x: any) => any;
        getColor: (x: any) => any;
        getMarkerColor: (x: any) => number[];
        getDirection: (x: any) => any;
        getMarkerPercentages: (object: any, { lineLength }: {
            lineLength: any;
        }) => number[];
    };
    initializeState(): void;
    projectFlat(xyz: any, viewport: any, coordinateSystem: any, coordinateOrigin: any): any;
    updateState({ props, oldProps, changeFlags }: {
        props: any;
        oldProps: any;
        changeFlags: any;
    }): void;
    _recalculateClosestPoint(): void;
    getPickingInfo({ info }: {
        info: any;
    }): any;
    renderLayers(): any[];
}
//# sourceMappingURL=path-marker-layer.d.ts.map
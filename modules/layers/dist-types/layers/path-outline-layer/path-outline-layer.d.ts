/// <reference types="deck.gl" />
import { PathLayer } from '@deck.gl/layers';
export default class PathOutlineLayer extends PathLayer<any> {
    static layerName: string;
    static defaultProps: {
        getZLevel: {
            type: string;
            value: number;
        };
    };
    getShaders(): any;
    initializeState(context: any): void;
    draw({ moduleParameters, parameters, uniforms, context }: {
        moduleParameters?: {};
        parameters: any;
        uniforms: any;
        context: any;
    }): void;
    calculateZLevels(attribute: any): void;
}
//# sourceMappingURL=path-outline-layer.d.ts.map
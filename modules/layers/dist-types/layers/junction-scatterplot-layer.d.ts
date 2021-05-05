/// <reference types="deck.gl" />
import { CompositeLayer } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
export default class JunctionScatterplotLayer extends CompositeLayer<any> {
    static layerName: string;
    static defaultProps: any;
    renderLayers(): ScatterplotLayer<unknown>[];
}
//# sourceMappingURL=junction-scatterplot-layer.d.ts.map
/// <reference types="deck.gl" />
import { CompositeLayer } from '@deck.gl/core';
import { ScatterplotLayer, LineLayer } from '@deck.gl/layers';
export default class ElevatedEditHandleLayer extends CompositeLayer<any> {
    static layerName: string;
    static defaultProps: {};
    renderLayers(): (ScatterplotLayer<unknown> | LineLayer<unknown>)[];
}
//# sourceMappingURL=elevated-edit-handle-layer.d.ts.map
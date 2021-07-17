import NebulaLayer from '../nebula-layer';
import DeckCache from '../deck-renderer/deck-cache';
export default class SegmentsLayer extends NebulaLayer {
    deckCache: DeckCache<any, any>;
    noBlend: boolean;
    highlightColor: [number, number, number, number];
    arrowSize: number;
    rounded: boolean;
    dashed: boolean;
    markerLayerProps: Record<string, any> | null | undefined;
    constructor(config: Record<string, any>);
    getMouseOverSegment(): any;
    _calcMarkerPercentages(nf: Record<string, any>): number[];
    _getHighlightedObjectIndex({ nebula }: Record<string, any>): number;
    render({ nebula }: Record<string, any>): any;
}
//# sourceMappingURL=segments-layer.d.ts.map
import NebulaLayer from '../nebula-layer';
import DeckCache from '../deck-renderer/deck-cache';
export default class JunctionsLayer extends NebulaLayer {
    deckCache: DeckCache<any, any>;
    constructor(config: Record<string, any>);
    render({ nebula }: Record<string, any>): any;
}
//# sourceMappingURL=junctions-layer.d.ts.map
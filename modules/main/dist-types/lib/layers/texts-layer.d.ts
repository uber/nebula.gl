import NebulaLayer from '../nebula-layer';
import DeckCache from '../deck-renderer/deck-cache';
export default class TextsLayer extends NebulaLayer {
    deckCache: DeckCache<any, any>;
    constructor(config: Record<string, any>);
    render({ nebula }: Record<string, any>): any;
}
//# sourceMappingURL=texts-layer.d.ts.map
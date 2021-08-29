export default class DeckCache<TORIG, TCONV> {
    objects: TCONV[];
    originals: TORIG[];
    updateTrigger: number;
    _idToPosition: Map<string, number>;
    _getData: () => TORIG[];
    _convert: (arg0: TORIG) => TCONV;
    constructor(getData: () => TORIG[], convert: (arg0: TORIG) => TCONV);
    updateAllDeckObjects(): void;
    updateDeckObjectsByIds(ids: string[]): void;
    triggerUpdate(): void;
    getDeckObjectById(id: string): TCONV | null | undefined;
    getOriginalById(id: string): TORIG | null | undefined;
}
//# sourceMappingURL=deck-cache.d.ts.map
export default class DeckCache<TORIG, TCONV> {
  objects: TCONV[];
  originals: TORIG[];
  updateTrigger: number;
  _idToPosition: Map<string, number>;
  _getData: () => TORIG[];
  _convert: (arg0: TORIG) => TCONV;

  constructor(getData: () => TORIG[], convert: (arg0: TORIG) => TCONV) {
    this.objects = [];
    this.originals = [];
    this.updateTrigger = 0;

    this._idToPosition = new Map();
    this._getData = getData;
    this._convert = convert;
  }

  updateAllDeckObjects() {
    if (!this._getData || !this._convert) return;

    this.originals.length = 0;
    this.objects.length = 0;
    this._idToPosition.clear();

    this._getData().forEach((d) => {
      this._idToPosition.set((d as any).id, this.objects.length);
      this.originals.push(d);
      this.objects.push(this._convert(d));
    });

    this.triggerUpdate();
  }

  updateDeckObjectsByIds(ids: string[]) {
    if (!this._getData || !this._convert) return;

    ids.forEach((id) => {
      const p = this._idToPosition.get(id);
      if (p !== undefined) {
        this.objects[p] = this._convert(this.originals[p]);
      }
    });

    this.triggerUpdate();
  }

  triggerUpdate() {
    this.updateTrigger++;
  }

  getDeckObjectById(id: string): TCONV | null | undefined {
    const p = this._idToPosition.get(id);
    return p !== undefined ? this.objects[p] : null;
  }

  getOriginalById(id: string): TORIG | null | undefined {
    const p = this._idToPosition.get(id);
    return p !== undefined ? this.originals[p] : null;
  }
}

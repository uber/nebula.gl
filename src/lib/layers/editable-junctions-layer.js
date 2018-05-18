// @flow
import { point } from '@turf/helpers';
import LayerMouseEvent from '../layer-mouse-event';
import JunctionsLayer from './junctions-layer';

export default class EditableJunctionsLayer extends JunctionsLayer {
  _editingId: ?string;

  constructor(config: Object) {
    super(config);
    this.on('mousedown', this._mousedown);
    this.on('mousemove', this._mousemove);
    this.on('mouseup', this._mouseup);
    this.on('mapMouseEvent', this._mapMouseEvent);

    this.usesMapEvents = true;

    this._editingId = null;
  }

  _mousedown = (nebulaMouseEvent: LayerMouseEvent) => {
    if (this._editingId) {
      return;
    }

    let allowStart = true;
    const cancelEdit = () => (allowStart = false);
    this.emit('editStart', nebulaMouseEvent, {
      cancelEdit,
      id: nebulaMouseEvent.data.id,
      original: nebulaMouseEvent.data
    });

    if (allowStart) {
      this._editingId = nebulaMouseEvent.data.id;

      // prevent drag of map
      nebulaMouseEvent.stopPropagation();
    }
  };

  _mousemove = (nebulaMouseEvent: LayerMouseEvent) => {
    if (this._editingId) {
      const feature = this.deckCache.getDeckObjectById(this._editingId);
      if (feature) {
        feature.geoJson = point(nebulaMouseEvent.groundPoint);

        this.emit('editUpdate', nebulaMouseEvent, {
          feature,
          id: this._editingId,
          original: this.deckCache.getOriginalById((this._editingId: any))
        });
        this.deckCache.triggerUpdate();
        nebulaMouseEvent.nebula.forceUpdate();
      }
    }
  };

  _mapMouseEvent = (nebulaMouseEvent: LayerMouseEvent) => {
    if (this._editingId) {
      if (nebulaMouseEvent.nativeEvent.type === 'mousemove') {
        this._mousemove(nebulaMouseEvent);
      } else if (nebulaMouseEvent.nativeEvent.type === 'mouseup') {
        this._mouseup(nebulaMouseEvent);
      }
    }
  };

  _mouseup = (nebulaMouseEvent: LayerMouseEvent) => {
    if (this._editingId) {
      const feature = this.deckCache.getDeckObjectById(this._editingId);
      this.emit('editEnd', nebulaMouseEvent, {
        feature,
        id: this._editingId,
        original: this.deckCache.getOriginalById((this._editingId: any))
      });
      this.deckCache.updateDeckObjectsByIds([(this._editingId: any)]);
      nebulaMouseEvent.nebula.forceUpdate();

      this._editingId = null;
    }
  };
}

// @flow
import { COORDINATE_SYSTEM, TextLayer } from 'deck.gl';

import NebulaLayer from '../nebula-layer';
import { toDeckColor } from '../utils';
import DeckCache from '../deck-renderer/deck-cache';

export default class TextsLayer extends NebulaLayer {
  deckCache: DeckCache<*, *>;

  constructor(config: Object) {
    super(config);
    this.deckCache = new DeckCache(config.getData, data => config.toNebulaFeature(data));
  }

  render({ nebula }: Object) {
    const defaultColor = [0x0, 0x0, 0x0, 0xff];
    const { objects, updateTrigger } = this.deckCache;

    const { zoom } = nebula.props.viewport;

    return new TextLayer({
      id: `texts-${this.id}`,
      data: objects,
      opacity: 1,
      fp64: false,
      pickable: false,

      getText: nf => nf.style.text,
      getPosition: nf => nebula.projector.coordsToLngLatOffset(nf.geoJson.geometry.coordinates),
      getColor: nf => toDeckColor(nf.style.fillColor) || defaultColor,

      // TODO: layer should offer option to scale with zoom
      sizeScale: 1 / Math.pow(2, 20 - zoom),

      coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
      coordinateOrigin: nebula.projector.lngLat,
      updateTriggers: { all: `${updateTrigger}_${nebula.projector.lngLat}` },

      nebulaLayer: this
    });
  }
}

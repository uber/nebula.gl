import { TextLayer } from '@deck.gl/layers';

import NebulaLayer from '../nebula-layer';
import { toDeckColor } from '../utils';
import { PROJECTED_PIXEL_SIZE_MULTIPLIER } from '../constants';
import DeckCache from '../deck-renderer/deck-cache';
import { Color } from '../../types';

export default class TextsLayer extends NebulaLayer {
  deckCache: DeckCache<any, any>;

  constructor(config: Record<string, any>) {
    super(config);
    this.deckCache = new DeckCache(config.getData, (data) => config.toNebulaFeature(data));
  }

  render({ nebula }: Record<string, any>) {
    const defaultColor: Color = [0x0, 0x0, 0x0, 0xff];
    const { objects, updateTrigger } = this.deckCache;

    const { zoom } = nebula.props.viewport;

    return new TextLayer({
      id: `texts-${this.id}`,
      data: objects,
      opacity: 1,
      fp64: false,
      pickable: false,

      getText: (nf: any) => nf.style.text,
      getPosition: (nf: any) => nf.geoJson.geometry.coordinates,
      getColor: (nf: { style: { fillColor: Color } }) =>
        toDeckColor(nf.style.fillColor) || defaultColor,

      // TODO: layer should offer option to scale with zoom
      sizeScale: 1 / Math.pow(2, 20 - zoom),
      getSize: PROJECTED_PIXEL_SIZE_MULTIPLIER,

      updateTriggers: { all: updateTrigger },

      nebulaLayer: this,
    });
  }
}

import { TextLayer } from '@deck.gl/layers';

import NebulaLayer from '../nebula-layer';
import { toDeckColor } from '../utils';
import DeckCache from '../deck-renderer/deck-cache';

export default class TextsLayer extends NebulaLayer {
  deckCache: DeckCache<any, any>;

  constructor(config: Record<string, any>) {
    super(config);
    this.deckCache = new DeckCache(config.getData, (data) => config.toNebulaFeature(data));
  }

  render({ nebula }: Record<string, any>) {
    const defaultColor = [0x0, 0x0, 0x0, 0xff];
    const { objects, updateTrigger } = this.deckCache;

    const { zoom } = nebula.props.viewport;

    return new TextLayer({
      id: `texts-${this.id}`,
      data: objects,
      opacity: 1,
      fp64: false,
      pickable: false,

      getText: (nf) => nf.style.text,
      getPosition: (nf) => nf.geoJson.geometry.coordinates,
      // @ts-ignore
      getColor: (nf) => toDeckColor(nf.style.fillColor) || defaultColor,

      // TODO: layer should offer option to scale with zoom
      sizeScale: 1 / Math.pow(2, 20 - zoom),

      updateTriggers: { all: updateTrigger },

      nebulaLayer: this,
    });
  }
}

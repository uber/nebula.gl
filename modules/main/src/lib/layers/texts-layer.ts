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

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'style' does not exist on type 'unknown'.
      getText: (nf) => nf.style.text,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'geoJson' does not exist on type 'unknown... Remove this comment to see the full error message
      getPosition: (nf) => nf.geoJson.geometry.coordinates,
      // @ts-expect-error ts-migrate(2322) FIXME: Type '(nf: unknown) => number[]' is not assignable... Remove this comment to see the full error message
      getColor: (nf) => toDeckColor(nf.style.fillColor) || defaultColor,

      // TODO: layer should offer option to scale with zoom
      sizeScale: 1 / Math.pow(2, 20 - zoom),

      updateTriggers: { all: updateTrigger },

      nebulaLayer: this,
    });
  }
}

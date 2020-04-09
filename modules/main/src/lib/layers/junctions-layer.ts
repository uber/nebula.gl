import { JunctionScatterplotLayer } from '@nebula.gl/layers';
import NebulaLayer from '../nebula-layer';
import { toDeckColor } from '../utils';
import DeckCache from '../deck-renderer/deck-cache';

export default class JunctionsLayer extends NebulaLayer {
  deckCache: DeckCache<any, any>;

  constructor(config: Record<string, any>) {
    super(config);
    this.deckCache = new DeckCache(config.getData, (data) => config.toNebulaFeature(data));
    this.enablePicking = true;
  }

  render({ nebula }: Record<string, any>) {
    const defaultColor = [0x0, 0x0, 0x0, 0xff];
    const { objects, updateTrigger } = this.deckCache;

    return new JunctionScatterplotLayer({
      id: `junctions-${this.id}`,
      data: objects,
      opacity: 1,
      // @ts-ignore
      fp64: false,
      pickable: true,
      getPosition: (nf) => nf.geoJson.geometry.coordinates,
      getFillColor: (nf) => toDeckColor(nf.style.fillColor) || defaultColor,
      getStrokeColor: (nf) =>
        toDeckColor(nf.style.outlineColor) || toDeckColor(nf.style.fillColor) || defaultColor,
      getRadius: (nf) => nf.style.pointRadiusMeters + nf.style.outlineRadiusMeters || 1,
      getInnerRadius: (nf) => nf.style.pointRadiusMeters || 0.5,
      parameters: {
        depthTest: false,
        blend: false,
      },

      updateTriggers: { all: updateTrigger },

      nebulaLayer: this,
    });
  }
}

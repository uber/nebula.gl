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
    const defaultColor: [number, number, number, number] = [0x0, 0x0, 0x0, 0xff];
    const { objects, updateTrigger } = this.deckCache;

    return new JunctionScatterplotLayer({
      id: `junctions-${this.id}`,
      data: objects,
      opacity: 1,
      pickable: true,
      getPosition: (nf: any) => nf.geoJson.geometry.coordinates,
      getFillColor: (nf: any) => toDeckColor(nf.style.fillColor) || defaultColor,
      getStrokeColor: (nf: any) =>
        toDeckColor(nf.style.outlineColor) || toDeckColor(nf.style.fillColor) || defaultColor,
      getRadius: (nf: any) => nf.style.pointRadiusMeters + nf.style.outlineRadiusMeters || 1,
      getInnerRadius: (nf: any) => nf.style.pointRadiusMeters || 0.5,
      parameters: {
        depthTest: false,
        blend: false,
      },

      updateTriggers: { all: updateTrigger },

      // @ts-ignore
      nebulaLayer: this as NebulaLayer,
    });
  }
}

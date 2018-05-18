// @flow
import { COORDINATE_SYSTEM } from 'deck.gl';

import JunctionScatterplotLayer from '../deck-renderer/junction-scatterplot-layer';
import NebulaLayer from '../nebula-layer';
import { toDeckColor } from '../utils';
import DeckCache from '../deck-renderer/deck-cache';

export default class JunctionsLayer extends NebulaLayer {
  deckCache: DeckCache<*, *>;

  constructor(config: Object) {
    super(config);
    this.deckCache = new DeckCache(config.getData, data => config.toNebulaFeature(data));
    this.enablePicking = true;
  }

  render({ nebula }: Object) {
    const defaultColor = [0x0, 0x0, 0x0, 0xff];
    const { objects, updateTrigger } = this.deckCache;

    return new JunctionScatterplotLayer({
      id: `junctions-${this.id}`,
      data: objects,
      opacity: 1,
      fp64: false,
      pickable: true,
      getPosition: nf => nebula.projector.coordsToLngLatOffset(nf.geoJson.geometry.coordinates),
      getFillColor: nf => toDeckColor(nf.style.fillColor) || defaultColor,
      getStrokeColor: nf =>
        toDeckColor(nf.style.outlineColor) || toDeckColor(nf.style.fillColor) || defaultColor,
      getRadius: nf => nf.style.pointRadiusMeters + nf.style.outlineRadiusMeters || 1,
      getInnerRadius: nf => nf.style.pointRadiusMeters || 0.5,
      parameters: {
        depthTest: false,
        blend: false
      },

      coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
      coordinateOrigin: nebula.projector.lngLat,
      updateTriggers: { all: `${updateTrigger}_${nebula.projector.lngLat}` },

      nebulaLayer: this
    });
  }
}

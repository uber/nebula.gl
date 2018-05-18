// @flow
import { COORDINATE_SYSTEM } from 'deck.gl';
import { PathMarkerLayer } from 'deck.gl-layers';
import { GL } from 'luma.gl';

import { ArrowStyles, DEFAULT_STYLE, MAX_ARROWS } from '../style';
import NebulaLayer from '../nebula-layer';
import { toDeckColor } from '../utils';
import DeckCache from '../deck-renderer/deck-cache';

const NEBULA_TO_DECK_DIRECTIONS = {
  [ArrowStyles.NONE]: { forward: false, backward: false },
  [ArrowStyles.BACKWARD]: { forward: true, backward: false },
  [ArrowStyles.FORWARD]: { forward: false, backward: true },
  [ArrowStyles.BOTH]: { forward: true, backward: true }
};

export default class SegmentsLayer extends NebulaLayer {
  deckCache: DeckCache<*, *>;
  noBlend: boolean;
  highlightColor: number[];
  arrowSize: number;
  rounded: boolean;

  constructor(config: Object) {
    super(config);
    this.deckCache = new DeckCache(config.getData, data => config.toNebulaFeature(data));
    this.enablePicking = true;
    this.enableSelection = true;
    const { noBlend = false, rounded = true } = config;
    Object.assign(this, { noBlend, rounded });
  }

  getMouseOverSegment(): any {
    // TODO: remove references
    return null;
  }

  _calcMarkerPercentages(nf: Object): number[] {
    const { arrowPercentages } = nf.style;
    if (arrowPercentages) {
      return arrowPercentages;
    }

    const arrowStyle = nf.style.arrowStyle || DEFAULT_STYLE.arrowStyle;
    if (arrowStyle === ArrowStyles.NONE) return [];

    const arrowCount = Math.min(nf.style.arrowCount || DEFAULT_STYLE.arrowCount, MAX_ARROWS);
    return [[0.5], [0.33, 0.66], [0.25, 0.5, 0.75]][arrowCount - 1];
  }

  _getHighlightedObjectIndex({ nebula }: Object): number {
    const { deckglMouseOverInfo } = nebula;
    if (deckglMouseOverInfo) {
      const { originalLayer, index } = deckglMouseOverInfo;
      if (originalLayer === this) {
        return index;
      }
    }

    // no object
    return -1;
  }

  render({ nebula }: Object) {
    const defaultColor = [0x0, 0x0, 0x0, 0xff];
    const { objects, updateTrigger } = this.deckCache;

    return new PathMarkerLayer({
      id: `segments-${this.id}`,
      data: objects,
      opacity: 1,
      fp64: false,
      rounded: this.rounded,
      pickable: true,
      sizeScale: this.arrowSize || 6,
      parameters: {
        depthTest: false,
        blend: !this.noBlend,
        blendEquation: GL.MAX
      },
      getPath: nf => nf.geoJson.geometry.coordinates.map(nebula.projector.coordsToLngLatOffset),
      getColor: nf => toDeckColor(nf.style.lineColor, defaultColor),
      getWidth: nf => nf.style.lineWidthMeters || 1,
      getZLevel: nf => nf.style.zLevel * 255,
      getDirection: nf => NEBULA_TO_DECK_DIRECTIONS[nf.style.arrowStyle],
      getMarkerColor: nf => toDeckColor(nf.style.arrowColor, defaultColor),
      getMarkerPercentages: this._calcMarkerPercentages,
      coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
      coordinateOrigin: nebula.projector.lngLat,
      updateTriggers: { all: `${updateTrigger}_${nebula.projector.lngLat}` },

      highlightedObjectIndex: this._getHighlightedObjectIndex({ nebula }),
      highlightColor: toDeckColor(this.highlightColor),

      nebulaLayer: this
    });
  }
}

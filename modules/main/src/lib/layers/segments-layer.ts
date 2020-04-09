import { PathMarkerLayer } from '@nebula.gl/layers';
import { MAX } from '@luma.gl/constants';

import { ArrowStyles, DEFAULT_STYLE, MAX_ARROWS } from '../style';
import NebulaLayer from '../nebula-layer';
import { toDeckColor } from '../utils';
import DeckCache from '../deck-renderer/deck-cache';

const NEBULA_TO_DECK_DIRECTIONS = {
  [ArrowStyles.NONE]: { forward: false, backward: false },
  [ArrowStyles.FORWARD]: { forward: true, backward: false },
  [ArrowStyles.BACKWARD]: { forward: false, backward: true },
  [ArrowStyles.BOTH]: { forward: true, backward: true },
};

export default class SegmentsLayer extends NebulaLayer {
  deckCache: DeckCache<any, any>;
  noBlend: boolean;
  highlightColor: [number, number, number, number];
  arrowSize: number;
  rounded: boolean;
  dashed: boolean;
  markerLayerProps: Record<string, any> | null | undefined;

  constructor(config: Record<string, any>) {
    super(config);
    this.deckCache = new DeckCache(config.getData, (data) => config.toNebulaFeature(data));
    this.enableSelection = true;
    const {
      enablePicking = true,
      noBlend = false,
      rounded = true,
      dashed = false,
      markerLayerProps = null,
    } = config;
    Object.assign(this, { enablePicking, noBlend, rounded, dashed, markerLayerProps });
  }

  getMouseOverSegment(): any {
    // TODO: remove references
    return null;
  }

  _calcMarkerPercentages(nf: Record<string, any>): number[] {
    const { arrowPercentages } = nf.style;
    if (arrowPercentages) {
      return arrowPercentages;
    }

    const arrowStyle = nf.style.arrowStyle || DEFAULT_STYLE.arrowStyle;
    if (arrowStyle === ArrowStyles.NONE) return [];

    const arrowCount = Math.min(nf.style.arrowCount || DEFAULT_STYLE.arrowCount, MAX_ARROWS);
    return [[0.5], [0.33, 0.66], [0.25, 0.5, 0.75]][arrowCount - 1];
  }

  _getHighlightedObjectIndex({ nebula }: Record<string, any>): number {
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

  render({ nebula }: Record<string, any>) {
    const defaultColor = [0x0, 0x0, 0x0, 0xff];
    const { objects, updateTrigger } = this.deckCache;

    return new PathMarkerLayer({
      id: `segments-${this.id}`,
      data: objects,
      opacity: 1,
      // @ts-ignore
      fp64: false,
      rounded: this.rounded,
      pickable: true,
      sizeScale: this.arrowSize || 6,
      parameters: {
        depthTest: false,
        blend: !this.noBlend,
        blendEquation: MAX,
      },
      getPath: (nf: any) => nf.geoJson.geometry.coordinates,
      // @ts-ignore
      getColor: (nf: any) => toDeckColor(nf.style.lineColor, defaultColor),
      getWidth: (nf: any) => nf.style.lineWidthMeters || 1,
      getZLevel: (nf: any) => nf.style.zLevel * 255,
      getDirection: (nf: any) => NEBULA_TO_DECK_DIRECTIONS[nf.style.arrowStyle],
      // @ts-ignore
      getMarkerColor: (nf: any) => toDeckColor(nf.style.arrowColor, defaultColor),
      getMarkerPercentages: this._calcMarkerPercentages,
      updateTriggers: { all: updateTrigger },

      highlightedObjectIndex: this._getHighlightedObjectIndex({ nebula }),
      highlightColor: toDeckColor(this.highlightColor),

      dashJustified: this.dashed,
      getDashArray: this.dashed ? (nf) => nf.style.dashArray : null,
      markerLayerProps:
        this.markerLayerProps ||
        (PathMarkerLayer as Record<string, any>).defaultProps.markerLayerProps,

      nebulaLayer: this,
    });
  }
}

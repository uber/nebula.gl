// @flow
import assert from 'assert';
import { PathLayer, COORDINATE_SYSTEM } from 'deck.gl';
import { lineString } from '@turf/helpers';

import NebulaLayer from '../nebula-layer';
import { toDeckColor } from '../utils';
import DeckCache from '../deck-renderer/deck-cache';
import FunctionCache from '../function-cache';
import { GeoJsonGeometryTypes, expandMultiGeometry } from '../geojson';

export default class LinesLayer extends NebulaLayer {
  deckCache: DeckCache<*, *>;
  supportMultiLine: boolean;
  _expandMultiGeometry: FunctionCache<typeof expandMultiGeometry, number>;

  constructor(config: Object) {
    super(config);
    this.deckCache = new DeckCache(config.getData, data => {
      const nf = config.toNebulaFeature(data);
      nf.original = data;
      return nf;
    });
    this.enablePicking = true;
    this._expandMultiGeometry = new FunctionCache(expandMultiGeometry);
  }

  _splitMultiLines({ objects, nebula, updateTrigger }: Object) {
    const { result, rejected } = this._expandMultiGeometry
      .updateTrigger(updateTrigger)
      .call(
        objects,
        GeoJsonGeometryTypes.LineString,
        GeoJsonGeometryTypes.MultiLineString,
        lineString
      );

    rejected.forEach(nf => {
      nebula.log(`LinesLayer cannot render ${nf.geoJson.geometry.type}`);
    });

    return result;
  }

  render({ nebula }: Object) {
    const defaultColor = [0xff, 0xff, 0xff, 0xff];
    const { objects, updateTrigger } = this.deckCache;

    return new PathLayer({
      id: `lines-${this.id}`,
      data: this.supportMultiLine
        ? this._splitMultiLines({ objects, nebula, updateTrigger })
        : objects,
      opacity: 1,
      fp64: false,
      pickable: true,

      getPath: nf => {
        assert(
          nf.geoJson.geometry.type === 'LineString',
          `LinesLayer cannot render ${nf.geoJson.geometry.type}`
        );

        return nf.geoJson.geometry.coordinates.map(nebula.projector.coordsToLngLatOffset);
      },
      getColor: nf =>
        toDeckColor(nf.style.outlineColor) ||
        toDeckColor(nf.style.lineColor) ||
        toDeckColor(nf.style.fillColor) ||
        defaultColor,
      getWidth: nf => nf.style.lineWidthMeters || 1,

      parameters: {
        depthTest: false
      },

      coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
      coordinateOrigin: nebula.projector.lngLat,
      updateTriggers: { all: `${updateTrigger}_${nebula.projector.lngLat}` },

      nebulaLayer: this
    });
  }
}

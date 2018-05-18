// @flow
import assert from 'assert';
import { PolygonLayer, COORDINATE_SYSTEM } from 'deck.gl';
import { polygon } from '@turf/helpers';
import { GL } from 'luma.gl';

import NebulaLayer from '../nebula-layer';
import { toDeckColor } from '../utils';
import DeckCache from '../deck-renderer/deck-cache';
import FunctionCache from '../function-cache';
import { GeoJsonGeometryTypes, expandMultiGeometry } from '../geojson';

export default class PolygonsLayer extends NebulaLayer {
  deckCache: DeckCache<*, *>;
  supportMultiPolygon: boolean;
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

  _splitMultiPolygons({ objects, nebula, updateTrigger }: Object) {
    const { result, rejected } = this._expandMultiGeometry
      .updateTrigger(updateTrigger)
      .call(objects, GeoJsonGeometryTypes.Polygon, GeoJsonGeometryTypes.MultiPolygon, polygon);

    rejected.forEach(nf => {
      nebula.log(`PolygonsLayer cannot render ${nf.geoJson.geometry.type}`);
    });

    return result;
  }

  render({ nebula }: Object) {
    const defaultColor = [0xff, 0xff, 0xff, 0xff];
    const { objects, updateTrigger } = this.deckCache;

    return new PolygonLayer({
      id: `polygons-${this.id}`,
      data: this.supportMultiPolygon
        ? this._splitMultiPolygons({ objects, nebula, updateTrigger })
        : objects,
      opacity: 1,
      fp64: false,
      pickable: true,

      getPolygon: nf => {
        assert(
          nf.geoJson.geometry.type === 'Polygon',
          `PolygonsLayer cannot render ${nf.geoJson.geometry.type}`
        );

        return nf.geoJson.geometry.coordinates.map(coord =>
          coord.map(nebula.projector.coordsToLngLatOffset)
        );
      },
      getFillColor: nf => toDeckColor(nf.style.fillColor) || defaultColor,
      getLineColor: nf =>
        toDeckColor(nf.style.outlineColor) ||
        toDeckColor(nf.style.lineColor) ||
        toDeckColor(nf.style.fillColor) ||
        defaultColor,
      getLineWidth: nf => nf.style.lineWidthMeters || 1,

      parameters: {
        depthTest: false,
        blend: true,
        blendEquation: GL.MAX
      },

      coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
      coordinateOrigin: nebula.projector.lngLat,
      updateTriggers: { all: `${updateTrigger}_${nebula.projector.lngLat}` },

      nebulaLayer: this
    });
  }
}

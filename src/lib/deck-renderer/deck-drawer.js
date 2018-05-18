// @flow
import { PolygonLayer, COORDINATE_SYSTEM } from 'deck.gl';
import { point, polygon } from '@turf/helpers';
import turfBbox from '@turf/bbox';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfBuffer from '@turf/buffer';
import turfDifference from '@turf/difference';
import turfDistance from '@turf/distance';

const POLYGON_LINE_COLOR = [0, 255, 0, 255];
const POLYGON_FILL_COLOR = [255, 255, 255, 90];
const POLYGON_LINE_WIDTH = 2;
const POLYGON_DASHES = [20, 20];
const POLYGON_THRESHOLD = 0.01;
const EXPANSION_KM = 10;
const LAYER_ID_VIEW = 'DeckDrawerView';
const LAYER_ID_PICK = 'DeckDrawerPick';

export const SELECTION_TYPE = {
  NONE: 0,
  RECTANGLE: 1,
  POLYGON: 2
};

export default class DeckDrawer {
  nebula: Object;
  usePolygon: boolean;
  validPolygon: boolean;
  landPoints: [number, number][];
  mousePoints: [number, number][];

  constructor(nebula: Object) {
    this.nebula = nebula;
    this.usePolygon = false;
    this.landPoints = [];
    this.mousePoints = [];
  }

  _getLayerIds() {
    // TODO: sort by mouse priority
    return this.nebula.deckgl.props.layers
      .filter(l => l && l.props && l.props.nebulaLayer && l.props.nebulaLayer.enableSelection)
      .map(l => l.id);
  }

  _selectFromPickingInfos(pickingInfos: Object[]) {
    const objects = pickingInfos.map(
      ({ layer, index, object }) =>
        object.original || layer.props.nebulaLayer.deckCache.originals[index]
    );
    this.nebula.props.onSelection(objects);
  }

  _getBoundingBox(): Object {
    const { mousePoints } = this;
    const allX = mousePoints.map(mousePoint => mousePoint[0]);
    const allY = mousePoints.map(mousePoint => mousePoint[1]);
    const x = Math.min(...allX);
    const y = Math.min(...allY);
    const maxX = Math.max(...allX);
    const maxY = Math.max(...allY);

    return { x, y, width: maxX - x, height: maxY - y };
  }

  _selectRectangleObjects() {
    if (this.landPoints.length !== 2) return;

    const [x1, y1] = this.mousePoints[0];
    const [x2, y2] = this.mousePoints[1];
    const pickingInfos = this.nebula.deckgl.queryVisibleObjects({
      x: Math.min(x1, x2),
      y: Math.min(y1, y2),
      width: Math.abs(x2 - x1),
      height: Math.abs(y2 - y1),
      layerIds: this._getLayerIds()
    });

    this._selectFromPickingInfos(pickingInfos);
  }

  _selectPolygonObjects() {
    const pickingInfos = this.nebula.deckgl.queryVisibleObjects({
      ...this._getBoundingBox(),
      layerIds: [LAYER_ID_PICK, ...this._getLayerIds()]
    });

    this._selectFromPickingInfos(pickingInfos.filter(item => item.layer.id !== LAYER_ID_PICK));
  }

  _getMousePosFromEvent(event: Object): [number, number] {
    const { offsetX, offsetY } = event;
    return [offsetX, offsetY];
  }

  handleEvent(
    event: Object,
    lngLat: [number, number],
    selectionType: number
  ): { redraw: boolean, deactivate: boolean } {
    // capture all events (mouse-up is needed to prevent us stuck in moving map)
    if (event.type !== 'mouseup') event.stopPropagation();

    this.usePolygon = selectionType === SELECTION_TYPE.POLYGON;

    let redraw = false;
    let deactivate = false;

    const { usePolygon, landPoints, mousePoints } = this;

    if (event.type === 'mousedown') {
      if (usePolygon && landPoints.length) {
        // if landPoints.length is zero we want to insert two points (so we let it run the else)
        // also don't insert if polygon is invalid
        if (this.landPoints.length < 3 || this.validPolygon) {
          landPoints.push(lngLat);
          mousePoints.push(this._getMousePosFromEvent(event));
        }
      } else {
        this.landPoints = [lngLat, lngLat];
        const m = this._getMousePosFromEvent(event);
        this.mousePoints = [m, m];
      }
      redraw = true;
    } else if (event.type === 'mousemove' && landPoints.length) {
      // update last point
      landPoints[landPoints.length - 1] = lngLat;
      mousePoints[mousePoints.length - 1] = this._getMousePosFromEvent(event);
      redraw = true;
    } else if (event.type === 'mouseup') {
      if (usePolygon) {
        // check to see if completed
        // TODO: Maybe double-click to finish?
        if (
          landPoints.length > 4 &&
          turfDistance(landPoints[0], landPoints[landPoints.length - 1]) < POLYGON_THRESHOLD &&
          this.validPolygon
        ) {
          this._selectPolygonObjects();
          this.reset();
          redraw = true;
          deactivate = true;
        }
      } else {
        this._selectRectangleObjects();
        this.reset();
        redraw = true;
        deactivate = true;
      }
    }

    return { redraw, deactivate };
  }

  reset() {
    this.landPoints = [];
    this.mousePoints = [];
  }

  _makeStartPointHighlight(center: [number, number]): number[] {
    const buffer = turfBuffer(point(center), POLYGON_THRESHOLD / 4.0);
    return turfBboxPolygon(turfBbox(buffer)).geometry.coordinates;
  }

  _getPolygon = (o: Object): any => {
    const { coordsToLngLatOffset } = this.nebula.projector;

    if (Array.isArray(o.polygon[0][0])) {
      // complex polygon with holes
      return o.polygon.map(a => a.map(coordsToLngLatOffset));
    }

    // simple polygon
    return o.polygon.map(coordsToLngLatOffset);
  };

  render() {
    const data = [];
    const dataPick = [];

    if (!this.usePolygon && this.landPoints.length === 2) {
      const [x1, y1] = this.landPoints[0];
      const [x2, y2] = this.landPoints[1];
      const selPolygon = [[x1, y1], [x1, y2], [x2, y2], [x2, y1], [x1, y1]];
      data.push({
        polygon: selPolygon,
        lineColor: POLYGON_LINE_COLOR,
        fillColor: POLYGON_FILL_COLOR
      });
    } else if (this.usePolygon && this.landPoints.length) {
      data.push({
        polygon: this.landPoints,
        lineColor: POLYGON_LINE_COLOR,
        fillColor: POLYGON_FILL_COLOR
      });

      // Hack: use a polygon to hide the outside, because queryVisibleObjects()
      // does not support polygons
      if (this.landPoints.length >= 3) {
        const landPointsPoly = polygon([[...this.landPoints, this.landPoints[0]]]);
        const bigBuffer = turfBuffer(point(this.landPoints[0]), EXPANSION_KM);
        let bigPolygon;
        try {
          // turfDifference throws an exception if the polygon
          // intersects with itself
          bigPolygon = turfDifference(bigBuffer, landPointsPoly);
          dataPick.push({
            polygon: bigPolygon.geometry.coordinates,
            fillColor: [0, 0, 0, 1]
          });
          this.validPolygon = true;
        } catch (e) {
          // invalid selection polygon
          this.validPolygon = false;
        }
      }
    }

    if (this.landPoints.length) {
      // highlight start point
      data.push({
        polygon: this._makeStartPointHighlight(this.landPoints[0]),
        lineColor: [0, 0, 0, 0],
        fillColor: POLYGON_LINE_COLOR
      });
    }

    // Hack to make the PolygonLayer() stay active,
    // otherwise it takes 3 seconds (!) to init!
    // TODO: fix this
    data.push({ polygon: [[0, 0]] });
    dataPick.push({ polygon: [[0, 0]] });

    return [
      new PolygonLayer({
        id: LAYER_ID_VIEW,
        data,
        fp64: false,
        opacity: 1.0,
        pickable: false,
        lineWidthMinPixels: POLYGON_LINE_WIDTH,
        lineWidthMaxPixels: POLYGON_LINE_WIDTH,
        lineDashJustified: true,
        getLineDashArray: x => POLYGON_DASHES,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
        coordinateOrigin: this.nebula.projector.lngLat,
        getPolygon: this._getPolygon
      }),
      new PolygonLayer({
        id: LAYER_ID_PICK,
        data: dataPick,
        fp64: false,
        opacity: 1.0,
        stroked: false,
        pickable: true,
        coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
        coordinateOrigin: this.nebula.projector.lngLat,
        getPolygon: this._getPolygon
      })
    ];
  }
}

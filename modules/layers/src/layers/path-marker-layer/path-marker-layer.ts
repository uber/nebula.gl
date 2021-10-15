import { CompositeLayer, COORDINATE_SYSTEM } from '@deck.gl/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { SimpleMeshLayer } from '@deck.gl/mesh-layers';
import PathOutlineLayer from '../path-outline-layer/path-outline-layer';
import Arrow2DGeometry from './arrow-2d-geometry';

import createPathMarkers from './create-path-markers';
import { getClosestPointOnPolyline } from './polyline';

const DISTANCE_FOR_MULTI_ARROWS = 0.1;
const ARROW_HEAD_SIZE = 0.2;
const ARROW_TAIL_WIDTH = 0.05;
// const ARROW_CENTER_ADJUST = -0.8;

const DEFAULT_MARKER_LAYER = SimpleMeshLayer;

const DEFAULT_MARKER_LAYER_PROPS = {
  mesh: new Arrow2DGeometry({ headSize: ARROW_HEAD_SIZE, tailWidth: ARROW_TAIL_WIDTH }),
};

const defaultProps = Object.assign({}, PathOutlineLayer.defaultProps, {
  MarkerLayer: DEFAULT_MARKER_LAYER,
  markerLayerProps: DEFAULT_MARKER_LAYER_PROPS,

  sizeScale: 100,
  fp64: false,

  hightlightIndex: -1,
  highlightPoint: null,

  getPath: (x) => x.path,
  getColor: (x) => x.color,
  getMarkerColor: (x) => [0, 0, 0, 255],
  getDirection: (x) => x.direction,
  getMarkerPercentages: (object, { lineLength }) =>
    lineLength > DISTANCE_FOR_MULTI_ARROWS ? [0.25, 0.5, 0.75] : [0.5],
});

export default class PathMarkerLayer extends CompositeLayer<any> {
  static layerName = 'PathMarkerLayer';
  static defaultProps = defaultProps;

  initializeState() {
    this.state = {
      markers: [],
      mesh: new Arrow2DGeometry({ headSize: ARROW_HEAD_SIZE, tailWidth: ARROW_TAIL_WIDTH }),
      closestPoint: null,
    };
  }
  projectFlat(xyz, viewport, coordinateSystem, coordinateOrigin) {
    if (coordinateSystem === COORDINATE_SYSTEM.METER_OFFSETS) {
      const [dx, dy] = viewport.metersToLngLatDelta(xyz);
      const [x, y] = coordinateOrigin;
      return viewport.projectFlat([x + dx, dy + y]);
    } else if (coordinateSystem === COORDINATE_SYSTEM.LNGLAT_OFFSETS) {
      const [dx, dy] = xyz;
      const [x, y] = coordinateOrigin;
      return viewport.projectFlat([x + dx, dy + y]);
    }

    return viewport.projectFlat(xyz);
  }

  updateState({ props, oldProps, changeFlags }) {
    if (changeFlags.dataChanged || changeFlags.updateTriggersChanged) {
      const {
        data,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'getPath' does not exist on type 'Composi... Remove this comment to see the full error message
        getPath,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'getDirection' does not exist on type 'Co... Remove this comment to see the full error message
        getDirection,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'getMarkerColor' does not exist on type '... Remove this comment to see the full error message
        getMarkerColor,
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'getMarkerPercentages' does not exist on ... Remove this comment to see the full error message
        getMarkerPercentages,
        coordinateSystem,
        coordinateOrigin,
      } = this.props;
      const { viewport } = this.context;
      const projectFlat = (o) => this.projectFlat(o, viewport, coordinateSystem, coordinateOrigin);
      this.state.markers = createPathMarkers({
        data,
        getPath,
        getDirection,
        getColor: getMarkerColor,
        getMarkerPercentages,
        projectFlat,
      });
      this._recalculateClosestPoint();
    }
    if (changeFlags.propsChanged) {
      if (props.point !== oldProps.point) {
        this._recalculateClosestPoint();
      }
    }
  }

  _recalculateClosestPoint() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'highlightPoint' does not exist on type '... Remove this comment to see the full error message
    const { highlightPoint, highlightIndex } = this.props;
    if (highlightPoint && highlightIndex >= 0) {
      const object = this.props.data[highlightIndex];
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'getPath' does not exist on type 'Composi... Remove this comment to see the full error message
      const points = this.props.getPath(object);
      const { point } = getClosestPointOnPolyline({ points, p: highlightPoint });
      this.state.closestPoints = [
        {
          position: point,
        },
      ];
    } else {
      this.state.closestPoints = [];
    }
  }

  getPickingInfo({ info }) {
    return Object.assign(info, {
      // override object with picked feature
      object: (info.object && info.object.path) || info.object,
    });
  }

  renderLayers() {
    return [
      new PathOutlineLayer(
        this.props,
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 2.
        this.getSubLayerProps({
          id: 'paths',
          // Note: data has to be passed explicitly like this to avoid being empty
          data: this.props.data,
        })
      ),
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'MarkerLayer' does not exist on type 'Com... Remove this comment to see the full error message
      new this.props.MarkerLayer(
        this.getSubLayerProps(
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'markerLayerProps' does not exist on type... Remove this comment to see the full error message
          Object.assign({}, this.props.markerLayerProps, {
            id: 'markers',
            data: this.state.markers,
            getOrientation: (x) => [0, -x.angle, 0],
            getColor: (x) => x.color,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'sizeScale' does not exist on type 'Compo... Remove this comment to see the full error message
            sizeScale: this.props.sizeScale,
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'fp64' does not exist on type 'CompositeL... Remove this comment to see the full error message
            fp64: this.props.fp64,
            pickable: false,
            parameters: {
              blend: false,
              depthTest: false,
            },
          })
        )
      ),
      this.state.closestPoints &&
        new ScatterplotLayer({
          id: `${this.props.id}-highlight`,
          data: this.state.closestPoints,
          // @ts-expect-error ts-migrate(2339) FIXME: Property 'fp64' does not exist on type 'CompositeL... Remove this comment to see the full error message
          fp64: this.props.fp64,
        }),
    ];
  }
}

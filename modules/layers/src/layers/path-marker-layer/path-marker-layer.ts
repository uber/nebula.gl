import { CompositeLayer, COORDINATE_SYSTEM, DefaultProps } from '@deck.gl/core/typed';
import { ScatterplotLayer } from '@deck.gl/layers';
import { SimpleMeshLayer } from '@deck.gl/mesh-layers';
import PathOutlineLayer, { PathOutlineLayerProps } from '../path-outline-layer/path-outline-layer';
import Arrow2DGeometry from './arrow-2d-geometry';

import createPathMarkers from './create-path-markers';
import { getClosestPointOnPolyline } from './polyline';

const DISTANCE_FOR_MULTI_ARROWS = 0.1;
const ARROW_HEAD_SIZE = 0.2;
const ARROW_TAIL_WIDTH = 0.05;
// const ARROW_CENTER_ADJUST = -0.8;

const DEFAULT_MARKER_LAYER = SimpleMeshLayer;

export type PathMarkerLayerProps<DataT> = PathOutlineLayerProps<DataT> & {
  getDirection?: (x) => any;
  getMarkerColor?: (x) => number[];
  getMarkerPercentages?: (x: any, info: any) => number[];
  highlightPoint?: any;
  highlightIndex?: number;
  MarkerLayer?: any;
  markerLayerProps?: any;
  sizeScale?: number;
  fp64?: boolean;
  nebulaLayer?: any;
};

const DEFAULT_MARKER_LAYER_PROPS = {
  mesh: new Arrow2DGeometry({ headSize: ARROW_HEAD_SIZE, tailWidth: ARROW_TAIL_WIDTH }),
};

const defaultProps: DefaultProps<PathMarkerLayerProps<any>> = Object.assign(
  {},
  PathOutlineLayer.defaultProps,
  {
    MarkerLayer: DEFAULT_MARKER_LAYER,
    markerLayerProps: DEFAULT_MARKER_LAYER_PROPS,

    sizeScale: 100,
    fp64: false,

    highlightIndex: -1,
    highlightPoint: null,

    getPath: (x) => x.path,
    getColor: (x) => x.color,
    getMarkerColor: (x) => [0, 0, 0, 255],
    getDirection: (x) => x.direction,
    getMarkerPercentages: (object, { lineLength }) =>
      lineLength > DISTANCE_FOR_MULTI_ARROWS ? [0.25, 0.5, 0.75] : [0.5],
  }
);

export default class PathMarkerLayer<
  DataT = any,
  ExtraPropsT = Record<string, unknown>
> extends CompositeLayer<ExtraPropsT & Required<PathMarkerLayerProps<DataT>>> {
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
        getPath,
        getDirection,
        getMarkerColor,
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
    const { highlightPoint, highlightIndex } = this.props;
    if (highlightPoint && highlightIndex >= 0) {
      const object = this.props.data[highlightIndex];
      const points = this.props.getPath(object, null);
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
        this.getSubLayerProps({
          id: 'paths',
          // Note: data has to be passed explicitly like this to avoid being empty
          data: this.props.data,
        })
      ),
      new this.props.MarkerLayer(
        this.getSubLayerProps(
          Object.assign({}, this.props.markerLayerProps, {
            id: 'markers',
            data: this.state.markers,
            getOrientation: (x) => [0, -x.angle, 0],
            getColor: (x) => x.color,
            sizeScale: this.props.sizeScale,
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
          fp64: this.props.fp64,
        }),
    ];
  }
}

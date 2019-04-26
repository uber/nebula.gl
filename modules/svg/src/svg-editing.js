import React, {createRef, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {MjolnirEvent} from 'mjolnir.js';
import WebMercatorViewport from 'viewport-mercator-project';

import Feature from './feature';
import {DEFAULT_FEATURE_STYLES, getStyle} from './style';
import {MODES, DRAWING_MODES, MODE_TO_GEOJSON_TYPE} from './constants';

const OPERATIONS = {
  SET: 'SET',
  INTERSECT: 'INTERSECT'
};

const STATIC_STYLE = {
  cursor: 'default',
  pointerEvents: 'none'
};

const propTypes = {
  mode: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

const defaultProps = {
  style: DEFAULT_FEATURE_STYLES,
  mode: MODES.READ_ONLY
};

export default class SVGEditing extends PureComponent {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      features: props.features ? props.features.map(f => Feature.fromFeature(f)) : null,
      selectedId: null,
      hoveredId: null,
      draggingVertex: -1,
      startDragPos: {},
      isDragging: false,
      didDrag: false
    };

    this._eventManager = null;
    this._viewport = new WebMercatorViewport(props.viewport);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.mode !== nextProps.mode || this.props.features !== nextProps.features) {
      this.setState({
        features: nextProps.features.map(f => Feature.fromFeature(f))
      });
    }
    if (this.props.mode !== nextProps.mode || this.props.selectedId !== nextProps.selectedId) {
      this.setState({selectedId: nextProps.selectedId});
    }
    if (this.props.viewport !== nextProps.viewport) {
      this._viewport = new WebMercatorViewport(nextProps.viewport);
    }
  }

  componentDidMount() {
    this._setupEvents();
  }

  componentWillUnmount() {
    this._removeEvents();
  }

  _containerRef: {current: null | HTMLDivElement} = createRef();

  /* FEATURE OPERATIONS */
  _update = (features) => {
    this.props.onUpdate(features.map(f => f.toFeature()));
  };

  _addPoint = (x, y, feature, isNew) => {
    const {mode} = this.props;
    const selectedFeature = feature || this._getSelectedFeature();
    const lngLat = this._unproject([x, y]);

    if (selectedFeature) {
      selectedFeature.addPoint([lngLat[0], lngLat[1]]);
    }

    const features = isNew ? [...this.state.features, selectedFeature] : [...this.state.features];
    if (
      mode === MODES.DRAW_POINT ||
      (mode === MODES.DRAW_PATH && selectedFeature.points.length >= 2)
    ) {
      this._update(features);
      this.props.onSelect(selectedFeature.id);

    } else {

      this.setState({
        features,
        selectedId: feature.id
      });
    }
  };

  _closePath = () => {
    const selectedFeature = this._getSelectedFeature();
    selectedFeature.closePath();
    this._update(this.state.features);
    this.setState({selectedId: null});
    this.props.onSelect(null);
  };

  _addFeature = (type, point) => {
    const feature = new Feature({
      id: Date.now(),
      type,
      renderType: type
    });

    this._addPoint(point.x, point.y, feature, true);
  };

  _onHoverFeature = (featureId) => {
    this.setState({hoveredId: featureId});
  };

  _onClickFeature = (evt, feature) => {
    if (
      this.props.mode === MODES.SELECT_FEATURE ||
      this.props.mode === MODES.EDIT_VERTEX
    ) {
      this.props.onSelect(feature.id);
      evt.stopImmediatePropagation();
    }
  };

  _onClickVertex = (evt, index, operation) => {
    if (operation === OPERATIONS.INTERSECT) {
      this._closePath();
    }
    evt.stopImmediatePropagation();
  };

  /* EVENTS */
  _setupEvents() {
    const ref = this._containerRef.current;
    this._eventManager = this.props.eventManager;
    if (!ref || !this._eventManager) {
      return;
    }

    this._events = {
      anyclick: evt => this._onEvent(this._onClick, evt),
      click: evt => evt.stopImmediatePropagation(),
      pointermove: evt => this._onEvent(this._onMouseMove, evt),
      pointerdown: evt => this._onEvent(this._onMouseDown, evt),
      pointerup: evt => this._onEvent(this._onMouseUp, evt),
      pointerover: evt => this._onEvent(this._onMouseOver, evt),
      pointerout: evt => this._onEvent(this._onMouseOut, evt),
      panmove: evt => evt.stopImmediatePropagation(),
      panstart: evt => evt.stopImmediatePropagation(),
      panend: evt =>  evt.stopImmediatePropagation()
    };

    this._eventManager.on(this._events, ref);
  }


  _removeEvents() {
    const eventManager = this._eventManager;
    if (!eventManager || !this._events) {
      return;
    }
    eventManager.off(this._events);
    this._events = null;
  }

  _onEvent = (handler, evt, ...args) => {
    const {mode} = this.props;
    evt.stopImmediatePropagation();
    if (
      mode === MODES.READ_ONLY ||
      (mode === MODES.SELECT_FEATURE && handler !== this._onClickFeature)
    ) {
      return;
    }

    handler(evt, ...args);
  };

  _onMouseUp = (evt: MjolnirEvent) => {

    this.setState({
      isDragging: false,
      didDrag: false
    });
    const {draggingVertex} = this.state;
    if (draggingVertex >= 0) {
      this.setState({
        draggingVertex: -1
      });
      this._update(this.state.features);
    }
  };

  _onMouseDown = (evt: MjolnirEvent) => {
    const elem = evt.target;
    if (elem.className && elem.className.baseVal && elem.className.baseVal.startsWith('vertex')) {
      const [index] = elem.id.split('.');
      const {x, y} = this._getEventPosition(evt);
      this.setState({
        draggingVertex: index,
        startDragPos: {x, y},
        isDragging: true
      });
    }
  };

  _onMouseMove = (evt: MjolnirEvent) => {
    const {x, y} = this._getEventPosition(evt);
    const {startDragPos, isDragging, didDrag, draggingVertex} = this.state;
    if (isDragging && !didDrag) {
      const dx = x - startDragPos.x;
      const dy = y - startDragPos.y;
      if (dx * dx + dy * dy > 5) {
        this.setState({didDrag: true});
      }
    }

    if (isDragging && draggingVertex >= 0) {
      const lngLat = this._unproject([x, y]);
      const selectedFeature = this._getSelectedFeature();

      if (selectedFeature) {
        selectedFeature.replacePoint(draggingVertex, [lngLat[0], lngLat[1]]);
        this._update(this.state.features);
      }
    }
  };

  _onMouseOver = (evt: MjolnirEvent) => {
    const elem = evt.target;
    if (elem.className && elem.className.baseVal && elem.className.baseVal.startsWith('feature')) {
      const feature = this.state.features[elem.id];
      this._onHoverFeature(feature && feature.id);
    }
  };

  _onMouseOut = (evt: MjolnirEvent) => {
    const elem = evt.target;
    if (elem.className && elem.className.baseVal && elem.className.baseVal.startsWith('feature')) {
      this._onHoverFeature(null);
    }
  };

  _onClick = (evt: MjolnirEvent) => {
    const {mode} = this.props;
    const elem = evt.target;

    const isDrawing = DRAWING_MODES.indexOf(mode) !== -1;
    if (!isDrawing && elem.className && elem.className.baseVal && elem.className.baseVal.startsWith('feature')) {
      this._onClickFeature(evt, this.state.features[elem.id]);
      return;
    }

    if (elem.className && elem.className.baseVal && elem.className.baseVal.startsWith('vertex')) {
      const [index, operation] = elem.id.split('.');
      this._onClickVertex(evt, index, operation);
      return;
    }

    const selectedFeature = this._getSelectedFeature();
    const {x, y} = this._getEventPosition(evt);

    switch (mode) {
    case MODES.EDIT_VERTEX:
      if (selectedFeature) {
        this.props.onSelect(null);
      }
      break;

    case MODES.DRAW_POINT:
      this._addFeature(MODE_TO_GEOJSON_TYPE[mode], {x, y});
      break;

    case MODES.DRAW_PATH:
    case MODES.DRAW_POLYGON:
      // only polygon can be closed
      if (selectedFeature && selectedFeature.isClosed) {
        // clicked outside
        this.props.onSelect(null);

      } else if (selectedFeature) {
        this._addPoint(x, y, selectedFeature);

      } else {
        this._addFeature(MODE_TO_GEOJSON_TYPE[mode], {x, y});

      }
      break;

    default:
    }
  };

  /* HELPERS */
  _project = (pt) => {
    return this._viewport.project(pt);
  };

  _unproject = (pt) => {
    return this._viewport.unproject(pt);
  };

  _getEventPosition(evt: MjolnirEvent) {
    const {offsetCenter: {x, y}} = evt;
    return {x, y};
  }

  _getProjectedData({points, type, isClosed}) {
    if (points.length === 0) {
      return '';
    }

    const projected = points.map(p => this._project(p));
    switch (type) {
    case 'Point':
      return projected;
    case 'LineString':
    case 'Polygon':
      const pathString = projected.map(p => {
        return `${p[0]},${p[1]}`;
      }).join('L');
      return `M ${pathString} ${isClosed ? 'z' : ''}`;
    default:
      return null;
    }
  }

  _getSelectedFeature = () => {
    const {features, selectedId} = this.state;
    return features && features.find(f => f.id === selectedId);
  };

  _getStyle = (feature) => {
    const {style} = this.props;
    const {selectedId, hoveredId} = this.state;
    const selected = feature.id === selectedId;
    const hovered = feature.id === hoveredId;
    return getStyle(style, feature, {selected, hovered});
  };

  /* RENDER */
  _renderVertex(coords, index, operation, style) {
    const p = this._project(coords);
    const {radius, ...others} = style;
    // second <circle> is to make path easily interacted with
    return (
      <g key={index} transform={`translate(${p[0]}, ${p[1]})`}>
        <circle
          id={`${index}.${operation}`}
          key={index}
          className="vertex"
          style={{...others}}
          cx={0}
          cy={0}
          r={radius}
        />
        <circle
          id={`${index}.${operation}`}
          key={`${index} hidden`}
          className="vertex hidden"
          style={{...others, fill: '#000', fillOpacity: 0}}
          cx={0}
          cy={0}
          r={radius}
        />
      </g>
    );
  }

  _renderCurrent() {
    const {mode} = this.props;
    const feature = this._getSelectedFeature();
    const {points, isClosed} = feature;
    const style = this._getStyle(feature);

    return (
      <g style={(mode === MODES.READ_ONLY || mode === MODES.SELECT_FEATURE) ? STATIC_STYLE : null}>
        {points.length > 1 && <path style={style} d={this._getProjectedData(feature)}/>}
        <g>{
          points.map((p, i) => {
            let operation = OPERATIONS.SET;
            if (isClosed) {
              return (
                this._renderVertex(p, i, operation, style)
              );
            }

            if (mode === MODES.DRAW_POLYGON && i === 0 && points.length > 2) {
              operation = OPERATIONS.INTERSECT;
            }

            return (
              this._renderVertex(p, i, operation, style)
            );
          })}
        </g>
      </g>
    );
  }

  _renderFeature = (feature, index) => {
    if (feature === this._getSelectedFeature()) {
      return null;
    }

    const {type} = feature;
    const style = this._getStyle(feature);

    const {radius, ...others} = style;
    const points = this._getProjectedData(feature);

    switch (type) {
    case 'Point':
      return (
        <g key={index} transform={`translate(${points[0][0]}, ${points[0][1]})`}>
          <circle
            className="feature point"
            key={index}
            id={index}
            style={others}
            cx={0}
            cy={0}
            r={radius}
          />
          <circle
            className="feature point hidden"
            key={`${index} hidden`}
            id={index}
            style={others}
            cx={0}
            cy={0}
            r={radius}
          />
        </g>
      );

    // second <path> is to make path easily interacted with
    case 'LineString':
      return (
        <g className="feature line-string" key={index}>
          <path
            className="feature line-string"
            key={index}
            id={index}
            style={style}
            d={this._getProjectedData(feature)}
          />
          <path
            className="feature line-string hidden"
            key={`${index}-hidden`}
            id={index}
            style={{
              ...style,
              strokeWidth: 10,
              opacity: 0
            }}
            d={this._getProjectedData(feature)}
          />
        </g>
      );

    case 'Polygon':
      return (
        <path
          className="feature polygon"
          key={index}
          id={index}
          style={style}
          d={this._getProjectedData(feature)}
        />
      );

    default:
      return null;
    }
  };

  _renderFeatures() {
    const {features} = this.state;
    return features.map(this._renderFeature);
  }

  _renderCanvas() {
    const {selectedId} = this.state;

    return (
      <svg className="draw-canvas" key="draw-canvas" width="100%" height="100%">
        <g className="feature-group" key="feature-group">
          {this._renderFeatures()}
        </g>
        {selectedId && this._renderCurrent()}
      </svg>
    );
  }

  render() {
    const {mode, viewport: {width, height}} = this.props;

    if (width <= 0 || height <= 0) {
      return null;
    }

    return (
      <div
        className="svg-editing"
        id="svg-editing"
        style={{
          ...(mode === MODES.READ_ONLY ? STATIC_STYLE : null),
          width,
          height
        }}
        ref={this._containerRef}
        // eslint-disable-next-line no-return-assign
      >
        {this._renderCanvas()}
      </div>
    );
  }
}

export {MODES};

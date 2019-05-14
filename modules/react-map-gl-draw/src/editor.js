// @flow
import React, { PureComponent } from 'react';
import EventManager, { MjolnirEvent } from 'mjolnir.js';
import type { Position, Feature as GeoJson } from '@nebula.gl/edit-modes';
import uuid from 'uuid';
import WebMercatorViewport from 'viewport-mercator-project';

import Feature from './feature';
import type { Id, ScreenCoordinates } from './types';
import type { StyleSheetProps } from './style';
import { DEFAULT_FEATURE_STYLES, getStyle } from './style';
import { MODES, DRAWING_MODES, MODE_TO_GEOJSON_TYPE, MODE_TO_RENDER_TYPE } from './constants';

const OPERATIONS = {
  SET: 'SET',
  INTERSECT: 'INTERSECT'
};

type Operation = 'SET' | 'INTERSECT';

const STATIC_STYLE = {
  cursor: 'default',
  pointerEvents: 'none'
};

type EditorProps = {
  features: ?Array<GeoJson>,
  selectedId: ?Id,
  mode: string,
  style: ?StyleSheetProps,
  eventManager: EventManager,
  viewport: any,
  onSelect: Function,
  onUpdate: Function
};

type EditorState = {
  features: ?Array<Feature>,
  selectedId: ?Id,
  hoveredId: ?Id,
  draggingVertex: ?number,
  startDragPos: ?ScreenCoordinates,
  isDragging: ?boolean,
  didDrag: ?boolean,
  viewport: WebMercatorViewport
};

const defaultProps = {
  mode: MODES.READ_ONLY,
  style: DEFAULT_FEATURE_STYLES,
  onSelect: () => {}
};

export default class Editor extends PureComponent<EditorProps, EditorState> {
  static defaultProps = defaultProps;

  constructor(props: EditorProps) {
    super(props);
    this.state = {
      features: props.features
        ? props.features.map(f => Feature.fromFeature(f)).filter(Boolean)
        : null,
      selectedId: null,
      hoveredId: null,
      draggingVertex: -1,
      startDragPos: null,
      isDragging: false,
      didDrag: false,
      viewport: new WebMercatorViewport(props.viewport)
    };

    this._containerRef = null;
    this._events = {};
  }

  componentDidMount() {
    this._setupEvents();
  }

  componentWillReceiveProps(nextProps: EditorProps) {
    if (this.props.mode !== nextProps.mode || this.props.features !== nextProps.features) {
      this.setState({
        features:
          nextProps.features && nextProps.features.map(f => Feature.fromFeature(f)).filter(Boolean)
      });
    }
    if (this.props.mode !== nextProps.mode || this.props.selectedId !== nextProps.selectedId) {
      this.setState({ selectedId: nextProps.selectedId });
    }
    if (this.props.viewport !== nextProps.viewport) {
      this.setState({ viewport: new WebMercatorViewport(nextProps.viewport) });
    }
  }

  componentWillUnmount() {
    this._removeEvents();
  }

  _containerRef: HTMLDivElement | null;
  _events: any;

  /* FEATURE OPERATIONS */
  _update = (features: ?Array<Feature>) => {
    if (features) {
      this.props.onUpdate(features.map(f => f.toFeature()));
    }
  };

  _addPoint = (x: number, y: number, feature: ?Feature, isNew: boolean = false) => {
    const { mode } = this.props;
    feature = feature || this._getSelectedFeature();
    const lngLat = this._unproject([x, y]) || [];

    if (feature) {
      feature.addPoint([lngLat[0], lngLat[1]]);

      const features = [...(this.state.features || [])];
      if (isNew) {
        features.push(feature);
      }

      const validPath = feature.points && feature.points.length >= 2;

      if (mode === MODES.DRAW_POINT || (mode === MODES.DRAW_PATH && validPath)) {
        this._update(features);
        this.props.onSelect(feature && feature.id);
      } else {
        this.setState({
          features,
          selectedId: feature && feature.id
        });
      }
    }
  };

  _closePath = () => {
    const selectedFeature: ?Feature = this._getSelectedFeature();
    if (selectedFeature) {
      selectedFeature.closePath();
      this._update(this.state.features);
      this.setState({ selectedId: null });
      this.props.onSelect(null);
    }
  };

  _addFeature = (mode: string, point: ScreenCoordinates) => {
    const type = MODE_TO_GEOJSON_TYPE[mode];
    const renderType = MODE_TO_RENDER_TYPE[mode];

    const feature = new Feature({
      id: uuid(),
      type,
      renderType
    });

    this._addPoint(point.x, point.y, feature, true);

    if (mode === MODES.DRAW_RECTANGLE) {
      for (let i = 0; i < 3; i++) {
        this._addPoint(point.x, point.y, feature, false);
      }
    }
  };

  _onHoverFeature = (featureId: ?Id) => {
    this.setState({ hoveredId: featureId });
  };

  _onClickFeature = (evt: MjolnirEvent, feature: Feature) => {
    if (this.props.mode === MODES.SELECT_FEATURE || this.props.mode === MODES.EDIT_VERTEX) {
      this.props.onSelect(feature.id);
      evt.stopImmediatePropagation();
    }
  };

  _onClickVertex = (evt: MjolnirEvent, index: number, operation: Operation) => {
    if (operation === OPERATIONS.INTERSECT) {
      this._closePath();
    }
    evt.stopImmediatePropagation();
  };

  /* EVENTS */
  _setupEvents() {
    const ref = this._containerRef;
    const { eventManager } = this.props;

    if (!ref || !eventManager) {
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
      panend: evt => evt.stopImmediatePropagation()
    };

    eventManager.on(this._events, ref);
  }

  _removeEvents() {
    const { eventManager } = this.props;
    if (!eventManager || !this._events) {
      return;
    }
    eventManager.off(this._events);
    this._events = null;
  }

  _onEvent = (handler: Function, evt: MjolnirEvent, ...args: any) => {
    const { mode } = this.props;
    evt.stopImmediatePropagation();
    if (mode === MODES.READ_ONLY) {
      return;
    }

    handler(evt, ...args);
  };

  _onMouseUp = (evt: MjolnirEvent) => {
    this.setState({
      isDragging: false,
      didDrag: false
    });
    const { draggingVertex } = this.state;
    if (Number(draggingVertex) >= 0) {
      this.setState({
        draggingVertex: -1
      });
      this._update(this.state.features);
    }
  };

  _onMouseDown = (evt: MjolnirEvent) => {
    const elem = evt.target;
    const elemClass = elem.className && elem.className.baseVal && elem.className.baseVal;
    if (elemClass && elemClass.startsWith('vertex')) {
      const [index] = elem.id.split('.');
      const { x, y } = this._getEventPosition(evt);
      this.setState({
        draggingVertex: Number(index),
        startDragPos: { x, y },
        isDragging: true
      });
    }
  };

  _updateFeature = (feature: any, vertex: number, lngLat: Position) => {
    if (feature.renderType === 'Rectangle') {
      /*
      *       p0.x, p0.y   -----  mouse.x, p0.y
      *           |                     |
      *           |                     |
      *       p0.x, mouse.y ----- mouse.x, mouse.y
      */
      const diagonal = (vertex + 2) % 4;
      const p0 = feature.points[diagonal];
      feature.replacePoint((diagonal + 1) % 4, [lngLat[0], p0[1]]);
      feature.replacePoint((diagonal + 3) % 4, [p0[0], lngLat[1]]);
    }

    feature.replacePoint(vertex, [lngLat[0], lngLat[1]]);
    this._update(this.state.features);
  };

  _onMouseMove = (evt: MjolnirEvent) => {
    const { x, y } = this._getEventPosition(evt);
    const { startDragPos, isDragging, didDrag } = this.state;
    if (isDragging && !didDrag && startDragPos) {
      const dx = x - startDragPos.x;
      const dy = y - startDragPos.y;
      if (dx * dx + dy * dy > 5) {
        this.setState({ didDrag: true });
      }
    }

    const selectedFeature = this._getSelectedFeature();
    if (selectedFeature) {
      let vertex = Number(this.state.draggingVertex);
      if ((isDragging && vertex >= 0) || this.props.mode === MODES.DRAW_RECTANGLE) {
        const lngLat = this._unproject([x, y]);

        // when drawing rectangle and not dragging
        if (vertex < 0 && this.props.mode === MODES.DRAW_RECTANGLE) {
          vertex = 2;
        }

        this._updateFeature(selectedFeature, vertex, lngLat);
      }
    }
  };

  _onMouseOver = (evt: MjolnirEvent) => {
    const { features } = this.state;
    const elem = evt.target;
    if (elem.className && elem.className.baseVal && elem.className.baseVal.startsWith('feature')) {
      const feature = features && features[elem.id];
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
    const { mode } = this.props;
    const { features } = this.state;
    const elem = evt.target;

    const isDrawing = DRAWING_MODES.indexOf(mode) !== -1;
    if (
      !isDrawing &&
      elem.className &&
      elem.className.baseVal &&
      elem.className.baseVal.startsWith('feature')
    ) {
      const selectedFeature = features && features[elem.id];
      if (selectedFeature) {
        this._onClickFeature(evt, selectedFeature);
      }
      return;
    }

    const elemClass = elem.className && elem.className.baseVal && elem.className.baseVal;
    if (elemClass && elemClass.startsWith('vertex') && mode !== MODES.DRAW_RECTANGLE) {
      const [index, operation] = elem.id.split('.');
      this._onClickVertex(evt, index, operation);
      return;
    }

    const selectedFeature = this._getSelectedFeature();
    const { x, y } = this._getEventPosition(evt);

    switch (mode) {
      case MODES.EDIT_VERTEX:
        if (selectedFeature) {
          this.props.onSelect(null);
        }
        break;

      case MODES.DRAW_POINT:
        this._addFeature(mode, { x, y });
        break;

      case MODES.DRAW_PATH:
      case MODES.DRAW_POLYGON:
        if (selectedFeature && selectedFeature.isClosed) {
          // clicked outside
          this.props.onSelect(null);
        } else if (selectedFeature) {
          this._addPoint(x, y, selectedFeature);
        } else {
          this._addFeature(mode, { x, y });
        }
        break;

      case MODES.DRAW_RECTANGLE:
        if (selectedFeature && selectedFeature.isClosed) {
          // clicked outside
          this.props.onSelect(null);
        } else if (selectedFeature) {
          this._closePath();
        } else {
          this._addFeature(mode, { x, y });
        }

        break;

      default:
    }
  };

  /* HELPERS */
  _project = (pt: Position) => {
    return this.state.viewport && this.state.viewport.project(pt);
  };

  _unproject = (pt: Position) => {
    return this.state.viewport && this.state.viewport.unproject(pt);
  };

  _getEventPosition(evt: MjolnirEvent) {
    const {
      offsetCenter: { x, y }
    } = evt;
    return { x, y };
  }

  _getProjectedData(feature: Feature) {
    const { points, type, isClosed } = feature;
    if (points.length === 0) {
      return '';
    }

    const projected = points.map(p => this._project(p));
    switch (type) {
      case 'Point':
        return projected;
      case 'LineString':
      case 'Polygon':
        const pathString = projected
          .map(p => {
            return `${p[0]},${p[1]}`;
          })
          .join('L');
        return `M ${pathString} ${isClosed ? 'z' : ''}`;
      default:
        return null;
    }
  }

  _getSelectedFeature = (): ?Feature => {
    const { features, selectedId } = this.state;
    return features && features.find(f => f.id === selectedId);
  };

  _getStyle = (feature: Feature) => {
    const { style } = this.props;
    const { selectedId, hoveredId } = this.state;
    const selected = feature.id === selectedId;
    const hovered = feature.id === hoveredId;
    return getStyle(style, feature, { selected, hovered }) || {};
  };

  /* RENDER */
  _renderVertex(position: Position, index: number, operation: Operation, style: any) {
    const p = this._project(position);
    const { radius, ...others } = style;
    // second <circle> is to make path easily interacted with
    return (
      <g key={index} transform={`translate(${p[0]}, ${p[1]})`}>
        <circle
          id={`${index}.${operation}`}
          key={index}
          className="vertex"
          style={{ ...others }}
          cx={0}
          cy={0}
          r={radius}
        />
        <circle
          id={`${index}.${operation}`}
          key={`${index} hidden`}
          className="vertex hidden"
          style={{ ...others, fill: '#000', fillOpacity: 0 }}
          cx={0}
          cy={0}
          r={radius}
        />
      </g>
    );
  }

  _renderCurrent() {
    const feature = this._getSelectedFeature();

    if (!feature) {
      return null;
    }

    const { mode } = this.props;
    const { points, isClosed } = feature;
    const style = this._getStyle(feature);

    return (
      <g style={mode === MODES.READ_ONLY || mode === MODES.SELECT_FEATURE ? STATIC_STYLE : null}>
        {points.length > 1 && <path style={style} d={this._getProjectedData(feature)} />}
        <g>
          {points &&
            points.map((p, i) => {
              let operation = OPERATIONS.SET;
              if (isClosed) {
                return this._renderVertex(p, i, operation, style);
              }

              if (mode === MODES.DRAW_POLYGON && i === 0 && points.length > 2) {
                operation = OPERATIONS.INTERSECT;
              }

              return this._renderVertex(p, i, operation, style);
            })}
        </g>
      </g>
    );
  }

  _renderFeature = (feature: Feature, index: number) => {
    if (feature === this._getSelectedFeature()) {
      return null;
    }

    const { type } = feature;
    const style = this._getStyle(feature);

    const { radius, ...others } = style;
    const points = this._getProjectedData(feature);

    if (!points) {
      return null;
    }

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
    const { features } = this.state;
    return features && features.map(this._renderFeature);
  }

  _renderCanvas() {
    const { selectedId } = this.state;

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
    const {
      mode,
      viewport: { width, height }
    } = this.props;

    if (width <= 0 || height <= 0) {
      return null;
    }

    return (
      <div
        className="editor"
        id="editor"
        style={{
          ...(mode === MODES.READ_ONLY ? STATIC_STYLE : null),
          width,
          height
        }}
        ref={_ => (this._containerRef = _)}
      >
        {this._renderCanvas()}
      </div>
    );
  }
}

// @flow
import React, { PureComponent } from 'react';
import { MjolnirEvent } from 'mjolnir.js';
import type { Position, Feature as GeoJson } from '@nebula.gl/edit-modes';
import { _MapContext as MapContext } from 'react-map-gl';
import uuid from 'uuid';

import Feature from './feature';
import type { Id, ScreenCoordinates, Operation, RenderType } from './types';
import {
  getEditHandleStyle as defaultGetEditHandleStyle,
  getFeatureStyle as defaultGetFeatureStyle
} from './style';

import {
  OPERATIONS,
  MODES,
  DRAWING_MODES,
  MODE_TO_GEOJSON_TYPE,
  MODE_TO_RENDER_TYPE,
  RENDER_STATE,
  RENDER_TYPE,
  STATIC_STYLE
} from './constants';

type EditorProps = {
  features: ?Array<GeoJson>,
  selectedFeatureId: ?Id,
  mode: string,
  clickRadius: ?number,

  onSelect: Function,
  onUpdate: Function,

  getEditHandleStyle: Function,
  getFeatureStyle: Function,
  getFeatureShape: Function | string,
  getEditHandleShape: Function | string
};

type EditorState = {
  features: ?Array<Feature>,
  selectedFeatureId: ?Id,
  uncommittedLngLat: ?Position,

  hoveredFeatureId: ?Id,
  hoveredLngLat: ?Position,
  hoveredVertexIndex: ?Id,
  hoveredSegmentId: ?Id,

  draggingVertexIndex: ?number,
  startDragPos: ?ScreenCoordinates,
  isDragging: ?boolean,
  didDrag: ?boolean
};

const defaultProps = {
  mode: MODES.READ_ONLY,
  clickRadius: 0,
  getEditHandleStyle: defaultGetEditHandleStyle,
  getFeatureStyle: defaultGetFeatureStyle,
  getFeatureShape: 'circle',
  getEditHandleShape: 'circle',
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

      selectedFeatureId: -1,

      hoveredFeatureId: null,
      hoveredLngLat: null,
      hoveredVertexIndex: -1,
      hoveredSegmentId: -1,

      // intermediate mouse position when drawing
      uncommittedLngLat: null,

      draggingVertexIndex: -1,
      startDragPos: null,
      isDragging: false,
      didDrag: false
    };

    this._containerRef = null;
    this._events = {};
    this._context = null;
  }

  componentDidMount() {
    if (this.props.mode && this.props.mode !== MODES.READ_ONLY) {
      this._setupEvents();
    }
  }

  componentWillReceiveProps(nextProps: EditorProps) {
    if (this.props.mode !== nextProps.mode) {
      if (!nextProps.mode || nextProps.mode === MODES.READ_ONLY) {
        this._removeEvents();
      }
      if (!this.props.mode || this.props.mode === MODES.READ_ONLY) {
        this._setupEvents();
      }
    }

    if (this.props.mode !== nextProps.mode || this.props.features !== nextProps.features) {
      this.setState({
        features:
          nextProps.features && nextProps.features.map(f => Feature.fromFeature(f)).filter(Boolean)
      });
    }

    if (
      this.props.mode !== nextProps.mode ||
      this.props.selectedFeatureId !== nextProps.selectedFeatureId
    ) {
      this._clearCache();
      this.setState({
        selectedFeatureId: nextProps.selectedFeatureId
      });
    }
  }

  componentWillUnmount() {
    this._removeEvents();
  }

  _containerRef: ?HTMLDivElement;
  _events: any;
  _context: ?MapContext;

  /* FEATURE OPERATIONS */
  _update = (features: ?Array<Feature>) => {
    if (features) {
      this.props.onUpdate(features.map(f => f.toFeature()));
    }
  };

  _updateRectangle = (feature: Feature, options: any) => {
    const { vertexIndex, lngLat } = options;
    /*
    *   p0.x, p0.y   ----------  diagonal.x, p0.y
    *       |                             |
    *       |                             |
    *   p0.x, diagonal.y ----- diagonal.x, diagonal.y
    */
    const diagonal = vertexIndex;
    const p0 = feature.points[(diagonal + 2) % 4];

    feature.replacePoint(diagonal, [lngLat[0], lngLat[1]]);
    feature.replacePoint((diagonal + 1) % 4, [lngLat[0], p0[1]]);
    feature.replacePoint((diagonal + 3) % 4, [p0[0], lngLat[1]]);

    this._update(this.state.features);
  };

  _updateFeature = (feature: any, mode: string, options: any) => {
    switch (mode) {
      case 'vertex':
        if (feature.renderType === RENDER_TYPE.RECTANGLE) {
          this._updateRectangle(feature, options);
        } else {
          feature.replacePoint(options.vertexIndex, [options.lngLat[0], options.lngLat[1]]);
          this._update(this.state.features);
        }
        break;

      case 'feature':
        const { dx, dy } = options;
        feature.points = feature.points
          .map(lngLat => {
            const pixels = this._project(lngLat);
            if (pixels) {
              pixels[0] += dx;
              pixels[1] += dy;
              return this._unproject(pixels);
            }
            return null;
          })
          .filter(Boolean);

        this._update(this.state.features);
        break;

      case 'Rectangle':
        this._updateRectangle(feature, options);
        break;

      default:
    }
  };

  _addPoint = (x: number, y: number, feature: ?Feature, isNew: boolean = false) => {
    feature = feature || this._getSelectedFeature();

    if (!feature) {
      return;
    }

    const lngLat = this._unproject([x, y]);
    if (!lngLat) {
      return;
    }

    feature.addPoint([lngLat[0], lngLat[1]]);

    const features = this.state.features || [];
    if (isNew) {
      features.push(feature);
    }

    const validPath = feature.points && feature.points.length >= 2;
    const { mode, onSelect } = this.props;

    if (mode === MODES.DRAW_POINT || (mode === MODES.DRAW_PATH && validPath)) {
      this._update(features);
      onSelect({ selectedFeatureId: feature && feature.id });
    } else {
      this.setState({
        features: [...features],
        selectedFeatureId: feature && feature.id
      });
    }
  };

  _clearCache = () => {
    this.setState({
      selectedFeatureId: null,
      uncommittedLngLat: null,

      hoveredFeatureId: null,
      hoveredLngLat: null,
      hoveredVertexIndex: -1,
      hoveredSegmentId: null,

      draggingVertexIndex: -1,
      startDragPos: null,
      isDragging: false,
      didDrag: false
    });
  };

  _closePath = () => {
    const selectedFeature = this._getSelectedFeature();
    if (selectedFeature) {
      selectedFeature.closePath();
      this._update(this.state.features);
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

  /* EVENTS */
  _setupEvents() {
    const ref = this._containerRef;

    if (!ref || !this._context || !this._context.eventManager) {
      return;
    }

    this._events = {
      anyclick: evt => this._onEvent(this._onClick, evt),
      click: evt => evt.stopImmediatePropagation(),
      pointermove: evt => this._onEvent(this._onMouseMove, evt),
      pointerdown: evt => this._onEvent(this._onMouseDown, evt),
      pointerup: evt => this._onEvent(this._onMouseUp, evt),
      panmove: evt => evt.stopImmediatePropagation(),
      panstart: evt => evt.stopImmediatePropagation(),
      panend: evt => evt.stopImmediatePropagation()
    };

    this._context.eventManager.on(this._events, ref);
  }

  _removeEvents() {
    if (!this._context || !this._context.eventManager || !this._events) {
      return;
    }
    this._context.eventManager.off(this._events);
    this._events = null;
  }

  _onEvent = (handler: Function, evt: MjolnirEvent, ...args: any) => {
    const { mode } = this.props;
    if (mode === MODES.READ_ONLY) {
      return;
    }

    handler(evt, ...args);
    evt.stopImmediatePropagation();
  };

  _onMouseUp = (evt: MjolnirEvent) => {
    this.setState({
      isDragging: false,
      didDrag: false
    });
    const { draggingVertexIndex } = this.state;

    if (Number(draggingVertexIndex) >= 0) {
      this.setState({
        draggingVertexIndex: -1
      });
    }
  };

  _onMouseDown = (evt: MjolnirEvent) => {
    const { x, y } = this._getEventPosition(evt);
    const elem = evt.target;

    if (this._isVertex(elem)) {
      // eslint-disable-next-line no-unused-vars
      const [featureIndex, vertexIndex] = elem.id.split('.');
      this.setState({
        draggingVertexIndex: Number(vertexIndex),
        startDragPos: { x, y },
        isDragging: true
      });
    } else if (this._isFeature(elem)) {
      this.setState({
        startDragPos: { x, y },
        isDragging: true
      });
    }
  };

  _onMouseMove = (evt: MjolnirEvent) => {
    const elem = evt.target;
    const { startDragPos, isDragging, didDrag } = this.state;
    const { mode } = this.props;
    const { x, y } = this._getEventPosition(evt);
    const lngLat = this._unproject([x, y]);

    if (isDragging && !didDrag && startDragPos) {
      const dx = x - startDragPos.x;
      const dy = y - startDragPos.y;
      if (dx * dx + dy * dy > 5) {
        this.setState({ didDrag: true });
      }
    }

    const selectedFeature = this._getSelectedFeature();
    const isDrawing = DRAWING_MODES.indexOf(mode) !== -1;
    const isEditing = mode === MODES.EDIT_VERTEX;

    if (selectedFeature) {
      // dragging
      if (didDrag && startDragPos) {
        const vertexIndex = Number(this.state.draggingVertexIndex);

        if (vertexIndex >= 0) {
          // dragging vertex
          this._updateFeature(selectedFeature, 'vertex', { vertexIndex, lngLat });
        } else {
          // dragging feature
          const dx = x - startDragPos.x;
          const dy = y - startDragPos.y;
          this.setState({ startDragPos: { x, y } });

          this._updateFeature(selectedFeature, 'feature', { dx, dy });
        }
      } else if (mode === MODES.DRAW_RECTANGLE) {
        // drawing rectangle
        this._updateFeature(selectedFeature, 'Rectangle', { vertexIndex: 2, lngLat });
      } else if (isDrawing) {
        // drawing other shapes
        this.setState({ uncommittedLngLat: lngLat });
      } else if (isEditing) {
        if (
          (selectedFeature.renderType === RENDER_TYPE.LINE_STRING ||
            selectedFeature.renderType === RENDER_TYPE.POLYGON) &&
          this._isLine(elem)
        ) {
          // eslint-disable-next-line no-unused-vars
          const [featureIndex, segmentId] = elem.id.split('.');
          this.setState({
            hoveredSegmentId: Number(segmentId),
            uncommittedLngLat: lngLat
          });
        } else {
          this.setState({
            hoveredSegmentId: -1,
            uncommittedLngLat: null
          });
        }
      }
    }

    const { features, selectedFeatureId } = this.state;
    if (selectedFeatureId && this._isVertex(elem)) {
      const [featureIndex, vertexIndex] = elem.id.split('.');
      const feature = features && features[featureIndex];
      if (selectedFeatureId === (feature && feature.id)) {
        this.setState({
          hoveredVertexIndex: Number(vertexIndex)
        });
      }
    } else if (!this._isVertex(elem)) {
      this.setState({
        hoveredVertexIndex: null
      });
    }

    if (this._isFeature(elem)) {
      const feature = features && features[elem.id];
      this.setState({
        hoveredFeatureId: feature && feature.id
      });
    } else {
      this.setState({
        hoveredFeatureId: null
      });
    }
  };

  _onClickFeature = (evt: MjolnirEvent, feature: ?Feature) => {
    if (
      feature &&
      (this.props.mode === MODES.SELECT_FEATURE || this.props.mode === MODES.EDIT_VERTEX)
    ) {
      this.props.onSelect({
        selectedFeatureId: feature.id
      });
    }
  };

  _onClickVertex = (evt: MjolnirEvent) => {
    const { mode } = this.props;
    const elem = evt.target;
    // eslint-disable-next-line no-unused-vars
    const [featureIndex, vertexId, operation] = elem.id.split('.');
    if (
      operation === OPERATIONS.INTERSECT ||
      (operation === OPERATIONS.SET && mode === MODES.DRAW_RECTANGLE)
    ) {
      this._closePath();
      this._clearCache();
    }
  };

  _onClickLine = (evt: MjolnirEvent) => {
    const feature = this._getSelectedFeature();
    const elem = evt.target;

    if (
      feature &&
      (feature.renderType === RENDER_TYPE.POLYGON ||
        feature.renderType === RENDER_TYPE.LINE_STRING) &&
      elem
    ) {
      // eslint-disable-next-line no-unused-vars
      const [featureIndex, segmentId] = elem.id.split('.');
      const [index] = segmentId.split('-');

      const { x, y } = this._getEventPosition(evt);
      const lngLat = this._unproject([x, y]);

      if (lngLat) {
        const insertPosition = (Number(index) + 1) % feature.points.length;
        feature.insertPoint(lngLat, insertPosition);
        this._update(this.state.features);
      }

      this.setState({
        hoveredSegmentId: -1,
        hoveredLngLat: null
      });
    }
  };

  _onClick = (evt: MjolnirEvent) => {
    const { mode } = this.props;
    const { features } = this.state;
    const elem = evt.target;

    if (this._isVertex(elem)) {
      this._onClickVertex(evt);
      return;
    }

    if (this._isLine(elem) && mode === MODES.EDIT_VERTEX) {
      this._onClickLine(evt);
      return;
    }

    const isDrawing = DRAWING_MODES.indexOf(mode) !== -1;
    if (!isDrawing && this._isFeature(elem)) {
      const selectedFeature = features && features[elem.id];
      this._onClickFeature(evt, selectedFeature);
      return;
    }

    const selectedFeature = this._getSelectedFeature();
    const { x, y } = this._getEventPosition(evt);

    switch (mode) {
      case MODES.EDIT_VERTEX:
        if (selectedFeature) {
          this.props.onSelect({ selectedFeatureId: null });
        }
        break;

      case MODES.DRAW_POINT:
        this._addFeature(mode, { x, y });
        break;

      case MODES.DRAW_PATH:
      case MODES.DRAW_POLYGON:
        if (selectedFeature && selectedFeature.isClosed) {
          // clicked outside
          this._clearCache();
        } else if (selectedFeature) {
          this._addPoint(x, y, selectedFeature);
        } else {
          this._addFeature(mode, { x, y });
        }
        break;

      case MODES.DRAW_RECTANGLE:
        if (selectedFeature && selectedFeature.isClosed) {
          // clicked outside
          this._clearCache();
          this.props.onSelect({ selectedFeatureId: null });
        } else {
          this._addFeature(mode, { x, y });
        }

        break;

      default:
    }
  };

  /* HELPERS */
  // lngLat to pixels
  _project = (pt: Position) => {
    return this._context && this._context.viewport && this._context.viewport.project(pt);
  };

  // pixels to lngLat
  _unproject = (pt: Position) => {
    return this._context && this._context.viewport && this._context.viewport.unproject(pt);
  };

  _isFeature = (elem: HTMLElement) => {
    const elemClass = elem && elem.getAttribute('class');
    return Boolean(elemClass && elemClass.startsWith('feature'));
  };

  _isVertex = (elem: HTMLElement) => {
    const elemClass = elem && elem.getAttribute('class');
    return Boolean(elemClass && elemClass.startsWith('vertex'));
  };

  _isLine = (elem: HTMLElement) => {
    const elemClass = elem && elem.getAttribute('class');
    return Boolean(elemClass && elemClass.startsWith('segment'));
  };

  _getEventPosition = (evt: MjolnirEvent): { x: number, y: number } => {
    const {
      offsetCenter: { x, y }
    } = evt;
    return { x: Number(x), y: Number(y) };
  };

  _getProjectedData(points: any, renderType: ?RenderType | string, isClosed: ?boolean = false) {
    if (points.length === 0) {
      return '';
    }

    const projected = points.map(p => this._project(p));
    switch (renderType) {
      case RENDER_TYPE.POINT:
        return projected;
      case RENDER_TYPE.LINE_STRING:
      case RENDER_TYPE.POLYGON:
      case RENDER_TYPE.RECTANGLE:
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
    const { features, selectedFeatureId } = this.state;
    return features && features.find(f => f.id === selectedFeatureId);
  };

  _getEditHandleState = (index: number, renderState: ?string) => {
    const { draggingVertexIndex, hoveredVertexIndex } = this.state;
    const selectedFeature = this._getSelectedFeature();
    return renderState
      ? renderState
      : index === draggingVertexIndex ||
        (selectedFeature && selectedFeature.renderType === RENDER_TYPE.POINT)
        ? RENDER_STATE.SELECTED
        : index === hoveredVertexIndex
          ? RENDER_STATE.HOVERED
          : index === -1
            ? RENDER_STATE.UNCOMMITTED
            : RENDER_STATE.INACTIVE;
  };

  _getFeatureRenderState = (id: Id, renderState: ?string) => {
    const { selectedFeatureId, hoveredFeatureId } = this.state;
    return renderState
      ? renderState
      : id === selectedFeatureId
        ? RENDER_STATE.SELECTED
        : id === hoveredFeatureId
          ? RENDER_STATE.HOVERED
          : id === 'uncommitted'
            ? RENDER_STATE.UNCOMMITTED
            : RENDER_STATE.INACTIVE;
  };

  /* RENDER */
  /* eslint-disable max-params */
  _renderVertex = (
    position: Position,
    featureIndex: number,
    vertexId: Id,
    operation: Operation,
    style: any,
    shape: string
  ) => {
    /* eslint-enable max-params */
    const p = this._project(position);
    if (!p) {
      return null;
    }

    const { clickRadius } = this.props;
    // first <circle|rect> is to make path easily interacted with
    switch (shape) {
      case 'circle':
        return (
          <g key={`${vertexId}.vertex`} transform={`translate(${p[0]}, ${p[1]})`}>
            <circle
              id={`${featureIndex}.${vertexId}.${operation}.hidden`}
              key={`${vertexId}.hidden`}
              className="vertex hidden"
              style={{ ...style, stroke: 'none', fill: '#000', fillOpacity: 0 }}
              cx={0}
              cy={0}
              r={clickRadius}
            />
            <circle
              id={`${featureIndex}.${vertexId}.${operation}`}
              key={`${vertexId}`}
              className="vertex"
              style={style}
              cx={0}
              cy={0}
            />
          </g>
        );
      case 'rect':
        return (
          <g key={`${vertexId}.vertex`} transform={`translate(${p[0]}, ${p[1]})`}>
            <rect
              id={`${featureIndex}.${vertexId}.${operation}.hidden`}
              key={`${vertexId}.hidden`}
              className="vertex hidden"
              style={{ ...style, fill: '#000', fillOpacity: 0 }}
              r={clickRadius}
            />
            <rect
              id={`${featureIndex}.${vertexId}.${operation}`}
              key={`${vertexId}`}
              className="vertex"
              style={style}
            />
          </g>
        );

      default:
        return null;
    }
  };

  _renderSegment = (
    featureIndex: number,
    startVertexId: Id,
    startPos: Position,
    endPos: Position,
    style: any = {}
  ) => {
    const projected = this._getProjectedData([startPos, endPos], RENDER_TYPE.LINE_STRING);
    const { clickRadius, radius, ...others } = style;
    return (
      <g id={`${startVertexId}.segment`} key={`segment-group.${startVertexId}`}>
        <path
          id={`${featureIndex}.${startVertexId}`}
          key={`${featureIndex}.${startVertexId}.segment-hidden`}
          className="segment hidden"
          style={{ ...others, stroke: clickRadius || radius || 24, opacity: 0 }}
          d={projected}
        />
        <path
          id={`${featureIndex}.${startVertexId}`}
          key={`${startVertexId}.segment`}
          className="segment"
          style={others}
          d={projected}
        />
      </g>
    );
  };

  _renderCommittedStroke = (featureIndex: number, feature: Feature, style: any) => {
    const { points, isClosed, renderType } = feature;
    if (!points || points.length < 2 || (renderType === RENDER_TYPE.RECTANGLE && !isClosed)) {
      return null;
    }

    const segments = [];
    for (let i = 0; i < points.length - 1; i++) {
      segments.push(this._renderSegment(featureIndex, i, points[i], points[i + 1], style));
    }

    if (isClosed) {
      const lastIndex = points.length - 1;
      segments.push(
        this._renderSegment(featureIndex, lastIndex, points[lastIndex], points[0], style)
      );
    }

    return <g key="committed group">{segments}</g>;
  };

  _renderUncommittedStrokes = (featureIndex: number, feature: Feature, style: any) => {
    const { points, isClosed, renderType } = feature;
    const { mode } = this.props;
    const { uncommittedLngLat } = this.state;
    const isDrawing = DRAWING_MODES.find(m => m === mode);

    if (!points || isClosed || !isDrawing) {
      return null;
    }

    const uncommittedSegments = [];

    if (renderType === RENDER_TYPE.RECTANGLE) {
      for (let i = 0; i < points.length - 1; i++) {
        uncommittedSegments.push(
          this._renderSegment(featureIndex, i, points[i], points[i + 1], style)
        );
      }
      if (points.length === 4) {
        uncommittedSegments.push(this._renderSegment(featureIndex, 3, points[3], points[0], style));
      }
    }

    if (!uncommittedLngLat) {
      return uncommittedSegments.length ? uncommittedSegments : null;
    }

    /* eslint-disable no-inline-comments */
    uncommittedSegments.push(
      this._renderSegment(
        featureIndex,
        points.length - 1, // id
        points.slice(-1)[0], // startPos
        uncommittedLngLat, // endPos
        style
      )
    );
    /* eslint-enable no-inline-comments */

    let uncommittedCloseSegment = null;
    if (mode === MODES.DRAW_POLYGON && points.length > 2) {
      // from uncommitted position to the first point of the polygon
      uncommittedCloseSegment = this._renderSegment(
        featureIndex,
        'uncommitted-close',
        uncommittedLngLat,
        points[0],
        { ...style, strokeDasharray: '4,2' }
      );
    }

    return [...uncommittedSegments, uncommittedCloseSegment].filter(Boolean);
  };

  _renderFill = (index: number, feature: Feature, style: any) => {
    const { mode } = this.props;
    const isDrawing = DRAWING_MODES.find(m => m === mode);
    const { points, renderType, isClosed } = feature;
    if (renderType !== RENDER_TYPE.POLYGON && renderType !== RENDER_TYPE.RECTANGLE) {
      return null;
    }

    const { uncommittedLngLat } = this.state;

    let fillPoints = points;
    if (uncommittedLngLat && isDrawing) {
      fillPoints = [...points, uncommittedLngLat];
    }

    const fillPath = this._getProjectedData(fillPoints, renderType, isClosed);
    return (
      <path
        id={index}
        key="fill"
        className="feature current fill"
        style={{ ...style, stroke: 'none' }}
        d={fillPath}
      />
    );
  };

  _renderCurrentPath = (feature: Feature, index: number) => {
    const { points, renderType } = feature;
    if (!points || !points.length || renderType === RENDER_TYPE.POINT) {
      return null;
    }

    const { getFeatureStyle } = this.props;
    const geoJson = feature.toFeature();
    const committedStyle = getFeatureStyle({ feature: geoJson, state: RENDER_STATE.SELECTED });
    const uncommittedStyle = getFeatureStyle({ feature: geoJson, state: RENDER_STATE.UNCOMMITTED });

    const committedStroke = this._renderCommittedStroke(index, feature, committedStyle);
    const uncommittedStrokes =
      this._renderUncommittedStrokes(index, feature, uncommittedStyle) || [];
    const fill = this._renderFill(index, feature, uncommittedStyle);

    return [fill, ...uncommittedStrokes, committedStroke].filter(Boolean);
  };

  _renderCurrentVertices = (feature: Feature, featureIndex: number) => {
    const { id, points, isClosed } = feature;

    if (!points || !points.length) {
      return null;
    }

    const { mode, getEditHandleStyle, getEditHandleShape } = this.props;
    const { selectedFeatureId, uncommittedLngLat } = this.state;
    const geoJson = feature.toFeature();

    const committedVertices = [];
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      let operation = OPERATIONS.SET;

      const style = getEditHandleStyle({
        feature: geoJson,
        index: i,
        state: this._getEditHandleState(i)
      });
      const shape =
        typeof getEditHandleShape === 'function'
          ? getEditHandleShape({
              feature: geoJson,
              index: i,
              state: this._getEditHandleState(i)
            })
          : getEditHandleShape;

      if (isClosed) {
        committedVertices.push(this._renderVertex(p, featureIndex, i, operation, style, shape));
      } else {
        if (mode === MODES.DRAW_POLYGON && i === 0 && points.length > 2) {
          operation = OPERATIONS.INTERSECT;
        }

        committedVertices.push(this._renderVertex(p, featureIndex, i, operation, style, shape));
      }
    }

    let uncommittedVertex = null;
    if (selectedFeatureId === id && uncommittedLngLat) {
      const style = getEditHandleStyle({
        feature: geoJson,
        index: -1,
        state: this._getEditHandleState(-1)
      });
      const shape =
        typeof getEditHandleShape === 'function'
          ? getEditHandleShape({
              feature: geoJson,
              index: -1,
              state: RENDER_STATE.UNCOMMITTED
            })
          : getEditHandleShape;

      uncommittedVertex = this._renderVertex(
        uncommittedLngLat,
        featureIndex,
        -1,
        OPERATIONS.INSERT,
        { ...style, pointerEvents: 'none' },
        shape
      );
    }

    return (
      <g key="edit-handles">
        {committedVertices}
        {uncommittedVertex}
      </g>
    );
  };

  _renderCurrent = () => {
    const { features } = this.state;
    const feature = this._getSelectedFeature();

    if (!features || !feature || !feature.points) {
      return null;
    }

    const { mode } = this.props;
    const index = features.findIndex(f => f.id === feature.id);

    return (
      <g
        key="feature current"
        style={mode === MODES.READ_ONLY || mode === MODES.SELECT_FEATURE ? STATIC_STYLE : null}
      >
        {this._renderCurrentPath(feature, index)}
        {this._renderCurrentVertices(feature, index)}
      </g>
    );
  };

  _renderFeature = (feature: Feature, index: number) => {
    if (feature === this._getSelectedFeature()) {
      return null;
    }

    const { id, points, renderType, isClosed } = feature;
    if (!points || !points.length) {
      return null;
    }

    const projected = this._getProjectedData(points, renderType, isClosed);

    if (!projected) {
      return null;
    }

    const geoJson = feature.toFeature();
    const renderState = this._getFeatureRenderState(id);
    const { getFeatureStyle, getFeatureShape } = this.props;
    const style = getFeatureStyle({ feature: geoJson, state: renderState });
    const shape =
      typeof getFeatureShape === 'function'
        ? getFeatureShape({ feature: geoJson, state: renderState })
        : getFeatureShape;

    switch (renderType) {
      case RENDER_TYPE.POINT:
        if (shape === 'rect') {
          return (
            <g
              key={`${index}.feature`}
              transform={`translate(${projected[0][0]}, ${projected[0][1]})`}
            >
              <rect
                className="feature point hidden"
                key={`${index}.feature-hidden`}
                id={`${index}`}
                style={{ ...style, fill: '#000', fillOpacity: 0 }}
              />
              <rect
                className="feature point"
                key={`${index}.feature`}
                id={`${index}`}
                style={style}
              />
            </g>
          );
        }

        return (
          <g
            key={`${index}.feature`}
            transform={`translate(${projected[0][0]}, ${projected[0][1]})`}
          >
            <circle
              className="feature point hidden"
              key={`${index}.feature-hidden`}
              id={`${index}`}
              style={{
                ...style,
                opacity: 0
              }}
              cx={0}
              cy={0}
            />
            <circle
              className="feature point"
              key={`${index}.feature`}
              id={`${index}`}
              style={style}
              cx={0}
              cy={0}
            />
          </g>
        );

      // first <path> is to make path easily interacted with
      case RENDER_TYPE.LINE_STRING:
        return (
          <g key={`${index}.feature`} className="feature line-string">
            <path
              className="feature line-string"
              key={`${index}.feature`}
              id={index}
              style={style}
              d={projected}
            />
            <path
              className="feature line-string hidden"
              key={`${index}.feature-hidden`}
              id={index}
              style={{
                ...style,
                strokeWidth: 10,
                opacity: 0
              }}
              d={projected}
            />
          </g>
        );

      case 'Polygon':
      case 'Rectangle':
        return (
          <path
            className="feature polygon"
            key={`${index}.feature`}
            id={`${index}`}
            style={style}
            d={projected}
          />
        );

      default:
        return null;
    }
  };

  _renderFeatures = () => {
    const { features } = this.state;
    return features && features.map(this._renderFeature);
  };

  _renderCanvas = () => {
    const { selectedFeatureId, features } = this.state;

    return (
      <svg className="draw-canvas" key="draw-canvas" width="100%" height="100%">
        {features &&
          features.length > 0 && (
            <g className="feature-group" key="feature-group">
              {this._renderFeatures()}
            </g>
          )}
        {selectedFeatureId && this._renderCurrent()}
      </svg>
    );
  };

  _renderEditor = () => {
    const viewport = (this._context && this._context.viewport) || {};
    const { width, height } = viewport;

    return (
      <div
        className="editor"
        id="editor"
        style={{
          width,
          height
        }}
        ref={_ => {
          this._containerRef = _;
        }}
      >
        {this._renderCanvas()}
      </div>
    );
  };

  render() {
    return (
      <MapContext.Consumer>
        {context => {
          this._context = context;
          const viewport = context && context.viewport;

          if (!viewport || viewport.height <= 0 || viewport.width <= 0) {
            return null;
          }

          return this._renderEditor();
        }}
      </MapContext.Consumer>
    );
  }
}

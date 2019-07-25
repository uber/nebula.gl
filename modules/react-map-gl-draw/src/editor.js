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
  getFeatureStyle as defaultGetFeatureStyle,
  HIDDEN_CLICKABLE_STYLE
} from './style';

import {
  OPERATIONS,
  MODES,
  DRAWING_MODES,
  MODE_TO_GEOJSON_TYPE,
  MODE_TO_RENDER_TYPE,
  RENDER_STATE,
  RENDER_TYPE,
  STATIC_STYLE,
  ELEMENT_TYPE
} from './constants';
import { parseElemDataAttributes, findClosestPointOnLineSegment } from './utils';

type EditorProps = {
  features: ?Array<GeoJson>,
  selectedFeatureId: ?Id,
  mode: string,
  clickRadius: ?number,
  style: ?Object,

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

const UNCOMMITTED_ID = 'uncommitted';

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
      anyclick: evt => this._onEvent(this._onClick, evt, true),
      click: evt => evt.stopImmediatePropagation(),
      pointermove: evt => this._onEvent(this._onMouseMove, evt, true),
      pointerdown: evt => this._onEvent(this._onMouseDown, evt, true),
      pointerup: evt => this._onEvent(this._onMouseUp, evt, true),
      panmove: evt => this._onEvent(this._onPan, evt, false),
      panstart: evt => this._onEvent(this._onPan, evt, false),
      panend: evt => this._onEvent(this._onPan, evt, false)
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

  _onEvent = (handler: Function, evt: MjolnirEvent, stopPropagation: boolean, ...args: any) => {
    const { mode } = this.props;
    if (mode === MODES.READ_ONLY) {
      return;
    }

    handler(evt, ...args);

    if (stopPropagation) {
      evt.stopImmediatePropagation();
    }
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
    const attributes = parseElemDataAttributes(evt.target);

    // click segment
    if (attributes && attributes.type === ELEMENT_TYPE.VERTEX) {
      const { vertexIndex } = attributes;
      this.setState({
        draggingVertexIndex: vertexIndex,
        startDragPos: { x, y },
        isDragging: true
      });

      // click selected feature
    } else if (this._matchesFeature(attributes, this._getSelectedFeature())) {
      this.setState({
        startDragPos: { x, y },
        isDragging: true
      });
    }
  };

  /* eslint-disable max-depth */
  _onMouseMove = (evt: MjolnirEvent) => {
    const attributes = parseElemDataAttributes(evt.target) || {};
    const { vertexIndex, featureIndex, type } = attributes;

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
        const draggingVertexIndex = Number(this.state.draggingVertexIndex);

        if (draggingVertexIndex >= 0) {
          // dragging vertex
          this._updateFeature(selectedFeature, 'vertex', {
            vertexIndex: draggingVertexIndex,
            lngLat
          });
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
          type === ELEMENT_TYPE.SEGMENT
        ) {
          // segmentId is start vertexIndex
          let uncommittedLngLat = null;
          if (lngLat && typeof vertexIndex === 'number') {
            uncommittedLngLat = this._getClosestPositionOnSegment(
              vertexIndex,
              lngLat,
              selectedFeature
            );
          }

          this.setState({
            uncommittedLngLat
          });
        } else {
          this.setState({
            uncommittedLngLat: null
          });
        }
      }
    }

    const { features, selectedFeatureId } = this.state;
    if (selectedFeatureId && type === ELEMENT_TYPE.VERTEX && typeof featureIndex === 'number') {
      const feature = features && features[featureIndex];
      if (selectedFeatureId === (feature && feature.id)) {
        this.setState({
          hoveredVertexIndex: vertexIndex
        });
      }
    } else if (type !== ELEMENT_TYPE.VERTEX) {
      this.setState({
        hoveredVertexIndex: null
      });
    }

    if (type === ELEMENT_TYPE.FEATURE && typeof featureIndex === 'number') {
      const feature = features && features[featureIndex];
      this.setState({
        hoveredFeatureId: feature && feature.id
      });
    } else {
      this.setState({
        hoveredFeatureId: null
      });
    }
  };
  /* eslint-enable max-depth */

  _onClickFeature = (evt: MjolnirEvent, attributes: any) => {
    const { featureIndex } = attributes;
    const { features } = this.state;
    const selectedFeature = features && typeof featureIndex === 'number' && features[featureIndex];

    if (selectedFeature) {
      this.props.onSelect({
        selectedFeatureId: selectedFeature.id,
        sourceEvent: evt
      });
    }
  };

  _onClickVertex = (evt: MjolnirEvent, attributes: any) => {
    const { mode } = this.props;
    const operation = attributes.operation;
    if (
      operation === OPERATIONS.INTERSECT ||
      (operation === OPERATIONS.SET && mode === MODES.DRAW_RECTANGLE)
    ) {
      this._closePath();
      this._clearCache();
    }
  };

  _onClickSegment = (evt: MjolnirEvent, attributes: any) => {
    const feature = this._getSelectedFeature();

    if (
      feature &&
      (feature.renderType === RENDER_TYPE.POLYGON ||
        feature.renderType === RENDER_TYPE.LINE_STRING) &&
      attributes
    ) {
      const { vertexIndex } = attributes;

      const { uncommittedLngLat } = this.state;

      let lngLat = uncommittedLngLat;
      if (!lngLat && typeof vertexIndex === 'number') {
        const { x, y } = this._getEventPosition(evt);
        lngLat = this._unproject([x, y]);
        lngLat = this._getClosestPositionOnSegment(vertexIndex, lngLat, feature);
      }

      if (lngLat) {
        const insertPosition = (vertexIndex + 1) % feature.points.length;
        feature.insertPoint(lngLat, insertPosition);
        this._update(this.state.features);
      }

      this.setState({
        uncommittedLngLat: null,
        hoveredLngLat: null
      });
    }
  };

  _onClick = (evt: MjolnirEvent) => {
    const { mode } = this.props;
    const attributes = parseElemDataAttributes(evt.target);

    if (attributes && attributes.type === ELEMENT_TYPE.VERTEX) {
      this._onClickVertex(evt, attributes);
      return;
    }

    if (mode === MODES.EDIT_VERTEX && attributes && attributes.type === ELEMENT_TYPE.SEGMENT) {
      this._onClickSegment(evt, attributes);
      return;
    }

    if (
      (mode === MODES.SELECT_FEATURE || mode === MODES.EDIT_VERTEX) &&
      attributes &&
      attributes.type === ELEMENT_TYPE.FEATURE
    ) {
      this._onClickFeature(evt, attributes);
      return;
    }

    const selectedFeature = this._getSelectedFeature();
    const { x, y } = this._getEventPosition(evt);

    switch (mode) {
      case MODES.EDIT_VERTEX:
        if (selectedFeature) {
          this.props.onSelect({
            selectedFeatureId: null,
            sourceEvent: evt
          });
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
          this.props.onSelect({
            selectedFeatureId: null,
            sourceEvent: evt
          });
        } else {
          this._addFeature(mode, { x, y });
        }

        break;

      default:
    }
  };

  // don't forward pan events to the underlying map when:
  // - the pan target is a vertex/line/the currently selected feature
  // - the user is dragging something around
  // - there is currently an uncommitted position
  // (i.e. the user is creating a feature/vertex/line)
  _onPan = (evt: MjolnirEvent) => {
    const attributes = parseElemDataAttributes(evt.target);
    const type = attributes && attributes.type;
    if (
      type === ELEMENT_TYPE.VERTEX ||
      type === ELEMENT_TYPE.SEGMENT ||
      this.state.isDragging ||
      this.state.uncommittedLngLat !== null
    ) {
      evt.stopImmediatePropagation();
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

  _matchesFeature = (attributes: any, feature: ?Feature) => {
    if (!attributes || attributes.type !== ELEMENT_TYPE.FEATURE || !feature) {
      return false;
    }

    const { featureIndex } = attributes;
    const { features } = this.props;
    const elemFeature = features && features[featureIndex];
    return elemFeature && feature.id === elemFeature.id;
  };

  _getClosestPositionOnSegment = (vertexIndex: number, pointLngLat: Position, feature: Feature) => {
    const points = feature && feature.points;
    if (!points || !points.length) {
      return null;
    }

    // segmentId is start vertexIndex
    const startPos = points[vertexIndex];
    const endPos = points[(vertexIndex + 1) % points.length];
    return findClosestPointOnLineSegment(startPos, endPos, pointLngLat);
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
    const { mode } = this.props;
    const { draggingVertexIndex, hoveredVertexIndex } = this.state;
    const selectedFeature = this._getSelectedFeature();
    const isSelected =
      index === draggingVertexIndex ||
      (selectedFeature && selectedFeature.renderType === RENDER_TYPE.POINT);
    const isClosing = mode === MODES.DRAW_POLYGON && hoveredVertexIndex === 0 && index === -1;

    if (renderState) {
      return renderState;
    }

    if (isClosing) {
      return RENDER_STATE.CLOSING;
    }

    if (isSelected) {
      return RENDER_STATE.SELECTED;
    }

    switch (index) {
      case hoveredVertexIndex:
        return RENDER_STATE.HOVERED;
      case UNCOMMITTED_ID:
        return RENDER_STATE.UNCOMMITTED;
      default:
        return RENDER_STATE.INACTIVE;
    }
  };

  _getFeatureRenderState = (id: Id, renderState: ?string) => {
    const { selectedFeatureId, hoveredFeatureId } = this.state;
    if (renderState) {
      return renderState;
    }
    switch (id) {
      case selectedFeatureId:
        return RENDER_STATE.SELECTED;
      case hoveredFeatureId:
        return RENDER_STATE.HOVERED;
      case UNCOMMITTED_ID:
        return RENDER_STATE.UNCOMMITTED;
      default:
        return RENDER_STATE.INACTIVE;
    }
  };

  /* RENDER */
  /* eslint-disable max-params */
  _renderVertex = (
    position: Position,
    featureIndex: number,
    vertexIndex: Id,
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

    const elemKey = `${ELEMENT_TYPE.VERTEX}.${featureIndex}.${vertexIndex}.${operation}`;
    // first <circle|rect> is to make path easily interacted with
    switch (shape) {
      case 'circle':
        return (
          <g key={elemKey} transform={`translate(${p[0]}, ${p[1]})`}>
            <circle
              data-type={ELEMENT_TYPE.VERTEX}
              data-feature-index={featureIndex}
              data-vertex-index={vertexIndex}
              data-operation={operation}
              key={`${elemKey}.hidden`}
              style={{ ...style, ...HIDDEN_CLICKABLE_STYLE, stroke: 'none' }}
              cx={0}
              cy={0}
              r={clickRadius}
            />
            <circle
              data-type={ELEMENT_TYPE.VERTEX}
              data-feature-index={featureIndex}
              data-vertex-index={vertexIndex}
              data-operation={operation}
              key={elemKey}
              style={style}
              cx={0}
              cy={0}
            />
          </g>
        );
      case 'rect':
        return (
          <g key={`vertex.${vertexIndex}`} transform={`translate(${p[0]}, ${p[1]})`}>
            <rect
              data-type={ELEMENT_TYPE.VERTEX}
              data-feature-index={featureIndex}
              data-vertex-index={vertexIndex}
              data-operation={operation}
              key={`${elemKey}.hidden`}
              style={{
                ...style,
                ...HIDDEN_CLICKABLE_STYLE,
                width: clickRadius,
                height: clickRadius
              }}
            />
            <rect
              data-type={ELEMENT_TYPE.VERTEX}
              data-feature-index={featureIndex}
              data-vertex-index={vertexIndex}
              data-operation={operation}
              key={elemKey}
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
    const { clickRadius } = this.props;
    const projected = this._getProjectedData([startPos, endPos], RENDER_TYPE.LINE_STRING);
    const { radius, ...others } = style;

    const elemKey = `${ELEMENT_TYPE.SEGMENT}.${featureIndex}.${startVertexId}`;
    return (
      <g key={elemKey}>
        <path
          data-type={ELEMENT_TYPE.SEGMENT}
          data-feature-index={featureIndex}
          data-vertex-index={startVertexId}
          key={`${elemKey}.hidden`}
          style={{ ...others, strokeWidth: clickRadius || radius, opacity: 0 }}
          d={projected}
        />
        <path
          data-type={ELEMENT_TYPE.SEGMENT}
          data-feature-index={featureIndex}
          data-vertex-index={startVertexId}
          key={elemKey}
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

    return uncommittedSegments.filter(Boolean);
  };

  _renderClosingStroke = (featureIndex: number, feature: Feature, style: any) => {
    const { points, isClosed } = feature;
    const { mode } = this.props;
    const { uncommittedLngLat } = this.state;
    if (uncommittedLngLat && mode === MODES.DRAW_POLYGON && points.length > 2 && !isClosed) {
      // from uncommitted position to the first point of the polygon
      return this._renderSegment(
        featureIndex,
        'uncommitted-close',
        uncommittedLngLat,
        points[0],
        style
      );
    }
    return null;
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
        data-type={ELEMENT_TYPE.FEATURE}
        data-feature-index={index}
        key={`${ELEMENT_TYPE.FEATURE}.${index}.fill`}
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
    const closingStyle = getFeatureStyle({ feature: geoJson, state: RENDER_STATE.CLOSING });

    const committedStroke = this._renderCommittedStroke(index, feature, committedStyle);
    const uncommittedStrokes =
      this._renderUncommittedStrokes(index, feature, uncommittedStyle) || [];
    const closingStroke = this._renderClosingStroke(index, feature, closingStyle);
    const fill = this._renderFill(index, feature, uncommittedStyle);

    return [fill, committedStroke, ...uncommittedStrokes, closingStroke].filter(Boolean);
  };

  _renderCommittedVertices = (featureIndex: number, feature: Feature, geoJson: GeoJson) => {
    const { mode, getEditHandleStyle, getEditHandleShape } = this.props;
    const { isClosed, points } = feature;

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

    return committedVertices;
  };

  _renderUncommittedVertex = (featureIndex: number, feature: Feature, geoJson: GeoJson) => {
    const { getEditHandleStyle, getEditHandleShape } = this.props;
    const { selectedFeatureId, uncommittedLngLat } = this.state;
    const { id } = feature;

    let uncommittedVertex = null;
    if (selectedFeatureId === id && uncommittedLngLat) {
      const style = getEditHandleStyle({
        feature: geoJson,
        index: 'uncommitted',
        state: this._getEditHandleState(-1, RENDER_STATE.UNCOMMITTED)
      });

      const shape =
        typeof getEditHandleShape === 'function'
          ? getEditHandleShape({
              feature: geoJson,
              index: null,
              state: this._getEditHandleState(-1)
            })
          : getEditHandleShape;

      uncommittedVertex = this._renderVertex(
        uncommittedLngLat,
        featureIndex,
        'uncommitted',
        OPERATIONS.INSERT,
        { ...style, pointerEvents: 'none' },
        shape
      );
    }

    return uncommittedVertex;
  };

  _renderCurrentVertices = (feature: Feature, featureIndex: number) => {
    const { points } = feature;

    if (!points || !points.length) {
      return null;
    }

    const geoJson = feature.toFeature();
    const committedVertices = this._renderCommittedVertices(featureIndex, feature, geoJson);
    const uncommittedVertex = this._renderUncommittedVertex(featureIndex, feature, geoJson);

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

    const { clickRadius } = this.props;
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

    const elemKey = `${ELEMENT_TYPE.FEATURE}.${index}`;

    switch (renderType) {
      case RENDER_TYPE.POINT:
        if (shape === 'rect') {
          return (
            <g key={elemKey} transform={`translate(${projected[0][0]}, ${projected[0][1]})`}>
              <rect
                data-type={ELEMENT_TYPE.FEATURE}
                data-feature-index={index}
                key={`${elemKey}.hidden`}
                style={{
                  ...style,
                  ...HIDDEN_CLICKABLE_STYLE,
                  width: clickRadius,
                  height: clickRadius
                }}
              />
              <rect
                data-type={ELEMENT_TYPE.FEATURE}
                data-feature-index={index}
                key={elemKey}
                style={style}
              />
            </g>
          );
        }

        return (
          <g key={elemKey} transform={`translate(${projected[0][0]}, ${projected[0][1]})`}>
            <circle
              data-type={ELEMENT_TYPE.FEATURE}
              data-feature-index={index}
              key={`${elemKey}.hidden`}
              style={{
                ...style,
                opacity: 0
              }}
              cx={0}
              cy={0}
              r={clickRadius}
            />
            <circle
              data-type={ELEMENT_TYPE.FEATURE}
              data-feature-index={index}
              key={`feature.${index}`}
              style={style}
              cx={0}
              cy={0}
            />
          </g>
        );

      // first <path> is to make path easily interacted with
      case RENDER_TYPE.LINE_STRING:
        return (
          <g key={elemKey}>
            <path
              data-type={ELEMENT_TYPE.FEATURE}
              data-feature-index={index}
              key={`${elemKey}.hidden`}
              style={{
                ...style,
                strokeWidth: clickRadius,
                opacity: 0
              }}
              d={projected}
            />
            <path
              data-type={ELEMENT_TYPE.FEATURE}
              data-feature-index={index}
              key={elemKey}
              style={style}
              d={projected}
            />
          </g>
        );

      case 'Polygon':
      case 'Rectangle':
        return (
          <path
            data-type={ELEMENT_TYPE.FEATURE}
            data-feature-index={index}
            key={elemKey}
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
      <svg key="draw-canvas" width="100%" height="100%">
        {features && features.length > 0 && <g key="feature-group">{this._renderFeatures()}</g>}
        {selectedFeatureId && this._renderCurrent()}
      </svg>
    );
  };

  _renderEditor = () => {
    const viewport = (this._context && this._context.viewport) || {};
    const { style } = this.props;
    const { width, height } = viewport;

    return (
      <div
        id="editor"
        style={{
          width,
          height,
          ...style
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

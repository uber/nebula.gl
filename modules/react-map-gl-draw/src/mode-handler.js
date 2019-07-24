// @flow
import { _MapContext as MapContext } from 'react-map-gl';
import React, { Component } from 'react';
import { ImmutableFeatureCollection } from '@nebula.gl/edit-modes';

import type { Position, EditAction } from '@nebula.gl/edit-modes';
import type { MjolnirEvent } from 'mjolnir.js';
import type { BaseEvent, EditorProps, EditorState, Mode } from './types';

import { DRAWING_MODE, EDIT_TYPE, MODES } from './constants';
import { getScreenCoords, isNumeric, parseEventElement } from './edit-modes/utils';
import {
  BaseMode,
  EditingMode,
  DrawPointMode,
  DrawLineStringMode,
  DrawRectangleMode,
  DrawPolygonMode
} from './edit-modes';
import {
  getEditHandleStyle as defaultGetEditHandleStyle,
  getFeatureStyle as defaultGetFeatureStyle
} from './style';

const MODE_TO_HANDLER = Object.freeze({
  [MODES.READ_ONLY]: null,
  [MODES.SELECT]: BaseMode,
  [MODES.EDITING]: EditingMode,
  [MODES.DRAW_POINT]: DrawPointMode,
  [MODES.DRAW_PATH]: DrawLineStringMode,
  [MODES.DRAW_RECTANGLE]: DrawRectangleMode,
  [MODES.DRAW_POLYGON]: DrawPolygonMode
});

const defaultProps = {
  mode: MODES.READ_ONLY,
  selectedFeatureId: null,
  clickRadius: 0,
  getEditHandleStyle: defaultGetEditHandleStyle,
  getFeatureStyle: defaultGetFeatureStyle,
  getFeatureShape: 'circle',
  getEditHandleShape: 'circle',
  onSelect: () => {}
};

const defaultState = {
  featureCollection: new ImmutableFeatureCollection({
    type: 'FeatureCollection',
    features: []
  }),

  selectedFeatureIndex: null,
  selectedFeatureId: null,

  // index, isGuide, mapCoords, screenCoords
  hovered: null,

  isDragging: false,
  didDrag: false,

  lastPointerMoveEvent: null,

  pointerDownPicks: null,
  pointerDownScreenCoords: null,
  pointerDownMapCoords: null
};

export default class ModeHandler extends Component<EditorProps, EditorState> {
  static defaultProps = defaultProps;

  constructor() {
    super();
    this.state = defaultState;

    this._events = {
      anyclick: evt => this._onEvent(this._onClick, evt, true),
      click: evt => evt.stopImmediatePropagation(),
      pointermove: evt => this._onEvent(this._onPointerMove, evt, true),
      pointerdown: evt => this._onEvent(this._onPointerDown, evt, true),
      pointerup: evt => this._onEvent(this._onPointerUp, evt, true),
      panmove: evt => this._onEvent(this._onPan, evt, false),
      panstart: evt => this._onEvent(this._onPan, evt, false),
      panend: evt => this._onEvent(this._onPan, evt, false)
    };
  }

  componentWillReceiveProps(nextProps: EditorProps, nextContext: any) {
    if (this.props.mode !== nextProps.mode) {
      this._clearEditingState();

      if (nextProps.mode === MODES.READ_ONLY) {
        this._degregisterEvents();
      }

      if (this.props.mode === MODES.READ_ONLY && nextProps.mode) {
        this._registerEvents();
      }

      this._setupModeHandler(nextProps.mode);
    }

    if (this.props.features !== nextProps.features) {
      let featureCollection = nextProps.features;

      if (nextProps.features && Array.isArray(nextProps.features)) {
        featureCollection = {
          type: 'FeatureCollection',
          features: nextProps.features
        };
      }

      featureCollection = new ImmutableFeatureCollection(featureCollection);

      this.setState({
        featureCollection
      });
    }

    if (this.props.selectedFeatureId !== nextProps.selectedFeatureId) {
      this._clearEditingState();
      const features = this.getFeatures();
      const selectedFeatureIndex =
        features && features.findIndex(f => f.properties.id === nextProps.selectedFeatureId);
      this.setState({
        selectedFeatureIndex: isNumeric(selectedFeatureIndex) ? selectedFeatureIndex : null
      });
    }
  }

  componentWillUnmount() {
    this._degregisterEvents();
  }

  _events: any;
  _modeHandler: any;
  _context: ?MapContext;
  _containerRef: ?HTMLElement;

  getFeatures = () => {
    let featureCollection = this.state.featureCollection;
    featureCollection = featureCollection && featureCollection.getObject();
    return featureCollection && featureCollection.features;
  };

  getModeProps() {
    const { selectedFeatureIndex, lastPointerMoveEvent, featureCollection } = this.state;
    const viewport = this._context && this._context.viewport;

    return {
      data: featureCollection,
      selectedIndexes: [selectedFeatureIndex],
      lastPointerMoveEvent,
      viewport,
      onEdit: this._onEdit
    };
  }

  _setupModeHandler = (mode: Mode) => {
    if (mode === MODES.READ_ONLY) {
      this._modeHandler = null;
      return;
    }

    const HandlerClass = MODE_TO_HANDLER[mode];
    if (HandlerClass) {
      this._modeHandler = new HandlerClass();
    }
  };

  _clearEditingState = () => {
    this.setState({
      hovered: null,

      pointerDownPicks: null,
      pointerDownScreenCoords: null,
      pointerDownMapCoords: null,

      isDragging: false,
      didDrag: false
    });
  };

  _onEdit = (editAction: EditAction) => {
    const { mode, onSelect, onUpdate } = this.props;
    const { editType, updatedData } = editAction;

    switch (editType) {
      case EDIT_TYPE.MOVE_POSITION:
        // intermediate feature, do not need forward to application
        // update editor state
        this.setState({
          featureCollection: new ImmutableFeatureCollection(updatedData)
        });
        break;
      case EDIT_TYPE.ADD_FEATURE:
        onUpdate(updatedData && updatedData.features);
        if (mode === MODES.DRAW_PATH) {
          const featureIndex = updatedData.features.length - 1;
          const feature = updatedData.features[featureIndex];

          // TODO deprecate selectedFeatureId
          onSelect({
            selectedFeatureId: feature.properties.id,
            selectedFeatureIndex: featureIndex
          });
        } else {
          onSelect({
            selectedFeatureId: null,
            selectedFeatureIndex: null
          });
        }
        break;
      case EDIT_TYPE.ADD_POSITION:
      case EDIT_TYPE.REMOVE_POSITION:
      case EDIT_TYPE.FINISH_MOVE_POSITION:
        onUpdate(updatedData && updatedData.features);
        break;

      default:
    }
  };

  /* EVENTS */
  _degregisterEvents = () => {
    const eventManager = this._context && this._context.eventManager;
    if (!this._events || !eventManager) {
      return;
    }
    eventManager.off(this._events);
  };

  _registerEvents = () => {
    const ref = this._containerRef;
    const eventManager = this._context && this._context.eventManager;
    if (!this._events || !ref || !eventManager) {
      return;
    }
    eventManager.on(this._events, ref);
  };

  _onEvent = (handler: Function, evt: MjolnirEvent, stopPropagation: boolean) => {
    const event = this._getEvent(evt);
    handler(event);

    if (stopPropagation) {
      evt.stopImmediatePropagation();
    }
  };

  _onClick = (event: BaseEvent) => {
    const { mode } = this.props;
    if (mode === MODES.SELECT || mode === MODES.EDITING) {
      const { onSelect } = this.props;
      const pickedObject = event.picks && event.picks[0] && event.picks[0].object;
      if (pickedObject && isNumeric(pickedObject.featureIndex)) {
        const features = this.getFeatures();
        const feature = features && features[pickedObject.featureIndex];
        onSelect({
          selectedFeatureIndex: pickedObject.featureIndex,
          selectedFeatureId: feature && feature.properties.id
        });
      } else if (this.state.selectedFeatureId) {
        onSelect({
          selectedFeatureId: null,
          selectedFeatureIndex: null
        });
      }
    }

    const modeProps = this.getModeProps();
    this._modeHandler.handleClick(event, modeProps);
  };

  _onPointerMove = (event: BaseEvent) => {
    // hovering
    const hovered = this._getHoverState(event);
    const {
      isDragging,
      didDrag,
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords
    } = this.state;

    if (isDragging && !didDrag && pointerDownScreenCoords) {
      const dx = event.screenCoords[0] - pointerDownScreenCoords[0];
      const dy = event.screenCoords[1] - pointerDownScreenCoords[1];
      if (dx * dx + dy * dy > 5) {
        this.setState({ didDrag: true });
      }
    }

    const pointerMoveEvent = {
      ...event,
      isDragging,
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords
    };

    if (this.state.didDrag) {
      const modeProps = this.getModeProps();
      this._modeHandler.handlePointerMove(pointerMoveEvent, modeProps);
    }

    this.setState({
      hovered,
      lastPointerMoveEvent: pointerMoveEvent
    });
  };

  _onPointerDown = (event: BaseEvent) => {
    const pickedObject = event.picks && event.picks[0] && event.picks[0].object;
    const startDraggingEvent = {
      ...event,
      pointerDownScreenCoords: event.screenCoords,
      pointerDownMapCoords: event.mapCoords
    };

    const newState = {
      isDragging: pickedObject && isNumeric(pickedObject.featureIndex),
      pointerDownPicks: event.picks,
      pointerDownScreenCoords: event.screenCoords,
      pointerDownMapCoords: event.mapCoords
    };

    this.setState(newState);

    const modeProps = this.getModeProps();
    this._modeHandler.handleStartDragging(startDraggingEvent, modeProps);
  };

  _onPointerUp = (event: MjolnirEvent) => {
    const stopDraggingEvent = {
      ...event,
      pointerDownScreenCoords: this.state.pointerDownScreenCoords,
      pointerDownMapCoords: this.state.pointerDownMapCoords
    };

    const newState = {
      isDragging: false,
      didDrag: false,
      pointerDownPicks: null,
      pointerDownScreenCoords: null,
      pointerDownMapCoords: null
    };

    this.setState(newState);

    const modeProps = this.getModeProps();
    this._modeHandler.handleStopDragging(stopDraggingEvent, modeProps);
  };

  _onPan = (event: BaseEvent) => {
    const { isDragging } = this.state;
    if (isDragging) {
      event.sourceEvent.stopImmediatePropagation();
    }
  };

  /* HELPERS */
  project = (pt: Position) => {
    const viewport = this._context && this._context.viewport;
    return viewport && viewport.project(pt);
  };

  unproject = (pt: Position) => {
    const viewport = this._context && this._context.viewport;
    return viewport && viewport.unproject(pt);
  };

  _getEvent(evt: MjolnirEvent) {
    const picked = parseEventElement(evt);
    const screenCoords = getScreenCoords(evt);
    const mapCoords = this.unproject(screenCoords);

    return {
      picks: picked ? [picked] : null,
      screenCoords,
      mapCoords,
      sourceEvent: evt
    };
  }

  _getHoverState = (event: BaseEvent) => {
    if (this._isDrawing()) {
      return null;
    }

    return event.picks && event.picks[0] && event.picks[0].object;
  };

  _isDrawing() {
    const { mode } = this.props;
    return DRAWING_MODE.findIndex(m => m === mode) >= 0;
  }

  render(child: any) {
    return (
      <MapContext.Consumer>
        {context => {
          this._context = context;
          const viewport = context && context.viewport;

          if (!viewport || viewport.height <= 0 || viewport.width <= 0) {
            return null;
          }

          return child;
        }}
      </MapContext.Consumer>
    );
  }
}

ModeHandler.displayName = 'ModeHandler';

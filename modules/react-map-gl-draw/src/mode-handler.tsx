import { _MapContext as MapContext, MapContextProps } from 'react-map-gl';
import * as React from 'react';
import {
  ImmutableFeatureCollection,
  Feature,
  EditAction,
  _memoize as memoize,
} from '@nebula.gl/edit-modes';
import { MjolnirEvent } from 'mjolnir.js';
import { BaseEvent, EditorProps, EditorState, SelectAction } from './types';

import EditingMode from './edit-modes/editing-mode';
import { getScreenCoords, parseEventElement, isNumeric } from './edit-modes/utils';
import { EDIT_TYPE, ELEMENT_TYPE } from './constants';

const defaultProps = {
  selectable: true,
  mode: null,
  features: null,
  onSelect: null,
  onUpdate: null,
  onUpdateCursor: () => {},
};

const defaultState = {
  featureCollection: new ImmutableFeatureCollection({
    type: 'FeatureCollection',
    features: [],
  }),

  selectedFeatureIndex: null,

  // index, isGuide, mapCoords, screenCoords
  hovered: null,

  isDragging: false,
  didDrag: false,

  lastPointerMoveEvent: null,

  pointerDownPicks: null,
  pointerDownScreenCoords: null,
  pointerDownMapCoords: null,
};

export default class ModeHandler extends React.PureComponent<EditorProps, EditorState> {
  static displayName = 'ModeHandler';
  static defaultProps = defaultProps;

  constructor(props: EditorProps) {
    super(props);
    this.state = defaultState;
    this._eventsRegistered = false;

    this._events = {
      anyclick: (evt) => this._onEvent(this._onClick, evt, true),
      dblclick: (evt) => this._onEvent(this._onDblclick, evt, false),
      click: (evt) => evt.stopImmediatePropagation(),
      pointermove: (evt) => this._onEvent(this._onPointerMove, evt, false),
      pointerdown: (evt) => this._onEvent(this._onPointerDown, evt, true),
      pointerup: (evt) => this._onEvent(this._onPointerUp, evt, true),
      panmove: (evt) => this._onEvent(this._onPan, evt, false),
      panstart: (evt) => this._onEvent(this._onPan, evt, false),
      panend: (evt) => this._onEvent(this._onPan, evt, false),
    };
  }

  componentDidMount() {
    this._setupModeHandler();
  }

  componentDidUpdate(prevProps: EditorProps) {
    if (prevProps.mode !== this.props.mode) {
      this._clearEditingState();
      this._setupModeHandler();
    }
  }

  componentWillUnmount() {
    this._degregisterEvents();
  }

  _events: any;
  _eventsRegistered: boolean;
  _modeHandler: any;
  _context: MapContextProps | null | undefined;
  _containerRef: HTMLElement | null | undefined;

  getFeatures = () => {
    let featureCollection = this._getFeatureCollection();
    featureCollection = featureCollection && featureCollection.getObject();
    return featureCollection && featureCollection.features;
  };

  addFeatures = (features: Feature | Feature[]) => {
    let featureCollection = this._getFeatureCollection();
    if (featureCollection) {
      if (!Array.isArray(features)) {
        features = [features];
      }

      featureCollection = featureCollection.addFeatures(features);
      this.setState({ featureCollection });
    }
  };

  deleteFeatures = (featureIndexes: number | number[]) => {
    let featureCollection = this._getFeatureCollection();
    const selectedFeatureIndex = this._getSelectedFeatureIndex();
    if (featureCollection) {
      if (!Array.isArray(featureIndexes)) {
        featureIndexes = [featureIndexes];
      }
      featureCollection = featureCollection.deleteFeatures(featureIndexes);
      const newState: any = { featureCollection };
      if (featureIndexes.findIndex((index) => selectedFeatureIndex === index) >= 0) {
        newState.selectedFeatureIndex = null;
      }
      this.setState(newState);
    }
  };

  getModeProps() {
    const featureCollection = this._getFeatureCollection();

    const { lastPointerMoveEvent } = this.state;
    const selectedFeatureIndex = this._getSelectedFeatureIndex();
    const viewport = this._context && this._context.viewport;

    return {
      data: featureCollection && featureCollection.featureCollection,
      selectedIndexes: isNumeric(selectedFeatureIndex) ? [selectedFeatureIndex] : [],
      lastPointerMoveEvent,
      viewport,
      featuresDraggable: this.props.featuresDraggable,
      onEdit: this._onEdit,
      onUpdateCursor: this.props.onUpdateCursor,
      modeConfig: this.props.modeConfig,
    };
  }

  /* MEMORIZERS */
  _getMemorizedFeatureCollection = memoize(({ propsFeatures, stateFeatures }: any) => {
    const features = propsFeatures || stateFeatures;
    // Any changes in ImmutableFeatureCollection will create a new object
    if (features instanceof ImmutableFeatureCollection) {
      return features;
    }

    if (features && features.type === 'FeatureCollection') {
      return new ImmutableFeatureCollection({
        type: 'FeatureCollection',
        features: features.features,
      });
    }

    return new ImmutableFeatureCollection({
      type: 'FeatureCollection',
      features: features || [],
    });
  });

  _getFeatureCollection = () => {
    return this._getMemorizedFeatureCollection({
      propsFeatures: this.props.features,
      stateFeatures: this.state.featureCollection,
    });
  };

  _setupModeHandler = () => {
    const mode = this.props.mode;
    this._modeHandler = mode;

    if (!mode) {
      this._degregisterEvents();
      return;
    }

    this._registerEvents();
  };

  /* EDITING OPERATIONS */
  _clearEditingState = () => {
    this.setState({
      selectedFeatureIndex: null,

      hovered: null,

      pointerDownPicks: null,
      pointerDownScreenCoords: null,
      pointerDownMapCoords: null,

      isDragging: false,
      didDrag: false,
    });
  };

  _getSelectedFeatureIndex = () => {
    if ('selectedFeatureIndex' in this.props) {
      return this.props.selectedFeatureIndex;
    }
    return this.state.selectedFeatureIndex;
  };

  _onSelect = (selected: SelectAction) => {
    this.setState({ selectedFeatureIndex: selected && selected.selectedFeatureIndex });
    if (this.props.onSelect) {
      this.props.onSelect(selected);
    }
  };

  _onEdit = (editAction: EditAction<any>) => {
    const { editType, updatedData, editContext } = editAction;
    this.setState({ featureCollection: new ImmutableFeatureCollection(updatedData) });

    switch (editType) {
      case EDIT_TYPE.ADD_FEATURE:
        this._onSelect({
          selectedFeature: null,
          selectedFeatureIndex: null,
          selectedEditHandleIndex: null,
          screenCoords: editContext && editContext.screenCoords,
          mapCoords: editContext && editContext.mapCoords,
        });
        break;
      default:
    }

    if (this.props.onUpdate) {
      this.props.onUpdate({
        data: updatedData && updatedData.features,
        editType,
        editContext,
      });
    }
  };

  /* EVENTS */
  _degregisterEvents = () => {
    const eventManager = this._context && this._context.eventManager;
    if (!this._events || !eventManager) {
      return;
    }

    if (this._eventsRegistered) {
      eventManager.off(this._events);
      this._eventsRegistered = false;
    }
  };

  _registerEvents = () => {
    const ref = this._containerRef;
    const eventManager = this._context && this._context.eventManager;
    if (!this._events || !ref || !eventManager) {
      return;
    }

    if (this._eventsRegistered) {
      return;
    }

    eventManager.on(this._events, ref);
    this._eventsRegistered = true;
  };

  _onEvent = (handler: Function, evt: MjolnirEvent, stopPropagation: boolean) => {
    const event = this._getEvent(evt);
    handler(event);

    if (stopPropagation) {
      evt.stopImmediatePropagation();
    }
  };

  _onClick = (event: BaseEvent) => {
    const modeProps = this.getModeProps();
    // TODO refactor EditingMode
    // @ts-ignore
    if (this._modeHandler instanceof EditingMode || this.props.selectable) {
      const { mapCoords, screenCoords } = event;
      const pickedObject = event.picks && event.picks[0];
      // @ts-ignore
      if (pickedObject && isNumeric(pickedObject.featureIndex)) {
        // @ts-ignore
        const selectedFeatureIndex = pickedObject.featureIndex;
        this._onSelect({
          selectedFeature: pickedObject.object,
          selectedFeatureIndex,
          selectedEditHandleIndex:
            // @ts-ignore
            pickedObject.type === ELEMENT_TYPE.EDIT_HANDLE ? pickedObject.index : null,
          // @ts-ignore
          mapCoords,
          screenCoords,
        });
      } else {
        this._onSelect({
          selectedFeature: null,
          selectedFeatureIndex: null,
          selectedEditHandleIndex: null,
          // @ts-ignore
          mapCoords,
          screenCoords,
        });
      }
    }

    this._modeHandler.handleClick(event, modeProps);
  };

  _onDblclick = (event: BaseEvent) => {
    if (isNumeric(this._getSelectedFeatureIndex())) {
      event.sourceEvent.stopImmediatePropagation();
    }
  };

  _onPointerMove = (event: BaseEvent) => {
    // hovering
    const hovered = this._getHoverState(event);
    const {
      isDragging,
      didDrag,
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords,
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
      pointerDownMapCoords,
    };

    if (this.state.didDrag) {
      const modeProps = this.getModeProps();
      this._modeHandler.handlePointerMove(pointerMoveEvent, modeProps);
    }

    this.setState({
      hovered,
      // @ts-ignore
      lastPointerMoveEvent: pointerMoveEvent,
    });
  };

  _onPointerDown = (event: BaseEvent) => {
    const dragToDraw = this.props.modeConfig && this.props.modeConfig.dragToDraw;
    const isDragging = Boolean(event.picks && event.picks[0]) || dragToDraw;
    const startDraggingEvent = {
      ...event,
      isDragging,
      pointerDownScreenCoords: event.screenCoords,
      pointerDownMapCoords: event.mapCoords,
      cancelPan: event.sourceEvent.stopImmediatePropagation,
    };

    const newState = {
      isDragging,
      pointerDownPicks: event.picks,
      pointerDownScreenCoords: event.screenCoords,
      pointerDownMapCoords: event.mapCoords,
    };
    // @ts-ignore
    this.setState(newState);

    const modeProps = this.getModeProps();
    this._modeHandler.handleStartDragging(startDraggingEvent, modeProps);
  };

  _onPointerUp = (event: BaseEvent) => {
    const { didDrag, pointerDownPicks, pointerDownScreenCoords, pointerDownMapCoords } = this.state;
    const stopDraggingEvent = {
      ...event,
      isDragging: false,
      pointerDownPicks: didDrag ? pointerDownPicks : null,
      pointerDownScreenCoords: didDrag ? pointerDownScreenCoords : null,
      pointerDownMapCoords: didDrag ? pointerDownMapCoords : null,
      cancelPan: event.sourceEvent.cancelPan,
    };

    const newState = {
      isDragging: false,
      didDrag: false,
      pointerDownPicks: null,
      pointerDownScreenCoords: null,
      pointerDownMapCoords: null,
    };

    this.setState(newState);
    const modeProps = this.getModeProps();

    if (didDrag) {
      this._modeHandler.handleStopDragging(stopDraggingEvent, modeProps);
    }
  };

  _onPan = (event: BaseEvent) => {
    const { isDragging } = this.state;
    if (isDragging) {
      event.sourceEvent.stopImmediatePropagation();
    }
    if (this._modeHandler.handlePan) {
      this._modeHandler.handlePan(event, this.getModeProps());
    }
  };

  /* HELPERS */
  project = (pt: [number, number]) => {
    const viewport = this._context && this._context.viewport;
    return viewport && viewport.project(pt);
  };

  unproject = (pt: [number, number]) => {
    const viewport = this._context && this._context.viewport;
    return viewport && viewport.unproject(pt);
  };

  _getEvent(evt: MjolnirEvent) {
    const features = this.getFeatures();
    const guides = this._modeHandler.getGuides(this.getModeProps());
    const picked = parseEventElement(evt, features, guides && guides.features);
    const screenCoords = getScreenCoords(evt);
    // @ts-ignore
    const mapCoords = this.unproject(screenCoords);

    return {
      picks: picked ? [picked] : null,
      screenCoords,
      mapCoords,
      sourceEvent: evt,
    };
  }

  _getHoverState = (event: BaseEvent) => {
    const object = event.picks && event.picks[0];
    if (!object) {
      return null;
    }

    return {
      screenCoords: event.screenCoords,
      mapCoords: event.mapCoords,
      ...object,
    };
  };

  _render() {
    return <div />;
  }

  render() {
    return (
      <MapContext.Consumer>
        {(context) => {
          this._context = context;
          const viewport = context && context.viewport;

          if (!viewport || viewport.height <= 0 || viewport.width <= 0) {
            return null;
          }

          return this._render();
        }}
      </MapContext.Consumer>
    );
  }
}

// @flow
/* eslint-env browser */

import { CompositeLayer } from '@deck.gl/core';
import type {
  ClickEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  PointerMoveEvent,
  DoubleClickEvent
} from '../../../edit-modes/src/index.js';

const EVENT_TYPES = ['anyclick', 'pointermove', 'panstart', 'panmove', 'panend', 'dblclick'];

export default class EditableLayer extends CompositeLayer {
  // Overridable interaction event handlers
  onLayerClick(event: ClickEvent) {
    // default implementation - do nothing
  }

  onDoubleClick(event: DoubleClickEvent) {
    // default implementation - do nothing
  }

  onStartDragging(event: StartDraggingEvent) {
    // default implementation - do nothing
  }

  onStopDragging(event: StopDraggingEvent) {
    // default implementation - do nothing
  }

  onDragging(event: DraggingEvent) {
    // default implementation - do nothing
  }

  onPointerMove(event: PointerMoveEvent) {
    // default implementation - do nothing
  }

  // TODO: implement onCancelDragging (e.g. drag off screen)

  initializeState() {
    this.setState({
      _editableLayerState: {
        // Picked objects at the time the pointer went down
        pointerDownPicks: null,
        // Screen coordinates where the pointer went down
        pointerDownScreenCoords: null,
        // Ground coordinates where the pointer went down
        pointerDownMapCoords: null,

        // Keep track of the mjolnir.js event handler so it can be deregistered
        eventHandler: this._forwardEventToCurrentLayer.bind(this)
      }
    });

    this._addPointerHandlers();
  }

  finalizeState() {
    this._removePointerHandlers();
  }

  _addPointerHandlers() {
    const { eventManager } = this.context.deck;
    const { eventHandler } = this.state._editableLayerState;

    for (const eventType of EVENT_TYPES) {
      eventManager.on(eventType, eventHandler, {
        // give nebula a higher priority so that it can stop propagation to deck.gl's map panning handlers
        priority: 100
      });
    }
  }

  _removePointerHandlers() {
    const { eventManager } = this.context.deck;
    const { eventHandler } = this.state._editableLayerState;

    for (const eventType of EVENT_TYPES) {
      eventManager.off(eventType, eventHandler);
    }
  }

  // A new layer instance is created on every render, so forward the event to the current layer
  // This means that the first layer instance will stick around to be the event listener, but will forward the event
  // to the latest layer instance.
  _forwardEventToCurrentLayer(event: any) {
    const currentLayer = this.getCurrentLayer();

    // Use a naming convention to find the event handling function for this event type
    const func = currentLayer[`_on${event.type}`].bind(currentLayer);
    if (!func) {
      console.warn(`no handler for mjolnir event ${event.type}`); // eslint-disable-line
      return;
    }
    func(event);
  }

  _onanyclick({ srcEvent }: any) {
    const screenCoords = this.getScreenCoords(srcEvent);
    const mapCoords = this.getMapCoords(screenCoords);

    const picks = this.getPicks(screenCoords);

    this.onLayerClick({
      mapCoords,
      screenCoords,
      picks,
      sourceEvent: srcEvent
    });
  }

  _ondblclick({ srcEvent }: any) {
    const screenCoords = this.getScreenCoords(srcEvent);
    const mapCoords = this.getMapCoords(screenCoords);

    const picks = this.getPicks(screenCoords);

    this.onDoubleClick({
      mapCoords,
      screenCoords,
      picks,
      sourceEvent: srcEvent
    });
  }

  _onpanstart(event: any) {
    const screenCoords = this.getScreenCoords(event.srcEvent);
    const mapCoords = this.getMapCoords(screenCoords);

    const picks = this.getPicks(screenCoords);

    this.setState({
      _editableLayerState: {
        ...this.state._editableLayerState,
        pointerDownScreenCoords: screenCoords,
        pointerDownMapCoords: mapCoords,
        pointerDownPicks: picks
      }
    });

    this.onStartDragging({
      picks,
      screenCoords,
      mapCoords,
      pointerDownScreenCoords: screenCoords,
      pointerDownMapCoords: mapCoords,
      cancelPan: event.stopImmediatePropagation,
      sourceEvent: event.srcEvent
    });
  }

  _onpanmove(event: any) {
    const { srcEvent } = event;
    const screenCoords = this.getScreenCoords(srcEvent);
    const mapCoords = this.getMapCoords(screenCoords);

    const {
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords
    } = this.state._editableLayerState;

    const picks = this.getPicks(screenCoords);

    this.onDragging({
      screenCoords,
      mapCoords,
      picks,
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords,
      sourceEvent: srcEvent,
      cancelPan: event.stopImmediatePropagation
      // another (hacky) approach for cancelling map panning
      // const controller = this.context.deck.viewManager.controllers[
      //   Object.keys(this.context.deck.viewManager.controllers)[0]
      // ];
      // controller._state.isDragging = false;
    });
  }

  _onpanend({ srcEvent }: any) {
    const screenCoords = this.getScreenCoords(srcEvent);
    const mapCoords = this.getMapCoords(screenCoords);

    const {
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords
    } = this.state._editableLayerState;

    const picks = this.getPicks(screenCoords);

    this.onStopDragging({
      picks,
      screenCoords,
      mapCoords,
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords,
      sourceEvent: srcEvent
    });

    this.setState({
      _editableLayerState: {
        ...this.state._editableLayerState,
        pointerDownScreenCoords: null,
        pointerDownMapCoords: null,
        pointerDownPicks: null
      }
    });
  }

  _onpointermove(event: any) {
    const { srcEvent } = event;
    const screenCoords = this.getScreenCoords(srcEvent);
    const mapCoords = this.getMapCoords(screenCoords);

    const {
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords
    } = this.state._editableLayerState;

    const picks = this.getPicks(screenCoords);

    this.onPointerMove({
      screenCoords,
      mapCoords,
      picks,
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords,
      sourceEvent: srcEvent
    });
  }

  getPicks(screenCoords: [number, number]) {
    return this.context.deck.pickMultipleObjects({
      x: screenCoords[0],
      y: screenCoords[1],
      layerIds: [this.props.id],
      radius: this.props.pickingRadius,
      depth: this.props.pickingDepth
    });
  }

  getScreenCoords(pointerEvent: any) {
    return [
      pointerEvent.clientX - this.context.gl.canvas.getBoundingClientRect().x,
      pointerEvent.clientY - this.context.gl.canvas.getBoundingClientRect().y
    ];
  }

  getMapCoords(screenCoords: number[]) {
    return this.context.viewport.unproject([screenCoords[0], screenCoords[1]]);
  }
}

EditableLayer.layerName = 'EditableLayer';

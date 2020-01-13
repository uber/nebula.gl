// @flow
/* eslint-env browser */

import { CompositeLayer } from '@deck.gl/core';
import type {
  ClickEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  PointerMoveEvent,
  DoubleClickEvent
} from '../../../edit-modes/src/index.js';

// Minimum number of pixels the pointer must move from the original pointer down to be considered dragging
const MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS = 7;

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

  onPointerMove(event: PointerMoveEvent) {
    // default implementation - do nothing
  }

  // TODO: implement onCancelDragging (e.g. drag off screen)

  initializeState() {
    // const { eventManager } = this.context.deck;
    // eventManager.on(
    //   'panstart',
    //   event => {
    //     console.log('panstart');
    //     // event.stopImmediatePropagation();
    //   },
    //   { priority: 100 }
    // );
    // eventManager.on(
    //   'panmove',
    //   event => {
    //     console.log('panmove');
    //     // event.stopImmediatePropagation();
    //   },
    //   { priority: 100 }
    // );
    // // eventManager.on('pointermove', () => console.log('pointermove'));
    // eventManager.on('panend', () => console.log('panend'));

    this.setState({
      _editableLayerState: {
        // Picked objects at the time the pointer went down
        pointerDownPicks: null,
        // Screen coordinates where the pointer went down
        pointerDownScreenCoords: null,
        // Ground coordinates where the pointer went down
        pointerDownMapCoords: null,
        // Is the pointer dragging (pointer down + moved at least MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS)
        isDragging: false
      }
    });

    this._addPointerHandlers();
  }

  _addPointerHandlers() {
    const { eventManager } = this.context.deck;

    eventManager.on('anyclick', this._onAnyClick.bind(this));
    // eventManager.on('pointermove', this._onPointerMove.bind(this), {
    //   // give nebula a higher priority so that it can stop propagation to deck.gl's map panning handlers
    //   priority: 100
    // });
    eventManager.on('panstart', this._onPanStart.bind(this), {
      // give nebula a higher priority so that it can stop propagation to deck.gl's map panning handlers
      priority: 100
    });
    eventManager.on('panmove', this._onPanMove.bind(this), {
      // give nebula a higher priority so that it can stop propagation to deck.gl's map panning handlers
      priority: 100
    });
    eventManager.on('panend', this._onPanEnd.bind(this), {
      // give nebula a higher priority so that it can stop propagation to deck.gl's map panning handlers
      priority: 100
    });
    eventManager.on('dblclick', this._onDoubleClick.bind(this), {
      // give nebula a higher priority so that it can stop propagation to deck.gl's map panning handlers
      priority: 100
    });
  }

  _onAnyClick({ srcEvent }: any) {
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

  _onDoubleClick({ srcEvent }: any) {
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

  _onPanStart(event: any) {
    const screenCoords = this.getScreenCoords(event.srcEvent);
    const mapCoords = this.getMapCoords(screenCoords);

    const picks = this.getPicks(screenCoords);

    this.setState({
      _editableLayerState: {
        ...this.state._editableLayerState,
        pointerDownScreenCoords: screenCoords,
        pointerDownMapCoords: mapCoords,
        pointerDownPicks: picks,
        isDragging: true
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

  _onPanMove(event: any) {
    const { srcEvent } = event;
    const screenCoords = this.getScreenCoords(srcEvent);
    const mapCoords = this.getMapCoords(screenCoords);

    const {
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords
    } = this.state._editableLayerState;

    const { isDragging } = this.state._editableLayerState;

    const picks = this.getPicks(screenCoords);

    this.onPointerMove({
      screenCoords,
      mapCoords,
      picks,
      isDragging,
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

  _onPanEnd({ srcEvent }: any) {
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
        pointerDownPicks: null,
        isDragging: false
      }
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

  movedEnoughForDrag(screenCoords1: number[], screenCoords2: number[]) {
    return (
      Math.abs(screenCoords1[0] - screenCoords2[0]) > MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS ||
      Math.abs(screenCoords1[1] - screenCoords2[1]) > MINIMUM_POINTER_MOVE_THRESHOLD_PIXELS
    );
  }
}

EditableLayer.layerName = 'EditableLayer';

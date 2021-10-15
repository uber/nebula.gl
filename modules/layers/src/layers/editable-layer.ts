/* eslint-env browser */

import { CompositeLayer } from '@deck.gl/core';
import {
  ClickEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  PointerMoveEvent,
} from '@nebula.gl/edit-modes';

const EVENT_TYPES = ['anyclick', 'pointermove', 'panstart', 'panmove', 'panend', 'keyup'];

export default class EditableLayer extends CompositeLayer<any> {
  static layerName = 'EditableLayer';
  // Overridable interaction event handlers
  onLayerClick(event: ClickEvent) {
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

  onLayerKeyUp(event: KeyboardEvent): void {
    // default implementation - do nothing;
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
        eventHandler: this._forwardEventToCurrentLayer.bind(this),
      },
    });

    this._addEventHandlers();
  }

  finalizeState() {
    this._removeEventHandlers();
  }

  _addEventHandlers() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'eventManager' does not exist on type 'De... Remove this comment to see the full error message
    const { eventManager } = this.context.deck;
    const { eventHandler } = this.state._editableLayerState;

    for (const eventType of EVENT_TYPES) {
      eventManager.on(eventType, eventHandler, {
        // give nebula a higher priority so that it can stop propagation to deck.gl's map panning handlers
        priority: 100,
      });
    }
  }

  _removeEventHandlers() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'eventManager' does not exist on type 'De... Remove this comment to see the full error message
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
      console.warn(`no handler for mjolnir.js event ${event.type}`); // eslint-disable-line
      return;
    }
    func(event);
  }

  _onanyclick({ srcEvent }: any) {
    const screenCoords = this.getScreenCoords(srcEvent);
    const mapCoords = this.getMapCoords(screenCoords);
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number[]' is not assignable to p... Remove this comment to see the full error message
    const picks = this.getPicks(screenCoords);

    this.onLayerClick({
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'any[]' is not assignable to type 'Position'.
      mapCoords,
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'number[]' is not assignable to type 'ScreenC... Remove this comment to see the full error message
      screenCoords,
      picks,
      sourceEvent: srcEvent,
    });
  }

  _onkeyup({ srcEvent }: { srcEvent: KeyboardEvent }) {
    this.onLayerKeyUp(srcEvent);
  }

  _onpanstart(event: any) {
    const screenCoords = this.getScreenCoords(event.srcEvent);
    const mapCoords = this.getMapCoords(screenCoords);
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number[]' is not assignable to p... Remove this comment to see the full error message
    const picks = this.getPicks(screenCoords);

    this.setState({
      _editableLayerState: {
        ...this.state._editableLayerState,
        pointerDownScreenCoords: screenCoords,
        pointerDownMapCoords: mapCoords,
        pointerDownPicks: picks,
      },
    });

    this.onStartDragging({
      picks,
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'number[]' is not assignable to type 'ScreenC... Remove this comment to see the full error message
      screenCoords,
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'any[]' is not assignable to type 'Position'.
      mapCoords,
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'number[]' is not assignable to type 'ScreenC... Remove this comment to see the full error message
      pointerDownScreenCoords: screenCoords,
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'any[]' is not assignable to type 'Position'.
      pointerDownMapCoords: mapCoords,
      cancelPan: event.stopImmediatePropagation,
      sourceEvent: event.srcEvent,
    });
  }

  _onpanmove(event: any) {
    const { srcEvent } = event;
    const screenCoords = this.getScreenCoords(srcEvent);
    const mapCoords = this.getMapCoords(screenCoords);

    const {
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords,
    } = this.state._editableLayerState;
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number[]' is not assignable to p... Remove this comment to see the full error message
    const picks = this.getPicks(screenCoords);

    this.onDragging({
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'number[]' is not assignable to type 'ScreenC... Remove this comment to see the full error message
      screenCoords,
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'any[]' is not assignable to type 'Position'.
      mapCoords,
      picks,
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords,
      sourceEvent: srcEvent,
      cancelPan: event.stopImmediatePropagation,
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
      pointerDownMapCoords,
    } = this.state._editableLayerState;
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number[]' is not assignable to p... Remove this comment to see the full error message
    const picks = this.getPicks(screenCoords);

    this.onStopDragging({
      picks,
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'number[]' is not assignable to type 'ScreenC... Remove this comment to see the full error message
      screenCoords,
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'any[]' is not assignable to type 'Position'.
      mapCoords,
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords,
      sourceEvent: srcEvent,
    });

    this.setState({
      _editableLayerState: {
        ...this.state._editableLayerState,
        pointerDownScreenCoords: null,
        pointerDownMapCoords: null,
        pointerDownPicks: null,
      },
    });
  }

  _onpointermove(event: any) {
    const { srcEvent } = event;
    const screenCoords = this.getScreenCoords(srcEvent);
    const mapCoords = this.getMapCoords(screenCoords);

    const {
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords,
    } = this.state._editableLayerState;
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number[]' is not assignable to p... Remove this comment to see the full error message
    const picks = this.getPicks(screenCoords);

    this.onPointerMove({
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'number[]' is not assignable to type 'ScreenC... Remove this comment to see the full error message
      screenCoords,
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'any[]' is not assignable to type 'Position'.
      mapCoords,
      picks,
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords,
      sourceEvent: srcEvent,
    });
  }

  getPicks(screenCoords: [number, number]) {
    return this.context.deck.pickMultipleObjects({
      x: screenCoords[0],
      y: screenCoords[1],
      layerIds: [this.props.id],
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'pickingRadius' does not exist on type 'C... Remove this comment to see the full error message
      radius: this.props.pickingRadius,
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'pickingDepth' does not exist on type 'Co... Remove this comment to see the full error message
      depth: this.props.pickingDepth,
    });
  }

  getScreenCoords(pointerEvent: any) {
    return [
      pointerEvent.clientX -
        (this.context.gl.canvas as HTMLCanvasElement).getBoundingClientRect().left,
      pointerEvent.clientY -
        (this.context.gl.canvas as HTMLCanvasElement).getBoundingClientRect().top,
    ];
  }

  getMapCoords(screenCoords: number[]) {
    return this.context.viewport.unproject([screenCoords[0], screenCoords[1]]);
  }
}

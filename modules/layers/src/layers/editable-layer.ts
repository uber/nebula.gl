/* eslint-env browser */

import { CompositeLayer, CompositeLayerProps } from '@deck.gl/core/typed';
import {
  ClickEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  PointerMoveEvent,
  Position,
} from '@nebula.gl/edit-modes';

const EVENT_TYPES = ['anyclick', 'pointermove', 'panstart', 'panmove', 'panend', 'keyup'];

export type EditableLayerProps<DataType = any> = CompositeLayerProps<DataType> & {
  pickingRadius?: number;
  pickingDepth?: number;
};

export default abstract class EditableLayer<
  DataT = any,
  ExtraPropsT = Record<string, unknown>
> extends CompositeLayer<ExtraPropsT & Required<EditableLayerProps<DataT>>> {
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
    // @ts-expect-error accessing protected props
    const { eventManager } = this.context.deck;
    const { eventHandler } = this.state._editableLayerState;

    for (const eventType of EVENT_TYPES) {
      // @ts-expect-error narrow type
      eventManager.on(eventType, eventHandler, {
        // give nebula a higher priority so that it can stop propagation to deck.gl's map panning handlers
        priority: 100,
      });
    }
  }

  _removeEventHandlers() {
    // @ts-expect-error accessing protected props
    const { eventManager } = this.context.deck;
    const { eventHandler } = this.state._editableLayerState;

    for (const eventType of EVENT_TYPES) {
      // @ts-expect-error narrow type
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
    const screenCoords = this.getScreenCoords(srcEvent) as [number, number];
    const mapCoords = this.getMapCoords(screenCoords);

    const picks = this.getPicks(screenCoords);

    this.onLayerClick({
      mapCoords,
      screenCoords,
      picks,
      sourceEvent: srcEvent,
    });
  }

  _onkeyup({ srcEvent }: { srcEvent: KeyboardEvent }) {
    this.onLayerKeyUp(srcEvent);
  }

  _onpanstart(event: any) {
    const screenCoords = this.getScreenCoords(event.srcEvent) as [number, number];
    const mapCoords = this.getMapCoords(screenCoords);
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
      screenCoords,
      mapCoords,
      pointerDownScreenCoords: screenCoords,
      pointerDownMapCoords: mapCoords,
      cancelPan: event.stopImmediatePropagation,
      sourceEvent: event.srcEvent,
    });
  }

  _onpanmove(event: any) {
    const { srcEvent } = event;
    const screenCoords = this.getScreenCoords(srcEvent) as [number, number];
    const mapCoords = this.getMapCoords(screenCoords);

    const { pointerDownPicks, pointerDownScreenCoords, pointerDownMapCoords } =
      this.state._editableLayerState;

    const picks = this.getPicks(screenCoords);

    this.onDragging({
      screenCoords,
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
    const screenCoords = this.getScreenCoords(srcEvent) as [number, number];
    const mapCoords = this.getMapCoords(screenCoords);

    const { pointerDownPicks, pointerDownScreenCoords, pointerDownMapCoords } =
      this.state._editableLayerState;

    const picks = this.getPicks(screenCoords);

    this.onStopDragging({
      picks,
      screenCoords,
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
    const screenCoords = this.getScreenCoords(srcEvent) as [number, number];
    const mapCoords = this.getMapCoords(screenCoords);

    const { pointerDownPicks, pointerDownScreenCoords, pointerDownMapCoords } =
      this.state._editableLayerState;

    const picks = this.getPicks(screenCoords);

    this.onPointerMove({
      screenCoords,
      mapCoords,
      picks,
      pointerDownPicks,
      pointerDownScreenCoords,
      pointerDownMapCoords,
      sourceEvent: srcEvent,
      cancelPan: event.stopImmediatePropagation,
    });
  }

  getPicks(screenCoords: [number, number]) {
    return this.context.deck.pickMultipleObjects({
      x: screenCoords[0],
      y: screenCoords[1],
      layerIds: [this.props.id],
      radius: this.props.pickingRadius,
      depth: this.props.pickingDepth,
    });
  }

  getScreenCoords(pointerEvent: any): Position {
    return [
      pointerEvent.clientX -
        (this.context.gl.canvas as HTMLCanvasElement).getBoundingClientRect().left,
      pointerEvent.clientY -
        (this.context.gl.canvas as HTMLCanvasElement).getBoundingClientRect().top,
    ];
  }

  getMapCoords(screenCoords: Position): Position {
    return this.context.viewport.unproject([screenCoords[0], screenCoords[1]]) as Position;
  }
}

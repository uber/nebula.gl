// @flow

import type { FeatureCollection, Feature, Position } from '../geojson-types.js';
import type {
  ModeProps,
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent
} from '../types.js';
import { BaseGeoJsonEditMode, type EditHandle } from './geojson-edit-mode.js';

export class CompositeMode extends BaseGeoJsonEditMode {
  handlers: Array<BaseGeoJsonEditMode>;
  options: Object;

  constructor(handlers: Array<BaseGeoJsonEditMode>, options: Object = {}) {
    super();
    this.handlers = handlers;
    this.options = options;
  }

  _coalesce<T>(callback: BaseGeoJsonEditMode => T, resultEval: ?(T) => boolean = null): T {
    let result: T;

    for (let i = 0; i < this.handlers.length; i++) {
      result = callback(this.handlers[i]);
      if (resultEval ? resultEval(result) : result) {
        break;
      }
    }

    return (result: any);
  }

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void {
    this._coalesce(handler => handler.handleClick(event, props));
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void {
    return this._coalesce(handler => handler.handlePointerMove(event, props));
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void {
    return this._coalesce(handler => handler.handleStartDragging(event, props));
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void {
    return this._coalesce(handler => handler.handleStopDragging(event, props));
  }

  getTentativeFeature(): ?Feature {
    return this._coalesce(handler => handler.getTentativeFeature());
  }

  getEditHandlesAdapter(
    picks: ?Array<Object>,
    mapCoords: ?Position,
    props: ModeProps<FeatureCollection>
  ): EditHandle[] {
    // TODO: Combine the handles *BUT* make sure if none of the results have
    // changed to return the same object so that "editHandles !== this.state.editHandles"
    // in editable-geojson-layer works.
    return this._coalesce(
      handler => handler.getEditHandlesAdapter(picks, mapCoords, props),
      handles => Array.isArray(handles) && handles.length > 0
    );
  }

  getCursorAdapter(props: ModeProps<FeatureCollection>): ?string {
    return this._coalesce(handler => handler.getCursorAdapter(props));
  }
}

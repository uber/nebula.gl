// @flow

import type { FeatureCollection } from '../geojson-types.js';
import type {
  ModeProps,
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  GuideFeatureCollection
} from '../types.js';
import { BaseGeoJsonEditMode } from './geojson-edit-mode.js';

export class CompositeMode extends BaseGeoJsonEditMode {
  _modes: Array<BaseGeoJsonEditMode>;

  constructor(modes: Array<BaseGeoJsonEditMode>) {
    super();
    this._modes = modes;
  }

  _coalesce<T>(callback: BaseGeoJsonEditMode => T, resultEval: ?(T) => boolean = null): T {
    let result: T;

    for (let i = 0; i < this._modes.length; i++) {
      result = callback(this._modes[i]);
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

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void {
    return this._coalesce(handler => handler.handleDragging(event, props));
  }

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    // TODO: Combine the guides *BUT* make sure if none of the results have
    // changed to return the same object so that "guides !== this.state.guides"
    // in editable-geojson-layer works.

    const allGuides = [];
    for (const mode of this._modes) {
      allGuides.push(...mode.getGuides(props).features);
    }

    return {
      type: 'FeatureCollection',
      features: allGuides
    };
  }
}

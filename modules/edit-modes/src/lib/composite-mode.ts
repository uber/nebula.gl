import { FeatureCollection } from '../geojson-types';
import {
  ModeProps,
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
  DraggingEvent,
  GuideFeatureCollection,
} from '../types';
import { GeoJsonEditMode } from './geojson-edit-mode';

export class CompositeMode extends GeoJsonEditMode {
  _modes: Array<GeoJsonEditMode>;

  constructor(modes: Array<GeoJsonEditMode>) {
    super();
    this._modes = modes;
  }

  _coalesce<T>(
    callback: (arg0: GeoJsonEditMode) => T,
    resultEval: (arg0: T) => boolean | null | undefined = null
  ): T {
    let result: T;

    for (let i = 0; i < this._modes.length; i++) {
      result = callback(this._modes[i]);
      if (resultEval ? resultEval(result) : result) {
        break;
      }
    }

    return result as any;
  }

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void {
    this._coalesce((handler) => handler.handleClick(event, props));
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void {
    return this._coalesce((handler) => handler.handlePointerMove(event, props));
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void {
    return this._coalesce((handler) => handler.handleStartDragging(event, props));
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>): void {
    return this._coalesce((handler) => handler.handleStopDragging(event, props));
  }

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void {
    return this._coalesce((handler) => handler.handleDragging(event, props));
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
      features: allGuides,
    };
  }
}

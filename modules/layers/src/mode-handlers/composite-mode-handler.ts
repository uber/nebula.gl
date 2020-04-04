import { FeatureCollection, Feature, Position } from '@nebula.gl/edit-modes';
import {
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
} from '../event-types';
import { ModeHandler, EditAction, EditHandle } from './mode-handler';

// TODO edit-modes: delete handlers once EditMode fully implemented
export class CompositeModeHandler extends ModeHandler {
  handlers: Array<ModeHandler>;
  options: Record<string, any>;

  constructor(handlers: Array<ModeHandler>, options: Record<string, any> = {}) {
    super();
    this.handlers = handlers;
    this.options = options;
  }

  _coalesce<T>(
    callback: (arg0: ModeHandler) => T,
    resultEval: (arg0: T) => boolean | null | undefined = null
  ): T {
    let result: T;

    for (let i = 0; i < this.handlers.length; i++) {
      result = callback(this.handlers[i]);
      if (resultEval ? resultEval(result) : result) {
        break;
      }
    }

    return result as any;
  }

  setFeatureCollection(featureCollection: FeatureCollection): void {
    this.handlers.forEach((handler) => handler.setFeatureCollection(featureCollection));
  }

  setModeConfig(modeConfig: any): void {
    this.handlers.forEach((handler) => handler.setModeConfig(modeConfig));
  }

  setSelectedFeatureIndexes(indexes: number[]): void {
    this.handlers.forEach((handler) => handler.setSelectedFeatureIndexes(indexes));
  }

  handleClick(event: ClickEvent): EditAction | null | undefined {
    return this._coalesce((handler) => handler.handleClick(event));
  }

  handlePointerMove(
    event: PointerMoveEvent
  ): { editAction: EditAction | null | undefined; cancelMapPan: boolean } {
    return this._coalesce(
      (handler) => handler.handlePointerMove(event),
      (result) => result && Boolean(result.editAction)
    );
  }

  handleStartDragging(event: StartDraggingEvent): EditAction | null | undefined {
    return this._coalesce((handler) => handler.handleStartDragging(event));
  }

  handleStopDragging(event: StopDraggingEvent): EditAction | null | undefined {
    return this._coalesce((handler) => handler.handleStopDragging(event));
  }

  getTentativeFeature(): Feature | null | undefined {
    return this._coalesce((handler) => handler.getTentativeFeature());
  }

  getEditHandles(picks?: Array<Record<string, any>>, groundCoords?: Position): EditHandle[] {
    // TODO: Combine the handles *BUT* make sure if none of the results have
    // changed to return the same object so that "editHandles !== this.state.editHandles"
    // in editable-geojson-layer works.
    return this._coalesce(
      (handler) => handler.getEditHandles(picks, groundCoords),
      (handles) => Array.isArray(handles) && handles.length > 0
    );
  }

  getCursor({ isDragging }: { isDragging: boolean }): string {
    return this._coalesce((handler) => handler.getCursor({ isDragging }));
  }
}

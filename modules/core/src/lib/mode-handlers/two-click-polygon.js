// @flow

import type { Position } from '../../geojson-types.js';
import type { ClickEvent, PointerMoveEvent } from '../event-types.js';
import type { EditAction, EditContext } from '../editable-feature-collection.js';
import type { ModeHandler } from './mode-handler.js';

export class TwoClickPolygon implements ModeHandler {
  _clickSequence: Position[] = [];

  handleClick(
    { groundCoords }: ClickEvent,
    { tentativeFeature, featureCollection }: EditContext
  ): ?EditAction {
    this._clickSequence.push(groundCoords);

    if (
      this._clickSequence.length > 1 &&
      tentativeFeature &&
      tentativeFeature.geometry.type === 'Polygon'
    ) {
      this._clickSequence = [];

      const updatedData = featureCollection
        .addFeature({
          type: 'Feature',
          properties: {},
          geometry: tentativeFeature.geometry
        })
        .getObject();

      return {
        updatedData,
        editType: 'addFeature',
        featureIndex: updatedData.features.length - 1,
        positionIndexes: null,
        position: null
      };
    }

    return null;
  }

  handlePointerMove(
    event: PointerMoveEvent,
    editContext: EditContext
  ): { editAction: ?EditAction, cancelMapPan: boolean } {
    return { editAction: null, cancelMapPan: false };
  }
}

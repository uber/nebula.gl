// @flow

import { EditableFeatureCollection } from 'nebula.gl';

export class CustomEditableFeatureCollection extends EditableFeatureCollection {
  setDrawAtFront(drawAtFront: boolean): void {
    if (this._drawAtFront === drawAtFront) {
      return;
    }

    this._drawAtFront = drawAtFront;
    this._setTentativeFeature(null);
  }

  onClick(groundCoords: Position, picks: any[]): ?any {
    let editAction = super.onClick(groundCoords, picks);

    const geometry = this.getSelectedGeometry();
    if (
      this._mode === 'drawLineString' &&
      this._drawAtFront &&
      geometry &&
      geometry.type === 'LineString'
    ) {
      // Extension LineString from the front instead of the back
      const positionIndexes = [0];
      const featureIndex = this._selectedFeatureIndexes[0];
      const updatedData = this.featureCollection
        .addPosition(featureIndex, positionIndexes, groundCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'addPosition',
        featureIndex,
        positionIndexes,
        position: groundCoords
      };
    }

    return editAction;
  }

  onPointerMove(
    groundCoords: any,
    picks: any[],
    isDragging: boolean,
    dragStartPicks: ?(any[]),
    dragStartGroundCoords: ?any
  ): { editAction: ?any, cancelMapPan: boolean } {
    const { editAction, cancelMapPan } = super.onPointerMove(
      groundCoords,
      picks,
      isDragging,
      dragStartPicks,
      dragStartGroundCoords
    );

    const geometry = this.getSelectedGeometry();
    if (
      this._mode === 'drawLineString' &&
      this._drawAtFront &&
      geometry &&
      geometry.type === 'LineString'
    ) {
      // Draw the extension line from the front instead of the back
      const startPosition = geometry.coordinates[0];

      this._setTentativeFeature({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [startPosition, groundCoords]
        }
      });
    }

    return { editAction, cancelMapPan };
  }
}

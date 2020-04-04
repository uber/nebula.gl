import { LineString } from '@nebula.gl/edit-modes';
import { generatePointsParallelToLinePoints } from '../utils';
import { PointerMoveEvent } from '../event-types';
import { EditAction } from './mode-handler';
import { ThreeClickPolygonHandler } from './three-click-polygon-handler';

// TODO edit-modes: delete handlers once EditMode fully implemented
export class DrawRectangleUsingThreePointsHandler extends ThreeClickPolygonHandler {
  handlePointerMove(
    event: PointerMoveEvent
  ): { editAction: EditAction | null | undefined; cancelMapPan: boolean } {
    const result = { editAction: null, cancelMapPan: false };
    const clickSequence = this.getClickSequence();

    if (clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    const groundCoords = event.groundCoords;

    if (clickSequence.length === 1) {
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [clickSequence[0], groundCoords],
        },
      });
    } else if (clickSequence.length === 2) {
      const lineString: LineString = {
        type: 'LineString',
        coordinates: clickSequence,
      };
      const [p1, p2] = clickSequence;
      const [p3, p4] = generatePointsParallelToLinePoints(p1, p2, groundCoords);

      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              // Draw a polygon containing all the points of the LineString,
              // then the points orthogonal to the lineString,
              // then back to the starting position
              ...lineString.coordinates,
              p3,
              p4,
              p1,
            ],
          ],
        },
      });
    }

    return result;
  }
}

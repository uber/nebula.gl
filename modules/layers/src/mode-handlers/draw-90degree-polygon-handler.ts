import destination from '@turf/destination';
import bearing from '@turf/bearing';
import lineIntersect from '@turf/line-intersect';
import turfDistance from '@turf/distance';
import { point, lineString } from '@turf/helpers';
import { Polygon, Position } from '@nebula.gl/edit-modes';
import { generatePointsParallelToLinePoints } from '../utils';
import { ClickEvent, PointerMoveEvent } from '../event-types';
import {
  EditAction,
  EditHandle,
  ModeHandler,
  getPickedEditHandle,
  getEditHandlesForGeometry,
} from './mode-handler';

// TODO edit-modes: delete handlers once EditMode fully implemented
export class Draw90DegreePolygonHandler extends ModeHandler {
  getEditHandles(picks?: Array<Record<string, any>>, groundCoords?: Position): EditHandle[] {
    let handles = super.getEditHandles(picks, groundCoords);

    const tentativeFeature = this.getTentativeFeature();
    if (tentativeFeature) {
      handles = handles.concat(getEditHandlesForGeometry(tentativeFeature.geometry, -1));
      // Slice off the handles that are are next to the pointer
      if (tentativeFeature && tentativeFeature.geometry.type === 'LineString') {
        // Remove the last existing handle
        handles = handles.slice(0, -1);
      } else if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
        // Remove the last existing handle
        handles = handles.slice(0, -1);
      }
    }

    return handles;
  }

  handlePointerMove({
    groundCoords,
  }: PointerMoveEvent): { editAction: EditAction | null | undefined; cancelMapPan: boolean } {
    const clickSequence = this.getClickSequence();
    const result = { editAction: null, cancelMapPan: false };

    if (clickSequence.length === 0) {
      // nothing to do yet
      return result;
    }

    const tentativeFeature = this.getTentativeFeature();
    if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
      clickSequence[clickSequence.length - 1] =
        tentativeFeature.geometry.coordinates[0][clickSequence.length - 1];
    } else if (tentativeFeature && tentativeFeature.geometry.type === 'LineString') {
      clickSequence[clickSequence.length - 1] =
        tentativeFeature.geometry.coordinates[clickSequence.length - 1];
    }

    let p3;
    if (clickSequence.length === 1) {
      p3 = groundCoords;
    } else {
      const p1 = clickSequence[clickSequence.length - 2];
      const p2 = clickSequence[clickSequence.length - 1];
      [p3] = generatePointsParallelToLinePoints(p1, p2, groundCoords);
    }

    if (clickSequence.length < 3) {
      // Draw a LineString connecting all the clicked points with the hovered point
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [...clickSequence, p3],
        },
      });
    } else {
      // Draw a Polygon connecting all the clicked points with the hovered point
      this._setTentativeFeature({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[...clickSequence, p3, clickSequence[0]]],
        },
      });
    }

    return result;
  }

  handleClick(event: ClickEvent): EditAction | null | undefined {
    super.handleClick(event);

    const { picks } = event;
    const tentativeFeature = this.getTentativeFeature();

    let editAction: EditAction | null | undefined = null;
    const clickedEditHandle = getPickedEditHandle(picks);

    if (tentativeFeature && tentativeFeature.geometry.type === 'Polygon') {
      const polygon: Polygon = tentativeFeature.geometry;

      if (
        clickedEditHandle &&
        clickedEditHandle.featureIndex === -1 &&
        (clickedEditHandle.positionIndexes[1] === 0 ||
          clickedEditHandle.positionIndexes[1] === polygon.coordinates[0].length - 3)
      ) {
        // They clicked the first or last point (or double-clicked), so complete the polygon
        const polygonToAdd: Polygon = {
          type: 'Polygon',
          coordinates: this.finalizedCoordinates([...polygon.coordinates[0]]),
        };

        this.resetClickSequence();
        this._setTentativeFeature(null);
        editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd);
      }
    }

    // Trigger pointer move right away in order for it to update edit handles (to support double-click)
    const fakePointerMoveEvent = {
      screenCoords: [-1, -1],
      groundCoords: event.groundCoords,
      picks: [],
      isDragging: false,
      pointerDownPicks: null,
      pointerDownScreenCoords: null,
      pointerDownGroundCoords: null,
      sourceEvent: null,
    };
    // @ts-ignore
    this.handlePointerMove(fakePointerMoveEvent);

    return editAction;
  }

  finalizedCoordinates(coords: Position[]) {
    // Remove the hovered position
    let coordinates = [[...coords.slice(0, -2), coords[0]]];
    let pt = this.getIntermediatePoint([...coords]);
    if (!pt) {
      // if intermediate point with 90 degree not available
      // try remove the last clicked point and get the intermediate point.
      const tc = [...coords];
      tc.splice(-3, 1);
      pt = this.getIntermediatePoint([...tc]);
      if (pt) {
        coordinates = [[...coords.slice(0, -3), pt, coords[0]]];
      }
    } else {
      coordinates = [[...coords.slice(0, -2), pt, coords[0]]];
    }
    return coordinates;
  }

  getIntermediatePoint(coordinates: Position[]) {
    let pt;
    if (coordinates.length > 4) {
      const [p1, p2] = [...coordinates];
      const angle1 = bearing(p1, p2);
      const p3 = coordinates[coordinates.length - 3];
      const p4 = coordinates[coordinates.length - 4];
      const angle2 = bearing(p3, p4);

      const angles = { first: [], second: [] };
      // calculate 3 right angle points for first and last points in lineString
      [1, 2, 3].forEach((factor) => {
        const newAngle1 = angle1 + factor * 90;
        // convert angles to 0 to -180 for anti-clock and 0 to 180 for clock wise
        angles.first.push(newAngle1 > 180 ? newAngle1 - 360 : newAngle1);
        const newAngle2 = angle2 + factor * 90;
        angles.second.push(newAngle2 > 180 ? newAngle2 - 360 : newAngle2);
      });

      const distance = turfDistance(point(p1), point(p3));
      // Draw imaginary right angle lines for both first and last points in lineString
      // If there is intersection point for any 2 lines, will be the 90 degree point.
      [0, 1, 2].forEach((indexFirst) => {
        const line1 = lineString([
          p1,
          destination(p1, distance, angles.first[indexFirst]).geometry.coordinates,
        ]);
        [0, 1, 2].forEach((indexSecond) => {
          const line2 = lineString([
            p3,
            destination(p3, distance, angles.second[indexSecond]).geometry.coordinates,
          ]);
          const fc = lineIntersect(line1, line2);
          if (fc && fc.features.length) {
            // found the intersect point
            pt = fc.features[0].geometry.coordinates;
          }
        });
      });
    }
    return pt;
  }
}

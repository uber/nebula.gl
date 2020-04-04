import nearestPointOnLine from '@turf/nearest-point-on-line';
import { point, lineString as toLineString } from '@turf/helpers';
import { Position, FeatureOf, Point, LineString } from '@nebula.gl/edit-modes';
import {
  recursivelyTraverseNestedArrays,
  nearestPointOnProjectedLine,
  NearestPointType,
} from '../utils';
import {
  ClickEvent,
  PointerMoveEvent,
  StartDraggingEvent,
  StopDraggingEvent,
} from '../event-types';
import {
  EditAction,
  EditHandle,
  ModeHandler,
  getPickedEditHandle,
  getEditHandlesForGeometry,
} from './mode-handler';

// TODO edit-modes: delete handlers once EditMode fully implemented
export class ModifyHandler extends ModeHandler {
  _lastPointerMovePicks: any;

  getEditHandles(picks?: Array<Record<string, any>>, groundCoords?: Position): EditHandle[] {
    let handles = [];
    const { features } = this.featureCollection.getObject();

    for (const index of this.getSelectedFeatureIndexes()) {
      if (index < features.length) {
        const { geometry } = features[index];
        handles.push(...getEditHandlesForGeometry(geometry, index));
      } else {
        console.warn(`selectedFeatureIndexes out of range ${index}`); // eslint-disable-line no-console,no-undef
      }
    }

    // intermediate edit handle
    if (picks && picks.length && groundCoords) {
      const existingEditHandle = picks.find(
        (pick) => pick.isEditingHandle && pick.object && pick.object.type === 'existing'
      );
      // don't show intermediate point when too close to an existing edit handle
      const featureAsPick = !existingEditHandle && picks.find((pick) => !pick.isEditingHandle);

      // is the feature in the pick selected
      if (
        featureAsPick &&
        !featureAsPick.object.geometry.type.includes('Point') &&
        this.getSelectedFeatureIndexes().includes(featureAsPick.index)
      ) {
        let intermediatePoint: NearestPointType | null | undefined = null;
        let positionIndexPrefix = [];
        const referencePoint = point(groundCoords);
        // process all lines of the (single) feature
        recursivelyTraverseNestedArrays(
          featureAsPick.object.geometry.coordinates,
          [],
          (lineString, prefix) => {
            const lineStringFeature = toLineString(lineString);

            const candidateIntermediatePoint = this.nearestPointOnLine(
              // @ts-ignore
              lineStringFeature,
              referencePoint
            );
            if (
              !intermediatePoint ||
              candidateIntermediatePoint.properties.dist < intermediatePoint.properties.dist
            ) {
              intermediatePoint = candidateIntermediatePoint;
              positionIndexPrefix = prefix;
            }
          }
        );
        // tack on the lone intermediate point to the set of handles
        if (intermediatePoint) {
          const {
            geometry: { coordinates: position },
            properties: { index },
          } = intermediatePoint;
          handles = [
            ...handles,
            {
              position,
              positionIndexes: [...positionIndexPrefix, index + 1],
              featureIndex: featureAsPick.index,
              type: 'intermediate',
            },
          ];
        }
      }
    }

    return handles;
  }

  // turf.js does not support elevation for nearestPointOnLine
  nearestPointOnLine(line: FeatureOf<LineString>, inPoint: FeatureOf<Point>): NearestPointType {
    const { coordinates } = line.geometry;
    if (coordinates.some((coord) => coord.length > 2)) {
      const modeConfig = this.getModeConfig();
      if (modeConfig && modeConfig.viewport) {
        // This line has elevation, we need to use alternative algorithm
        return nearestPointOnProjectedLine(line, inPoint, modeConfig.viewport);
      }
      // eslint-disable-next-line no-console,no-undef
      console.log(
        'Editing 3D point but modeConfig.viewport not provided. Falling back to 2D logic.'
      );
    }

    return nearestPointOnLine(line, inPoint);
  }

  handleClick(event: ClickEvent): EditAction | null | undefined {
    let editAction: EditAction | null | undefined = null;

    const clickedEditHandle = getPickedEditHandle(event.picks);

    if (clickedEditHandle && clickedEditHandle.featureIndex >= 0) {
      if (clickedEditHandle.type === 'existing') {
        let updatedData;
        try {
          updatedData = this.getImmutableFeatureCollection()
            .removePosition(clickedEditHandle.featureIndex, clickedEditHandle.positionIndexes)
            .getObject();
        } catch (ignored) {
          // This happens if user attempts to remove the last point
        }

        if (updatedData) {
          editAction = {
            updatedData,
            editType: 'removePosition',
            featureIndexes: [clickedEditHandle.featureIndex],
            editContext: {
              positionIndexes: clickedEditHandle.positionIndexes,
              position: clickedEditHandle.position,
            },
          };
        }
      } else if (clickedEditHandle.type === 'intermediate') {
        const updatedData = this.getImmutableFeatureCollection()
          .addPosition(
            clickedEditHandle.featureIndex,
            clickedEditHandle.positionIndexes,
            clickedEditHandle.position
          )
          .getObject();

        if (updatedData) {
          editAction = {
            updatedData,
            editType: 'addPosition',
            featureIndexes: [clickedEditHandle.featureIndex],
            editContext: {
              positionIndexes: clickedEditHandle.positionIndexes,
              position: clickedEditHandle.position,
            },
          };
        }
      }
    }
    return editAction;
  }

  handlePointerMove(
    event: PointerMoveEvent
  ): { editAction: EditAction | null | undefined; cancelMapPan: boolean } {
    this._lastPointerMovePicks = event.picks;

    let editAction: EditAction | null | undefined = null;

    const editHandle = getPickedEditHandle(event.pointerDownPicks);

    if (event.isDragging && editHandle) {
      const updatedData = this.getImmutableFeatureCollection()
        .replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'movePosition',
        featureIndexes: [editHandle.featureIndex],
        editContext: {
          positionIndexes: editHandle.positionIndexes,
          position: event.groundCoords,
        },
      };
    }

    // Cancel map panning if pointer went down on an edit handle
    const cancelMapPan = Boolean(editHandle);

    return { editAction, cancelMapPan };
  }

  handleStartDragging(event: StartDraggingEvent): EditAction | null | undefined {
    let editAction: EditAction | null | undefined = null;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();

    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle && editHandle.type === 'intermediate') {
      const updatedData = this.getImmutableFeatureCollection()
        .addPosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'addPosition',
        featureIndexes: [editHandle.featureIndex],
        editContext: {
          positionIndexes: editHandle.positionIndexes,
          position: event.groundCoords,
        },
      };
    }

    return editAction;
  }

  handleStopDragging(event: StopDraggingEvent): EditAction | null | undefined {
    let editAction: EditAction | null | undefined = null;

    const selectedFeatureIndexes = this.getSelectedFeatureIndexes();
    const editHandle = getPickedEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle) {
      const updatedData = this.getImmutableFeatureCollection()
        .replacePosition(editHandle.featureIndex, editHandle.positionIndexes, event.groundCoords)
        .getObject();

      editAction = {
        updatedData,
        editType: 'finishMovePosition',
        featureIndexes: [editHandle.featureIndex],
        editContext: {
          positionIndexes: editHandle.positionIndexes,
          position: event.groundCoords,
        },
      };
    }

    return editAction;
  }

  getCursor({ isDragging }: { isDragging: boolean }): string {
    const picks = this._lastPointerMovePicks;

    if (picks && picks.length > 0) {
      const handlePicked = picks.some((pick) => pick.isEditingHandle);
      if (handlePicked) {
        return 'cell';
      }
    }

    return isDragging ? 'grabbing' : 'grab';
  }
}

import bearing from '@turf/bearing';
import {
  generatePointsParallelToLinePoints,
  getPickedEditHandle,
  getPickedIntermediateEditHandle,
} from '../utils';
import { FeatureCollection } from '../geojson-types';
import { ModeProps, StartDraggingEvent, StopDraggingEvent, DraggingEvent } from '../types';
import { ModifyMode } from './modify-mode';
import { ImmutableFeatureCollection } from './immutable-feature-collection';

export class ExtrudeMode extends ModifyMode {
  // this mode is busted =(

  isPointAdded = false;

  handleDragging(event: DraggingEvent, props: ModeProps<FeatureCollection>): void {
    const editHandle = getPickedEditHandle(event.pointerDownPicks);

    if (editHandle) {
      const { featureIndex } = editHandle.properties;
      let { positionIndexes } = editHandle.properties;

      const size = this.coordinatesSize(positionIndexes, featureIndex, props.data);
      positionIndexes = this.isPointAdded
        ? this.nextPositionIndexes(positionIndexes, size)
        : positionIndexes;
      // p1 and p1 are end points for edge
      const p1 = this.getPointForPositionIndexes(
        this.prevPositionIndexes(positionIndexes, size),
        featureIndex,
        props.data
      );
      const p2 = this.getPointForPositionIndexes(positionIndexes, featureIndex, props.data);
      if (p1 && p2) {
        // p3 and p4 are end points for moving (extruding) edge
        const [p3, p4] = generatePointsParallelToLinePoints(p1, p2, event.mapCoords);

        const updatedData = new ImmutableFeatureCollection(props.data)
          .replacePosition(featureIndex, this.prevPositionIndexes(positionIndexes, size), p4)
          .replacePosition(featureIndex, positionIndexes, p3)
          .getObject();

        props.onEdit({
          updatedData,
          editType: 'extruding',
          editContext: {
            featureIndexes: [featureIndex],
            positionIndexes: this.nextPositionIndexes(positionIndexes, size),
            position: p3,
          },
        });

        event.cancelPan();
      }
    }
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    const selectedFeatureIndexes = props.selectedIndexes;

    const editHandle = getPickedIntermediateEditHandle(event.picks);
    if (selectedFeatureIndexes.length && editHandle) {
      const { positionIndexes, featureIndex } = editHandle.properties;

      const size = this.coordinatesSize(positionIndexes, featureIndex, props.data);
      // p1 and p1 are end points for edge
      const p1 = this.getPointForPositionIndexes(
        this.prevPositionIndexes(positionIndexes, size),
        featureIndex,
        props.data
      );
      const p2 = this.getPointForPositionIndexes(positionIndexes, featureIndex, props.data);

      if (p1 && p2) {
        let updatedData = new ImmutableFeatureCollection(props.data);
        if (!this.isOrthogonal(positionIndexes, featureIndex, size, props.data)) {
          updatedData = updatedData.addPosition(featureIndex, positionIndexes, p2);
        }
        if (
          !this.isOrthogonal(
            this.prevPositionIndexes(positionIndexes, size),
            featureIndex,
            size,
            props.data
          )
        ) {
          updatedData = updatedData.addPosition(featureIndex, positionIndexes, p1);
          this.isPointAdded = true;
        }

        props.onEdit({
          updatedData: updatedData.getObject(),
          editType: 'startExtruding',
          editContext: {
            featureIndexes: [featureIndex],
            positionIndexes,
            position: p1,
          },
        });
      }
    }
  }

  handleStopDragging(event: StopDraggingEvent, props: ModeProps<FeatureCollection>) {
    const selectedFeatureIndexes = props.selectedIndexes;
    const editHandle = getPickedEditHandle(event.pointerDownPicks);
    if (selectedFeatureIndexes.length && editHandle) {
      const { featureIndex } = editHandle.properties;
      let { positionIndexes } = editHandle.properties;

      const size = this.coordinatesSize(positionIndexes, featureIndex, props.data);
      positionIndexes = this.isPointAdded
        ? this.nextPositionIndexes(positionIndexes, size)
        : positionIndexes;
      // p1 and p1 are end points for edge
      const p1 = this.getPointForPositionIndexes(
        this.prevPositionIndexes(positionIndexes, size),
        featureIndex,
        props.data
      );
      const p2 = this.getPointForPositionIndexes(positionIndexes, featureIndex, props.data);

      if (p1 && p2) {
        // p3 and p4 are end points for new moved (extruded) edge
        const [p3, p4] = generatePointsParallelToLinePoints(p1, p2, event.mapCoords);

        const updatedData = new ImmutableFeatureCollection(props.data)
          .replacePosition(featureIndex, this.prevPositionIndexes(positionIndexes, size), p4)
          .replacePosition(featureIndex, positionIndexes, p3)
          .getObject();

        props.onEdit({
          updatedData,
          editType: 'extruded',
          editContext: {
            featureIndexes: [featureIndex],
            positionIndexes,
            position: p3,
          },
        });
      }
    }
    this.isPointAdded = false;
  }

  coordinatesSize(
    positionIndexes: number[] | null | undefined,
    featureIndex: number,
    { features }: FeatureCollection
  ) {
    let size = 0;
    if (Array.isArray(positionIndexes)) {
      const feature = features[featureIndex];
      const coordinates: any = feature.geometry.coordinates;
      // for Multi polygons, length will be 3
      if (positionIndexes.length === 3) {
        const [a, b] = positionIndexes;
        if (coordinates.length && coordinates[a].length) {
          size = coordinates[a][b].length;
        }
      } else {
        const [b] = positionIndexes;
        if (coordinates.length && coordinates[b].length) {
          size = coordinates[b].length;
        }
      }
    }
    return size;
  }

  getBearing(p1: any, p2: any) {
    const angle = bearing(p1, p2);
    if (angle < 0) {
      return Math.floor(360 + angle);
    }
    return Math.floor(angle);
  }

  isOrthogonal(
    positionIndexes: number[] | null | undefined,
    featureIndex: number,
    size: number,
    features: FeatureCollection
  ) {
    if (!Array.isArray(positionIndexes)) {
      return false;
    }
    if (positionIndexes[positionIndexes.length - 1] === size - 1) {
      positionIndexes[positionIndexes.length - 1] = 0;
    }
    const prevPoint = this.getPointForPositionIndexes(
      this.prevPositionIndexes(positionIndexes, size),
      featureIndex,
      features
    );
    const nextPoint = this.getPointForPositionIndexes(
      this.nextPositionIndexes(positionIndexes, size),
      featureIndex,
      features
    );
    const currentPoint = this.getPointForPositionIndexes(positionIndexes, featureIndex, features);
    const prevAngle = this.getBearing(currentPoint, prevPoint);
    const nextAngle = this.getBearing(currentPoint, nextPoint);
    return [89, 90, 91, 269, 270, 271].includes(Math.abs(prevAngle - nextAngle));
  }

  nextPositionIndexes(positionIndexes: number[] | null | undefined, size: number): number[] {
    if (!Array.isArray(positionIndexes)) {
      return [];
    }
    const next = [...positionIndexes];
    if (next.length) {
      next[next.length - 1] = next[next.length - 1] === size - 1 ? 0 : next[next.length - 1] + 1;
    }
    return next;
  }

  prevPositionIndexes(positionIndexes: number[] | null | undefined, size: number): number[] {
    if (!Array.isArray(positionIndexes)) {
      return [];
    }
    const prev = [...positionIndexes];
    if (prev.length) {
      prev[prev.length - 1] = prev[prev.length - 1] === 0 ? size - 2 : prev[prev.length - 1] - 1;
    }
    return prev;
  }

  getPointForPositionIndexes(
    positionIndexes: number[] | null | undefined,
    featureIndex: number,
    { features }: FeatureCollection
  ) {
    let p1;
    if (Array.isArray(positionIndexes)) {
      const feature = features[featureIndex];
      const coordinates: any = feature.geometry.coordinates;
      // for Multi polygons, length will be 3
      if (positionIndexes.length === 3) {
        const [a, b, c] = positionIndexes;
        if (coordinates.length && coordinates[a].length) {
          p1 = coordinates[a][b][c];
        }
      } else {
        const [b, c] = positionIndexes;
        if (coordinates.length && coordinates[b].length) {
          p1 = coordinates[b][c];
        }
      }
    }
    return p1;
  }
}

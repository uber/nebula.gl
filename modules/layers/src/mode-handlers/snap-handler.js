// @flow

import turfArea from '@turf/area';
import turfBearing from '@turf/bearing';
import turfCenter from '@turf/center';
import turfDistance from '@turf/distance';
import turfEnvelope from '@turf/envelope';
import { point as turfPoint } from '@turf/helpers';
import turfTransformTranslate from '@turf/transform-translate';

import type { FeatureCollection, Position } from '../geojson-types.js';
import { SortedList, SortType } from '../utils';
import type { EditHandle } from './mode-handler';
import { ModeHandler, getEditHandlesForGeometry } from './mode-handler';

export class SnapHandler extends ModeHandler {
  _pickedHandle: ?EditHandle;
  _potentialNonPickedHandle: ?EditHandle;
  _potentialSnapDistance: number;
  _snapAssociations: number[][];

  constructor(featureCollection?: FeatureCollection) {
    super(featureCollection);
    this._snapAssociations = [];
  }

  setPickedHandle(handle: ?EditHandle) {
    this._pickedHandle = handle;
  }

  clearCachedHandles() {
    this._pickedHandle = null;
    this._potentialNonPickedHandle = null;
  }

  updatePickedHandlePosition(index: number, updatedGeometry: any) {
    if (this._pickedHandle) {
      const { positionIndexes, featureIndex } = this._pickedHandle;
      if (index >= 0 && featureIndex !== index) return;

      const { coordinates } = updatedGeometry;
      (this._pickedHandle || {}).position = positionIndexes.reduce(
        (a: any[], b: number) => a[b],
        coordinates
      );
    }
  }

  getFeatureFromHandle(handle: ?EditHandle): ?any {
    if (!handle) return null;
    const { featureIndex } = handle;
    const { features } = this.featureCollection.getObject();
    if (featureIndex >= features.length) {
      console.warn(`featureCollection features out of range ${featureIndex}`); // eslint-disable-line no-console,no-undef
      return null;
    }
    return features[featureIndex];
  }

  _getNonPickedIntermediateHandles(): EditHandle[] {
    const handles = [];
    const { features } = this.featureCollection.getObject();

    for (let i = 0; i < features.length; i++) {
      if (!this.getSelectedFeatureIndexes().includes(i) && i < features.length) {
        const { geometry } = features[i];
        handles.push(...getEditHandlesForGeometry(geometry, i, 'intermediate'));
      } else if (i >= features.length) {
        console.warn(`selectedFeatureIndexes out of range ${i}`); // eslint-disable-line no-console,no-undef
      }
    }
    return handles;
  }

  // If no snap handle has been picked, only display the edit handles of the
  // selected feature. If a snap handle has been picked, display said snap handle
  // along with all snappable points on all non-selected features.
  getEditHandles(picks?: Array<Object>, groundCoords?: Position): any[] {
    const { enablePolygonSnapping } = this.getModeConfig() || {};
    const handles = [];
    if (!enablePolygonSnapping) return handles;

    if (this._pickedHandle) {
      handles.push(...this._getNonPickedIntermediateHandles(), this._pickedHandle);

      const nonPickedFeature = this.getFeatureFromHandle(this._potentialNonPickedHandle);
      if (nonPickedFeature) {
        handles.push(this._potentialNonPickedHandle);
      }
      return handles;
    }

    const { features } = this.featureCollection.getObject();
    for (const index of this.getSelectedFeatureIndexes()) {
      if (index < features.length) {
        const { geometry } = features[index];
        handles.push(...getEditHandlesForGeometry(geometry, index, 'snap'));
      } else {
        console.warn(`selectedFeatureIndexes out of range ${index}`); // eslint-disable-line no-console,no-undef
      }
    }

    return handles;
  }

  // Get the indexes of polygons closest to the selected feature. The numberToTrack
  // optional parameter dictates how many polygons to track e.g. a numberToTrack = 3
  // will result in the 3 closest polygon indexes being returned by this method. These
  // polygons will be candidates for snapping.
  _getNearestPolygonIndexes(options: ?{ numberOfPolygonsToTrack: number }): any[] {
    let arraySize = 1;
    if (options) {
      arraySize = options.numberOfPolygonsToTrack;
    }
    const selectedIndexes = this.getSelectedFeatureIndexes();
    const minDistanceArray = new SortedList({
      arraySize,
      getValueToCompareFn: val => val.distance,
      sortType: SortType.MIN
    });

    const { features } = this.featureCollection.getObject();
    const selectedFeature = this.getFeatureFromHandle(this._pickedHandle);

    if (selectedFeature) {
      const selectedCenter = turfCenter(selectedFeature);

      for (let i = 0; i < features.length; i++) {
        const currentFeature = features[i];
        if (!selectedIndexes.includes(i)) {
          const currentFeatureCenter = turfCenter(currentFeature);
          const distance = turfDistance(currentFeatureCenter, selectedCenter);
          minDistanceArray.push({ distance, index: i });
        }
      }
    }
    return minDistanceArray.toArray().map(details => details.index);
  }

  // Scale the snapping strength directly proportional to the selected polygon's size
  getSnapStrengthModifier(): number {
    if (this._pickedHandle) {
      const selectedFeature = this.getFeatureFromHandle(this._pickedHandle);

      if (selectedFeature) {
        // Using @turf/envelope helps normalize the area of different polygon shapes/types
        // (i.e. polygon with holes, ciruclar polygons, etc.)
        const envelope = turfEnvelope(selectedFeature);
        const area = turfArea(envelope.geometry);
        return Math.pow(area, 0.45) / 2000;
      }
    }
    return 1;
  }

  _hasSelectedBeenSnapped(): boolean {
    const selectedIndexes = this.getSelectedFeatureIndexes();
    if (!selectedIndexes.length) return false;
    return selectedIndexes
      .map(index => this._snapAssociations[index])
      .some(assoc => assoc && assoc.length);
  }

  _areAllSnapAssociatesSelected() {
    const selectedIndexes = this.getSelectedFeatureIndexes();
    if (!selectedIndexes.length) {
      return true;
    }
    return selectedIndexes
      .map(index => this.getSnapAssociates(index))
      .every(indexes => indexes.every(index => selectedIndexes.includes(index)));
  }

  _isNonPickedAlreadySnappedToPicked() {
    if (this._pickedHandle && this._potentialNonPickedHandle) {
      const { featureIndex: nonPickedIndex } = this._potentialNonPickedHandle;

      const { featureIndex: pickedIndex } = this._pickedHandle || {};
      const snapAssociates = this.getSnapAssociates(pickedIndex);
      return snapAssociates.includes(nonPickedIndex);
    }
    return false;
  }

  shouldPerformSnap(): boolean {
    const { enablePolygonSnapping } = this.getModeConfig() || {};
    if (enablePolygonSnapping) {
      this._cacheClosestNonPickedHandle({ numberOfPolygonsToTrack: 100 });
      return !this._isNonPickedAlreadySnappedToPicked();
    }
    return false;
  }

  shouldPerformUnsnap(): boolean {
    return this._hasSelectedBeenSnapped() && !this._areAllSnapAssociatesSelected();
  }

  shouldPerformStandardModeAction(): boolean {
    return !this._hasSelectedBeenSnapped() || this._areAllSnapAssociatesSelected();
  }

  _cacheClosestNonPickedHandle(options?: { numberOfPolygonsToTrack: number }) {
    if (!this._pickedHandle) return;
    const nonPickedHandles = this._getNonPickedIntermediateHandles();

    // Calculate the closest handle from non-selected features to the picked handle
    let minDistance = Number.MAX_VALUE;
    let nearestNonPickedHandle;
    for (const handle of nonPickedHandles) {
      const distance = turfDistance(
        this._pickedHandle && this._pickedHandle.position,
        handle.position
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestNonPickedHandle = handle;
      }
    }

    // Store the closest non-picked handle and the distance from the picked handle
    if (nearestNonPickedHandle) {
      this._potentialNonPickedHandle = nearestNonPickedHandle;
    }
    this._potentialSnapDistance = minDistance;
  }

  // Cache the indexes of the polygons that have participated in a snap
  cacheSnapAssociates(index: number, partnerIndex: number) {
    // Cache index to partnerIndex association
    if (!this._snapAssociations[index]) {
      this._snapAssociations[index] = [];
    }
    this._snapAssociations[index].push(partnerIndex);

    // Cache partnerIndex to index association
    if (!this._snapAssociations[partnerIndex]) {
      this._snapAssociations[partnerIndex] = [];
    }
    this._snapAssociations[partnerIndex].push(index);
  }

  getSnapAssociates(index: number): number[] {
    return this._snapAssociations[index] || [];
  }

  // Clear all snap associations from the specified index
  clearSnapAssociates(index: number, associateIndex: number) {
    const snapPartnerIndexes = this._snapAssociations[index];
    if (!snapPartnerIndexes || !snapPartnerIndexes.length) return;

    const associatePartnerIndexes = this._snapAssociations[associateIndex];
    if (!associatePartnerIndexes || !associatePartnerIndexes.length) return;

    this._snapAssociations[index] = snapPartnerIndexes.filter(i => i !== associateIndex);
    this._snapAssociations[associateIndex] = associatePartnerIndexes.filter(i => i !== index);
  }

  calculateSnapIfWithinThreshold(
    snapStrength: number
  ): ?({ movedFeature: any, selectedIndex: number }[]) {
    if (this._pickedHandle) {
      const modifiedSnapStrength = snapStrength * this.getSnapStrengthModifier();

      if (this._potentialSnapDistance <= modifiedSnapStrength && this._potentialNonPickedHandle) {
        const selectedFeatures = this.getSelectedFeaturesAsFeatureCollection();
        const selectedIndexes = this.getSelectedFeatureIndexes();

        const { position: pickedPosition } = this._pickedHandle || {};
        const { position: nonPickedPosition, featureIndex: nonPickedFeatureIndex } =
          this._potentialNonPickedHandle || {};

        // Calculate the post-snap position of the selected feature(s)
        const pickedHandlePoint = turfPoint(pickedPosition);
        const potentialSnapPoint = turfPoint(nonPickedPosition);
        const snapBearing = turfBearing(pickedHandlePoint, potentialSnapPoint);

        const movedFeatures = turfTransformTranslate(
          selectedFeatures,
          this._potentialSnapDistance,
          snapBearing
        );

        const postSnapPositions = [];

        for (let i = 0; i < selectedIndexes.length; i++) {
          const selectedIndex = selectedIndexes[i];
          const movedFeature = movedFeatures.features[i];
          postSnapPositions.push({
            movedFeature,
            selectedIndex
          });
        }

        const { featureIndex: selectedIndex } = this._pickedHandle || {};
        this.cacheSnapAssociates(selectedIndex, nonPickedFeatureIndex);

        return postSnapPositions;
      }
    }

    return null;
  }
}

// @flow

import turfArea from '@turf/area';
import turfBearing from '@turf/bearing';
import turfCenter from '@turf/center';
import turfDistance from '@turf/distance';
import turfEnvelope from '@turf/envelope';
import { point as turfPoint } from '@turf/helpers';
import { coordAll } from '@turf/meta';
import turfTransformTranslate from '@turf/transform-translate';

import type { Feature, FeatureCollection } from '../../geojson-types.js';
import { SortedList, SortType } from '../utils';
import { ModeHandler } from './mode-handler';

type SnapDetails = {
  snapDistance: number,
  selectedSnapPoint: Feature,
  nonSelectedSnapPoint: Feature,
  index?: number
};

export class SnapHandler extends ModeHandler {
  _renderSnapEditHandles: boolean;
  _selectedSnapPoint: Feature;
  _nonSelectedSnapPoint: Feature;
  _snapAssociations: number[][];

  constructor(featureCollection?: FeatureCollection) {
    super(featureCollection);
    this._snapAssociations = [];
  }

  renderSnapHandles() {
    this._renderSnapEditHandles = true;
  }

  hideSnapHandles() {
    this._renderSnapEditHandles = false;
  }

  getSnapEditHandleFromPoint(pointFeature: any) {
    const { geometry } = pointFeature || {};
    if (geometry) {
      return {
        position: geometry.coordinates,
        type: 'intermediate',
        // Dummy values for positionIndexes and featureIndex as these properties are not used
        positionIndexes: [-1],
        featureIndex: -1
      };
    }
    return null;
  }

  shouldRenderSnapHandles() {
    const { enablePolygonSnapping } = this.getModeConfig() || {};
    return enablePolygonSnapping && this.isSinglePolygonSelected() && this._renderSnapEditHandles;
  }

  getEditHandles() {
    if (this.shouldRenderSnapHandles()) {
      return [
        this.getSnapEditHandleFromPoint(this._selectedSnapPoint),
        this.getSnapEditHandleFromPoint(this._nonSelectedSnapPoint)
      ].filter(Boolean);
    }
    return [];
  }

  // Get the indexes of polygons closest to the selected feature. The numberToTrack
  // optional parameter dictates how many polygons to track e.g. a numberToTrack = 3
  // will result in the 3 closest polygon indexes being returned by this method. These
  // polygons will be candidates for snapping.
  getNearestPolygonIndexes(options: ?{ [key: string]: any }) {
    let arraySize = 1;
    if (options) {
      arraySize = options.numberToTrack;
    }
    const [selectedIndex] = this.getSelectedFeatureIndexes();
    const minDistanceArray = new SortedList({
      arraySize,
      getValueToCompareFn: val => val.distance,
      sortType: SortType.MIN
    });

    const allFeatures = this.getImmutableFeatureCollection().getObject().features;
    const selectedCenter = turfCenter(this.getSelectedFeature());

    for (let i = 0; i < allFeatures.length; i++) {
      const currentFeature = allFeatures[i];
      if (i !== selectedIndex && currentFeature.geometry.type === 'Polygon') {
        const currentFeatureCenter = turfCenter(currentFeature);
        const distance = turfDistance(currentFeatureCenter, selectedCenter);
        minDistanceArray.push({ distance, index: i });
      }
    }
    return minDistanceArray.toArray().map(details => details.index);
  }

  isSinglePolygonSelected() {
    const selectedIndexes = this.getSelectedFeatureIndexes();
    const selectedFeature = this.getSelectedFeature();
    if (selectedFeature) {
      return selectedIndexes.length === 1 && selectedFeature.geometry.type === 'Polygon';
    }
    return false;
  }

  // Scale the snapping strength directly proportional to the selected polygon's size
  getSnapStrengthModifier() {
    const selectedFeature = this.getSelectedFeature();
    if (selectedFeature) {
      // Using @turf/envelope helps normalize the area of different polygon shapes/types
      // (i.e. polygon with holes, ciruclar polygons, etc.)
      const envelope = turfEnvelope(selectedFeature);
      const area = turfArea(envelope.geometry);
      return Math.pow(area, 0.45) / 2000;
    }
    return 1;
  }

  hasSelectedBeenSnapped() {
    const [selectedIndex] = this.getSelectedFeatureIndexes();
    const snapPoints = this._snapAssociations[selectedIndex];
    return snapPoints ? snapPoints.length : false;
  }

  shouldPerformSnap() {
    const { enablePolygonSnapping } = this.getModeConfig() || {};
    return (
      enablePolygonSnapping && this.isSinglePolygonSelected() && !this.hasSelectedBeenSnapped()
    );
  }

  shouldPerformUnsnap() {
    return this.isSinglePolygonSelected() && this.hasSelectedBeenSnapped();
  }

  shouldPerformStandardModeAction() {
    return !this.isSinglePolygonSelected() || !this.hasSelectedBeenSnapped();
  }

  _getLocalMinimumDistanceSnap(selectedVertexes: any[], nonSelectedVertexes: any[]): ?SnapDetails {
    let minSnapDistance = Number.MAX_VALUE;
    let snapDetails;

    for (const selectedVertex of selectedVertexes) {
      for (const nonSelectedVertex of nonSelectedVertexes) {
        const vertexDistance = turfDistance(selectedVertex, nonSelectedVertex);
        if (vertexDistance < minSnapDistance) {
          minSnapDistance = vertexDistance;

          snapDetails = {
            snapDistance: vertexDistance,
            selectedSnapPoint: selectedVertex,
            nonSelectedSnapPoint: nonSelectedVertex
          };
        }
      }
    }
    return snapDetails;
  }

  // Calculates the closest vertexes from both the selected polygon and
  // the non-selected polygon candidates passed in through polygonIndexes
  // method paramter.
  getSnapDetailsFromCandidates(polygonIndexes: number[]) {
    const selectedPolyon = this.getSelectedFeature();
    const selectedVertexes = coordAll(selectedPolyon).map(turfPoint);

    let minSnapDistance = Number.MAX_VALUE;
    let snapDetails;

    const { features } = this.getFeatureCollection();

    for (const index of polygonIndexes) {
      const polygon = features[index];
      const nonSelectedVertexes = coordAll(polygon).map(turfPoint);

      const localMinDistanceSnap = this._getLocalMinimumDistanceSnap(
        selectedVertexes,
        nonSelectedVertexes
      );

      const { snapDistance } = localMinDistanceSnap || {};
      if (snapDistance < minSnapDistance) {
        minSnapDistance = snapDistance;
        snapDetails = { ...localMinDistanceSnap, index };
      }
    }

    const { selectedSnapPoint, nonSelectedSnapPoint } = snapDetails || {};
    // Cache snap points for edit handle rendering
    this._selectedSnapPoint = selectedSnapPoint;
    this._nonSelectedSnapPoint = nonSelectedSnapPoint;
    return snapDetails;
  }

  // Calculate the final post-snap position of the selected polygon
  calculateSnapMove(snapDetails: Object, snapStrength: number) {
    if (snapDetails) {
      const { nonSelectedSnapPoint, selectedSnapPoint, snapDistance, index } = snapDetails;
      const snapStrengthModifier = this.getSnapStrengthModifier();

      if (snapDistance <= snapStrength * snapStrengthModifier) {
        const [selectedIndex] = this.getSelectedFeatureIndexes();
        const selectedFeature = this.getSelectedFeature();

        const snapBearing = turfBearing(selectedSnapPoint, nonSelectedSnapPoint);
        const movedPolygon = turfTransformTranslate(selectedFeature, snapDistance, snapBearing);
        this.cacheSnapAssociates(index, selectedIndex);

        // Post snap, both _selectedSnapPoint and _nonSelectedSnapPoint will equal
        // to nonSelectedSnapPoint
        this._selectedSnapPoint = nonSelectedSnapPoint;
        this._nonSelectedSnapPoint = nonSelectedSnapPoint;

        return {
          movedPolygon,
          selectedIndex
        };
      }
    }
    return null;
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

  getSnapAssociates(index: number) {
    return this._snapAssociations[index] || [];
  }

  // Clear all snap associations from the specified index
  clearSnapAssociates(index: number) {
    const snapPartnerIndexes = this._snapAssociations[index];
    if (!snapPartnerIndexes || !snapPartnerIndexes.length) return;

    // Clear the specified index from all associated partners
    for (const partnerIndex of snapPartnerIndexes) {
      const associatesOfPartner = this._snapAssociations[partnerIndex];
      if (associatesOfPartner) {
        this._snapAssociations[partnerIndex] = associatesOfPartner.filter(i => i !== index);
      }
    }

    // Clear all associations from index
    if (this._snapAssociations[index]) {
      this._snapAssociations[index] = [];
    }
  }
}

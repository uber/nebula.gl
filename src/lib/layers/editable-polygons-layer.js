// @flow
import { point, polygon, multiPolygon } from '@turf/helpers';

import LayerMouseEvent from '../layer-mouse-event';
import Feature from '../feature';

import PolygonsLayer from './polygons-layer';
import EditableJunctionsLayer from './editable-junctions-layer';

function deepCopyCoords(c) {
  if (Array.isArray(c)) {
    return c.map(deepCopyCoords);
  }

  return c;
}

export default class EditablePolygonsLayer extends PolygonsLayer {
  editableJunctionsLayer: EditableJunctionsLayer;
  // determines which polygon will show handles for editing
  selectedPolygonId: ?string;
  // determines which polygon of a MultiPolygon is used
  selectedSubPolygonIndex: ?number;

  constructor(config: Object) {
    super(config);
    this.editableJunctionsLayer = new EditableJunctionsLayer({
      getData: this._getEditingHandles,
      toNebulaFeature: data =>
        new Feature(data.geoJson, {
          outlineRadiusMeters: 20,
          pointRadiusMeters: 20,
          fillColor: [1, 1, 1, 1],
          outlineColor: [0, 0, 0, 1]
        }),
      on: {
        editStart: (nebulaMouseEvent: LayerMouseEvent, { cancelEdit, original }) => {
          const { selectedPolygonId, selectedSubPolygonIndex, usingSubPolygon } = original.editInfo;
          const feature = this.deckCache.getDeckObjectById(selectedPolygonId);
          if (feature) {
            // copy to prevent editing the original
            if (usingSubPolygon) {
              feature.geoJson = multiPolygon(deepCopyCoords(feature.geoJson.geometry.coordinates));
            } else {
              feature.geoJson = polygon(deepCopyCoords(feature.geoJson.geometry.coordinates));
            }
          }

          this.emit('editStart', nebulaMouseEvent, {
            cancelEdit,
            id: selectedPolygonId,
            index: usingSubPolygon ? selectedSubPolygonIndex : null
          });
        },
        editUpdate: (nebulaMouseEvent: LayerMouseEvent, { original }) => {
          const {
            selectedPolygonId,
            selectedSubPolygonIndex,
            usingSubPolygon,
            oIndex,
            iIndex
          } = original.editInfo;
          const feature = this.deckCache.getDeckObjectById(selectedPolygonId);
          if (feature) {
            let polygonCoords = feature.geoJson.geometry.coordinates;
            if (usingSubPolygon) {
              polygonCoords = polygonCoords[selectedSubPolygonIndex];
            }
            polygonCoords = polygonCoords[oIndex];

            polygonCoords[iIndex] = nebulaMouseEvent.groundPoint;
            if (iIndex === 0) {
              // first and last point must match
              polygonCoords[polygonCoords.length - 1] = nebulaMouseEvent.groundPoint;
            }

            this.emit('editUpdate', nebulaMouseEvent, {
              id: selectedPolygonId,
              index: usingSubPolygon ? selectedSubPolygonIndex : null,
              feature
            });

            this.deckCache.triggerUpdate();
            // no need to call nebula.forceUpdate(), EditableJunctionsLayer will do it
          }
        },
        editEnd: (nebulaMouseEvent: LayerMouseEvent, { original }) => {
          const { selectedPolygonId } = original.editInfo;
          const feature = this.deckCache.getDeckObjectById(selectedPolygonId);
          this.emit('editEnd', nebulaMouseEvent, { feature, id: selectedPolygonId });

          this.deckCache.updateDeckObjectsByIds([selectedPolygonId]);
          // we need this after editEnd AND our update, so the edit handle renders
          // at the right place after the polygon is updated
          this.editableJunctionsLayer.deckCache.updateAllDeckObjects();
          // no need to call nebula.forceUpdate(), EditableJunctionsLayer will do it
        }
      }
    });
    this.helperLayers = [this.editableJunctionsLayer];
    this.selectedPolygonId = null;
  }

  _getEditingHandles = () => {
    const { selectedPolygonId, selectedSubPolygonIndex } = this;
    const result = [];

    if (!selectedPolygonId) {
      return result;
    }

    // only show edit handles for selectedPolygonId/selectedSubPolygonIndex
    const selPolygon = this.deckCache.getDeckObjectById(selectedPolygonId);
    if (selPolygon) {
      const { coordinates, type } = selPolygon.geoJson.geometry;

      let editCoords = coordinates;
      let usingSubPolygon = false;
      if (type === 'MultiPolygon' && this.supportMultiPolygon) {
        editCoords = coordinates[selectedSubPolygonIndex];
        usingSubPolygon = true;
      }

      // find all points including inner holes
      editCoords.forEach((oCoords, oIndex) => {
        oCoords.forEach((coord, iIndex) => {
          if (iIndex === oCoords.length - 1) {
            // skip last point, is the same as first
            return;
          }
          result.push({
            id: `${selectedPolygonId}_${oIndex}_${iIndex}`,
            editInfo: {
              selectedPolygonId,
              selectedSubPolygonIndex,
              usingSubPolygon,
              oIndex,
              iIndex
            },
            geoJson: point(coord)
          });
        });
      });
    }

    return result;
  };
}

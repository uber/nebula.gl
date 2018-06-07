// @flow
import { point, lineString } from '@turf/helpers';

import LayerMouseEvent from '../layer-mouse-event';
import Feature from '../feature';
import LinesLayer from './lines-layer';

import EditableJunctionsLayer from './editable-junctions-layer';

function deepCopyCoords(c) {
  if (Array.isArray(c)) {
    return c.map(deepCopyCoords);
  }

  return c;
}

export default class EditableLinesLayer extends LinesLayer {
  editableJunctionsLayer: EditableJunctionsLayer;
  // determines which line will show handles for editing
  selectedLineId: ?string;

  constructor(config: Object) {
    super(config);
    this.editableJunctionsLayer = new EditableJunctionsLayer({
      getData: this._getEditingHandles,
      toNebulaFeature: data =>
        new Feature(data.geoJson, {
          outlineRadiusMeters: 1,
          pointRadiusMeters: 2,
          fillColor: [1, 1, 1, 1],
          outlineColor: [0, 0, 0, 1]
        }),
      on: {
        editStart: (nebulaMouseEvent: LayerMouseEvent, { cancelEdit, original }) => {
          const { selectedLineId } = original.editInfo;
          const feature = this.deckCache.getDeckObjectById(selectedLineId);
          if (feature) {
            // copy to prevent editing the original
            feature.geoJson = lineString(deepCopyCoords(feature.geoJson.geometry.coordinates));
          }

          this.emit('editStart', nebulaMouseEvent, {
            cancelEdit,
            id: selectedLineId
          });
        },
        editUpdate: (nebulaMouseEvent: LayerMouseEvent, { original }) => {
          const { selectedLineId, junctionIndex } = original.editInfo;
          const feature = this.deckCache.getDeckObjectById(selectedLineId);
          if (feature) {
            const lineStringCoords = feature.geoJson.geometry.coordinates;
            lineStringCoords[junctionIndex] = nebulaMouseEvent.groundPoint;

            this.emit('editUpdate', nebulaMouseEvent, {
              id: selectedLineId,
              feature
            });

            this.deckCache.triggerUpdate();
            // no need to call nebula.forceUpdate(), EditableJunctionsLayer will do it
          }
        },
        editEnd: (nebulaMouseEvent: LayerMouseEvent, { original }) => {
          const { selectedLineId } = original.editInfo;
          const feature = this.deckCache.getDeckObjectById(selectedLineId);
          this.emit('editEnd', nebulaMouseEvent, { feature, id: selectedLineId });

          this.deckCache.updateDeckObjectsByIds([selectedLineId]);
          // we need this after editEnd AND our update, so the edit handle renders
          // at the right place after the linestring is updated
          this.editableJunctionsLayer.deckCache.updateAllDeckObjects();
          // no need to call nebula.forceUpdate(), EditableJunctionsLayer will do it
        }
      }
    });
    this.helperLayers = [this.editableJunctionsLayer];
    this.selectedLineId = null;
  }

  _getEditingHandles = () => {
    const { selectedLineId } = this;
    const result = [];

    // first line created will have id = 0
    if (selectedLineId === null) {
      return result;
    }
    // only show edit handles for selectedLineId/selectedSubLineIndex
    const selLine = this.deckCache.getDeckObjectById(selectedLineId);
    if (selLine) {
      const { coordinates } = selLine.geoJson.geometry;

      const editCoords = coordinates;

      editCoords.forEach((coords, junctionIndex) => {
        result.push({
          id: `${selectedLineId}_${junctionIndex}`,
          editInfo: {
            selectedLineId,
            junctionIndex
          },
          geoJson: point(coords)
        });
      });
    }

    return result;
  };
}

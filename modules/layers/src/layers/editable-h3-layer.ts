/* eslint-env browser */

import { H3ClusterLayer } from '@deck.gl/geo-layers';
import { ViewMode } from '@nebula.gl/edit-modes';
import { polyfill } from 'h3-js';
import EditableGeoJsonLayer from './editable-geojson-layer';
import EditableLayer from './editable-layer';

const DEFAULT_EDIT_MODE = ViewMode;
const DEFAULT_H3_RESOLUTION = 9;

const defaultProps = {
  mode: DEFAULT_EDIT_MODE,

  // EditableGeoJsonLayer
  geoJsonData: {},
  ...EditableGeoJsonLayer.defaultProps,

  // h3 layer
  h3Data: {},
  filled: false,
  stroked: true,
  lineWidthScale: 1,
  lineWidthMinPixels: 1,
  lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
  lineWidthUnits: 'pixels',
  getHexagons: (d) => d.hexIds,
  resolution: DEFAULT_H3_RESOLUTION,
};

export default class EditableH3Layer extends EditableLayer {
  static layerName = 'EditableH3Layer';
  static defaultProps = defaultProps;

  initializeState() {
    super.initializeState();

    this.setState({
      tentativeHexagonIDs: [],
    });
  }

  getDerivedHexagonIDs(coords) {
    return polyfill(coords, this.props.resolution, true);
  }

  renderLayers() {
    const layers: any = [
      new EditableGeoJsonLayer(
        this.getSubLayerProps({
          id: 'editable-geojson',

          mode: this.props.mode,
          data: {
            type: 'FeatureCollection',
            features: [],
          },
          selectedFeatureIndexes: this.props.selectedFeatureIndexes || [],

          onEdit: (editAction) => {
            const { editType, editContext } = editAction;

            switch (editType) {
              case 'updateTentativeFeature':
                // tentative feature updates, updated on every pointer move
                if (editContext.feature.geometry.type === 'Polygon') {
                  const coords = editContext.feature.geometry.coordinates;
                  const hexIDs = this.getDerivedHexagonIDs(coords);

                  this.setState({ tentativeHexagonIDs: hexIDs });
                }
                break;
              case 'addFeature':
                // once the shape is finished drawing, calculate final hexagons
                let finalHexagonIDs;
                const committedHexagonIDs = new Set(this.getHexIdsFromH3Data());
                const tentativeHexagonIDs = new Set(this.state.tentativeHexagonIDs);

                switch (this.props.modeConfig.booleanOperation) {
                  case 'union':
                    finalHexagonIDs = [
                      ...new Set([...committedHexagonIDs, ...tentativeHexagonIDs]),
                    ];
                    break;
                  case 'intersection':
                    finalHexagonIDs = [...committedHexagonIDs].filter((hexID: string) =>
                      tentativeHexagonIDs.has(hexID)
                    );
                    break;
                  case 'difference':
                    finalHexagonIDs = [...committedHexagonIDs].filter(
                      (hexID: string) => !tentativeHexagonIDs.has(hexID)
                    );
                    break;
                  default:
                    break;
                }

                this.setState({
                  tentativeHexagonIDs: [],
                });

                this.props.onEdit({ updatedData: finalHexagonIDs });
                break;
              default:
                break;
            }
          },
        })
      ),

      new H3ClusterLayer(
        this.getSubLayerProps({
          id: 'tentative-hexagons',
          data: [
            {
              count: this.state.tentativeHexagonIDs.length,
              hexIds: this.state.tentativeHexagonIDs,
            },
          ],
          getHexagons: (d) => d.hexIds,
        })
      ),
      new H3ClusterLayer(
        this.getSubLayerProps({
          id: 'hexagons',
          data: this.props.h3Data,
          getHexagons: this.props.getHexagons,
        })
      ),
    ];
    return layers;
  }

  // because h3Data is an array of hexagon data, we take the cumulative hexIds from all entries
  getHexIdsFromH3Data() {
    let cumulativeHexIds = [];
    this.props.h3Data.forEach(
      (h3Data) => (cumulativeHexIds = cumulativeHexIds.concat(h3Data.hexIds))
    );
    return cumulativeHexIds;
  }

  getCursor({ isDragging }: { isDragging: boolean }) {
    let { cursor } = this.state;
    if (!cursor) {
      // default cursor
      cursor = isDragging ? 'grabbing' : 'grab';
    }
    return cursor;
  }
}

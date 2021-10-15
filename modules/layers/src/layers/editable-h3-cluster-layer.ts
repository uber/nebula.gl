/* eslint-env browser */

import { H3ClusterLayer } from '@deck.gl/geo-layers';
import { ViewMode } from '@nebula.gl/edit-modes';
import { polyfill, geoToH3 } from 'h3-js';
import EditableGeoJsonLayer from './editable-geojson-layer';
import EditableLayer from './editable-layer';

const DEFAULT_EDIT_MODE = ViewMode;
const DEFAULT_H3_RESOLUTION = 9;
const EMPTY_FEATURE_COLLECTION = {
  type: 'FeatureCollection',
  features: [],
};

const defaultProps = {
  mode: DEFAULT_EDIT_MODE,

  // EditableGeoJsonLayer
  ...EditableGeoJsonLayer.defaultProps,

  // h3 layer
  data: [],
  selectedIndexes: [],
  filled: false,
  stroked: true,
  lineWidthScale: 1,
  lineWidthMinPixels: 1,
  lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
  lineWidthUnits: 'pixels',
  getHexagons: (d) => d.hexIds,
  getEditedCluster: (updatedHexagons, existingCluster) => {
    if (existingCluster) {
      return {
        ...existingCluster,
        hexIds: updatedHexagons,
      };
    }
    return {
      hexIds: updatedHexagons,
    };
  },
  resolution: DEFAULT_H3_RESOLUTION,
};

export default class EditableH3ClusterLayer extends EditableLayer {
  static layerName = 'EditableH3ClusterLayer';
  static defaultProps = defaultProps;

  initializeState() {
    super.initializeState();

    this.setState({
      tentativeHexagonIDs: [],
    });
  }

  // convert array of (lng, lat) coords to cluster of hexes
  getDerivedHexagonIDs(coords) {
    return polyfill(coords, this.props.resolution, true);
  }

  // convert pair of (lng, lat) coords into single hex
  getDerivedHexagonID(coords) {
    return geoToH3(coords[1], coords[0], this.props.resolution);
  }

  renderLayers() {
    const layers: any = [
      new EditableGeoJsonLayer(
        this.getSubLayerProps({
          id: 'editable-geojson',

          mode: this.props.mode,
          data: EMPTY_FEATURE_COLLECTION,
          selectedFeatureIndexes: [],

          onEdit: (editAction) => {
            const { editType, editContext } = editAction;

            switch (editType) {
              case 'updateTentativeFeature':
                // tentative feature updates, updated on every pointer move
                if (editContext.feature.geometry.type === 'Polygon') {
                  const coords = editContext.feature.geometry.coordinates;
                  const hexIDs = this.getDerivedHexagonIDs(coords);

                  this.setState({ tentativeHexagonIDs: hexIDs });
                } else if (editContext.feature.geometry.type === 'Point') {
                  const coords = editContext.feature.geometry.coordinates;
                  const hexID = this.getDerivedHexagonID(coords);

                  this.setState({ tentativeHexagonIDs: [hexID] });
                }
                break;
              case 'addFeature':
                const updatedData = [...this.props.data];
                const { modeConfig } = this.props;

                if (!modeConfig || !modeConfig.booleanOperation) {
                  // add new h3 cluster
                  updatedData.push(
                    this.props.getEditedCluster(this.state.tentativeHexagonIDs, null)
                  );
                } else if (this.props.selectedIndexes.length !== 1) {
                  // eslint-disable-next-line no-console,no-undef
                  console.warn('booleanOperation only supported for single cluster selection');
                } else {
                  // they're affecting a selected cluster
                  let finalHexagonIDs;
                  const committedHexagonIDs = new Set(this.getSelectedHexIDs());
                  const tentativeHexagonIDs = new Set(this.state.tentativeHexagonIDs);

                  switch (modeConfig.booleanOperation) {
                    case 'union':
                    default:
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
                  }

                  const selectedIndex = this.props.selectedIndexes[0];
                  const existingCluster = this.props.data[selectedIndex];
                  updatedData[selectedIndex] = this.props.getEditedCluster(
                    finalHexagonIDs,
                    existingCluster
                  );
                }

                this.setState({
                  tentativeHexagonIDs: [],
                });

                this.props.onEdit({ updatedData });

                break;
              default:
                break;
            }
          },
        })
      ),

      new H3ClusterLayer(
        this.getSubLayerProps({
          id: 'hexagons',
          data: this.props.data,
          getHexagons: this.props.getHexagons,
        })
      ),
      new H3ClusterLayer(
        this.getSubLayerProps({
          id: 'tentative-hexagons',
          data: [
            {
              hexIds: this.state.tentativeHexagonIDs,
            },
          ],
          getHexagons: (d) => d.hexIds,
        })
      ),
    ];
    return layers;
  }

  // because data is an array of hexagon data, we take the cumulative of all selected indexes,
  // using props.getHexagons to support multiple data types
  getSelectedHexIDs() {
    let cumulativeHexIDs = [];
    this.props.selectedIndexes.forEach((index) => {
      const selectedCluster = this.props.data[index];
      const hexIDs = this.props.getHexagons(selectedCluster);
      cumulativeHexIDs = cumulativeHexIDs.concat(hexIDs);
    });
    return cumulativeHexIDs;
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

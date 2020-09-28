/* eslint-env browser */

import { H3ClusterLayer } from '@deck.gl/geo-layers';
import { ViewMode } from '@nebula.gl/edit-modes';
import { polyfill, geoToH3 } from 'h3-js';
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
  data: [],
  selectedIndexes: [],
  filled: false,
  stroked: true,
  lineWidthScale: 1,
  lineWidthMinPixels: 1,
  lineWidthMaxPixels: Number.MAX_SAFE_INTEGER,
  lineWidthUnits: 'pixels',
  getHexagons: (d) => d.hexIds,
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
          data: {
            type: 'FeatureCollection',
            features: [],
          },
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
                // once the shape is finished drawing, calculate final hexagons

                // get selected h3 cluster to act upon
                // if there is more than 1 or 0 selected,
                // throw an error, since it is ambiguous how to proceed
                // TODO: Add support for getNewH3Cluster prop to create a new cluster if none exist
                if (
                  this.props.selectedIndexes.length > 1 ||
                  this.props.selectedIndexes.length === 0
                ) {
                  // eslint-disable-next-line no-console,no-undef
                  console.warn('booleanOperation only supported for single cluster selection');
                } else {
                  let finalHexagonIDs;
                  const committedHexagonIDs = new Set(this.getSelectedHexIDs());
                  const tentativeHexagonIDs = new Set(this.state.tentativeHexagonIDs);

                  const { modeConfig } = this.props;
                  switch (modeConfig && modeConfig.booleanOperation) {
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
                  this.props.onEdit({ updatedData: finalHexagonIDs });
                }

                this.setState({
                  tentativeHexagonIDs: [],
                });

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

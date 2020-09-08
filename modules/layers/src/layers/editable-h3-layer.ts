/* eslint-env browser */

import { CompositeLayer } from '@deck.gl/layers';

export default class EditableH3Layer extends CompositeLayer {
  static layerName = 'EditableH3Layer';
  static defaultProps = defaultProps;

  renderLayers() {
    // TODO: call this.getSubLayerProps({

    const layers: any = [
      new EditableGeoJsonLayer({
        data: [],
        onEdit: ({ updatedData }) => {
          const cells = getDerivedH3Cells(updatedData);
          if (!this.props.booleanOperation) {
            this.props.onEdit(cells);
          } else if ('union') {
            this.props.onEdit(this.props.data + cells);
          } else if ('union') {
            this.props.onEdit(this.props.data - cells);
          }
        },
      }),

      new H3Layer(
        this.getSubLayerProps({
          id: 'hexagons',
          data: this.props.data,
          color: this.props.colorH3,
        })
      ),

      // don't do this
      // new H3Layer({
      //   data: this.props.data,
      // }),
    ];

    return layers;
  }
}

function useState(stuff) {
  return [stuff, stuff];
}

export function MyComponent() {
  const [h3Cells, setH3Cells] = useState([]);

  const layer = new EditableH3Layer({
    data: h3Cells,
    onEdit: ({ updatedData }) => setH3Cells(updatedData),

    h3Resulution: 12,

    // when drawing new
    mode: DrawPolygonMode,

    // can do this
    // _subLayerProps: {
    //   hexagons: { color: 'red' }

    // no need to do this
    // colorPolygons: 'blue',
    // colorH3: 'red',

    // to add or remove from hexagons
    // booleanOperation: 'union' | 'difference'

    // this is the way EditableGeoJsonLayer does it
    // when you add to shape (union),
    // mode: DrawPolygonMode,
    // modeConfig: { booleanOperation: 'union' }

    // when you add to shape (difference),
    // mode: DrawPolygonMode,
    // modeConfig: { booleanOperation: 'union' }
  });
}

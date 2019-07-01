[![docs](https://i.imgur.com/BTVrsR4.jpg)](https://neb.gl)

`react-map-gl-draw` is a drawing library tailored for [`react-map-gl`](https://github.com/uber/react-map-gl).

# Getting started

## Running the example

1. `git clone git@github.com:uber/nebula.gl.git`
2. `cd nebula.gl`
3. `yarn`
4. `cd examples/react-map-gl-draw`
5. `yarn`
6. `export MapboxAccessToken='<Add your key>'`
7. `yarn start-local`
8. You can view/edit geometry.

## Installation

```
yarn add react-map-gl-draw
```

## Options 
- `mode` (String, Optional)
  - `EditorModes.READ_ONLY` - Not interactive. This is the default mode.
  - `EditorModes.SELECT_FEATURE` - Lets you select, delete, and drag features.
  - `EditorModes.EDIT_VERTEX` - Lets you select, delete, and drag vertices; and drag features.
  - `EditorModes.DRAW_PATH` - Lets you draw a GeoJson `LineString` feature.
  - `EditorModes.DRAW_POLYGON` - Lets you draw a GeoJson `Polygon` feature.
  - `EditorModes.DRAW_POINT` - Lets you draw a GeoJson `Point` feature.
  - `EditorModes.DRAW_RECTANGLE` - Lets you draw a `Rectangle` (represented as GeoJson `Polygon` feature).

- `selectedFeatureId` (String, Optional) - id of the selected feature. `EditorModes` assigns a unique id to each feature which is stored in `feature.properties.id`.
- `clickRadius` (Number, optional) - Radius to detect features around a hovered or clicked point. Default value is `0`

- `onSelect` (Function, Required) - callback when a feature is selected. Receives an object containing `selectedFeatureId`.
- `onUpdate` (Function, Required) - callback when anything is updated. Receives one argument `features` that is the updated list of GeoJSON features.

Feature object structure:
`react-map-gl-draw` is stateful component.
```js
{
  id, // an unique identified generated inside react-map-gl-draw library 
  geometry: {
    coordinates, // latitude longitude pairs of the geometry points
    type // geojson type, one of `Point`, `LineString`, or `Polygon`
  },
  properties: {
    renderType, // Mainly used for styling, one of `Point`, `LineString`, `Polygon`, or `Rectangle`. Different from `geometry.type`. i.e. a rectangle's renderType is `Rectangle`, and `geometry.type` is `Polygon`. An incomplete (not closed) Polygon's renderType is `Polygon`, `geometry.type` is `LineString`
    ...otherProps // other properties user passed in
  }
}
```

### Styling related Options
- `style` (Object, optional) - Customized css [style objects](https://reactjs.org/docs/dom-elements.html#style) apply to the editor. Default style includes width and height from current viewport.
  
- `getFeatureStyle` (Function, Optional) : Object - A function to style a feature, function parameters are 
  - `feature`: feature to style .
  - `state`: one of `SELECTED`, `HOVERED`, `INACTIVE`, `UNCOMMITTED`.
  
Returns is a map of [style objects](https://reactjs.org/docs/dom-elements.html#style) passed to SVG `path` elements.

- `getEditHandleStyle` (Function, Optional) : Object - A function to style an `editHandle, function parameters are 
  - `feature`: feature to style.
  - `index`: index of the editHandle vertex in the feature.
  - `state`: one of `SELECTED`, `HOVERED`, `INACTIVE`, `UNCOMMITTED`.
  
Returns is a map of [style objects](https://reactjs.org/docs/dom-elements.html#style) passed to SVG `circle` or `rect` elements.

- `getEditHandleShape` (String|Function, Optional): if is a string, should be one of `rect` or `circle`. If is a function, will receive the following parameters
  - `feature`: feature to style.
  - `index`: index of the editHandle vertex in the feature.
  - `state`: one of `SELECTED`, `HOVERED`, `INACTIVE`, `UNCOMMITTED`.

## Explanations
- `Feature`: any drawn shape, one of point, line, polygon or rectangle.
- `EditHandle`: vertex of the feature being edited.

### State related concepts:
- `INACTIVE`: neither selected nor hovered, default state of a complete `feature` or `editHandle`.
- `SELECTED`: being clicked or dragged. 
- `HOVERED`: hovered over by the mouse pointer.
- `UNCOMMITTED`: in the middle of drawing, not yet added to the feature being edited.

### Styling based on `state`:

![img](https://raw.githubusercontent.com/uber-common/deck.gl-data/master/nebula.gl/edit-handle.png)

As shown in the above image, for the feature currently being edited, 
- `getFeatureStyle({feature, state: SELECTED})` will be applied to the committed parts of the feature. (Green strokes)
- `getEditHandleStyle({state: SELECTED})` will be applied to the committed editHandle vertices.  (Vertices with black stroke)
- `getFeatureStyle({feature, state: UNCOMMITTED})` will be applied to the uncommitted parts of the feature. (Gray stroke) 
- `getEditHandleStyle({state: UNCOMMITTED})` will be applied to the uncommitted editHandle vertex. (Gray vertex)


## Code Example
```js
import React, { Component } from 'react';
import MapGL, {_MapContext as MapContext} from 'react-map-gl';
import MapGLDraw, { EditorModes } from 'react-map-gl-draw';

const MODES = [
  { id: EditorModes.EDIT_VERTEX, text: 'Select and Edit Feature'},
  { id: EditorModes.DRAW_POINT, text: 'Draw Point'},
  { id: EditorModes.DRAW_PATH, text: 'Draw Polyline'},
  { id: EditorModes.DRAW_POLYGON, text: 'Draw Polygon'},
  { id: EditorModes.DRAW_RECTANGLE, text: 'Draw Rectangle'}
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: 800,
        height: 600,
        longitude: -122.45,
        latitude: 37.78,
        zoom: 14
      },
      selectedMode: EditorModes.READ_ONLY,
      features: [],
      selectedFeatureId: null
    };
  }
  
  componentDidMount() {
    // add features
    const initialFeatures = [{...}];
    this._mapRef.add(initialFeatures);
  }
  
  _updateViewport = (viewport) => {
    this.setState({viewport});
  }
  
  _onSelect = ({ selectedFeatureId }) => {
    this.setState({ selectedFeatureId });
  };
  
  _onUpdate = features => {
    this.setState({
      features
    });
  };

  _switchMode = evt => {
    const selectedMode = evt.target.id === this.state.selectedMode ? EditorModes.READ_ONLY : evt.target.id;
    this.setState({
      selectedMode,
      selectedFeatureId: null
    });
  };
  
  _renderControlPanel = () => {
    return (
      <div style={{position: absolute, top: 0, right: 0, maxWidth: '320px'}}>
        <select onChange={this._switchMode}>
          <option value="">--Please choose a mode--</option>
          {MODES.map(mode => <option value={mode.id}>{mode.text}</option>)}
        </select>
      </div>
    );
  }
  
  _getEditHandleStyle = ({feature, featureState, vertexIndex, vertexState}) => {
    return {
      fill: vertexState === `SELECTED` ? '#000' : '#aaa',
      stroke: vertexState === `SELECTED` ? '#000' : 'none'
    }
  }
  
  _getFeatureStyle = ({feature, featureState}) => {
    return {
      stroke: featureState === `SELECTED` ? '#000' : 'none',
      fill: featureState === `SELECTED` ? '#080' : 'none',
      fillOpacity: 0.8
    }
  }

  render() {
    const { viewport, selectedMode, selectedFeatureId, features } = this.state;
    return (
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/uberdata/cive48w2e001a2imn5mcu2vrs"
        onViewportChange={this._updateViewport}
      >
        <MapGLDraw
          ref={_ => this._drawRef = _}
          mode={selectedMode}
          features={features}
          selectedFeatureId={selectedFeatureId}
          onSelect={this._onSelect}
          onUpdate={this._onUpdate}
          getEditHandleStyle={this._getEditHandleStyle}
          getFeatureStyle={this._getFeatureStyle}
        />
        {this._renderControlPanel()}
      </MapGL>
    );
  }
}
```

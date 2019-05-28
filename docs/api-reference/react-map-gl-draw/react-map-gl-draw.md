# RFC: react-map-gl-draw

## Background

react-map-gl currently does not support drawing functions. However, we have got a couple of [users](https://github.com/uber/react-map-gl/issues/725) interested in this capability. Also it is one of P0 features on Kepler.gl 2019 [roadmap](https://github.com/uber/kepler.gl/wiki/Kepler.gl-2019-Roadmap#allow-drawing-on-map-to-create-paths-and-polygons--). 

Although [Mapbox/mapbox-gl-draw](https://github.com/mapbox/mapbox-gl-draw) provides quite nice drawing and editing features, because of its manipulating internal states, it cannot work well with React / Redux  framework and therefore cannot be integrated with `react-map-gl`.
[vis.gl](http://vis.gl/) offers another geo editing library [Nebula.gl](http://neb.gl), but it is an overkill while adding heavy dependencies such as deck.gl.

## Proposal

`react-map-gl` can provide a `EditorModes`, starts from simple functions like the following.

### Options 

- `mode` (String, Optional) - `react-map-gl` is stateless, user has complete control of the `mode`.
  - `EditorModes.READ_ONLY` - Not interactive. This is the default mode.
  - `EditorModes.SELECT_FEATURE` - Lets you select, delete, and drag features.
  - `EditorModes.EDIT_VERTEX` - Lets you select, delete, and drag vertices; and drag features.
  - `EditorModes.DRAW_PATH` - Lets you draw a LineString feature.
  - `EditorModes.DRAW_POLYGON` - Lets you draw a Polygon feature.
  - `EditorModes.DRAW_POINT` - Lets you draw a Point feature.
  - `EditorModes.DRAW_RECTANGLE` - Lets you draw a Rectangle feature.

- `getStyle` (Function, Optional) : Object

A function to style features, function parameters are 

  - `feature`: feature to style 
  - `featureState`: one of `SELECTED`, `HOVERED`, `INACTIVE`, `UNCOMMITTED`
  - `vertexId`: id of vertex to style 
  - `vertexState`: one of `SELECTED`, `HOVERED`, `INACTIVE`, `UNCOMMITTED`

Return is a map of [style objects](https://reactjs.org/docs/dom-elements.html#style) passed to DOM elements. The following keys are supported.
  - `vertex` (Object, Optional) 
    - `shape` - `rect` or `circle`
    - `clickRadius` (Number, optional) - Radius to detect features around a hovered or clicked point. fall back to radius. Default value is `0`
    - any style which could be applied to SVG `circle|rect`.
  - `line` (Object, Optional): 
    - `clickRadius`: (Number, Optional) - Radius to detect features around a hovered or clicked point line. Default is `0`
    - any style which could be applied to SVG `path` 

- `features` (Array, Optional) - A list of Point, LineString, or Polygon features.
- `selectedId` (String, Optional) - id of the selected feature. `EditorModes` assigns a unique id to each feature which is stored in `feature.properties.id`.
- `onSelect` (Function, Required) - callback when a feature is selected. Receives an object containing `{selectedId}`.
- `onUpdate` (Function, Required) - callback when anything is updated. Receives one argument `features` that is the updated list of GeoJSON features.
- `onAdd` (Function, Optional) - callback when a new feature is finished drawing. Receives one argument `featureId`.
- `onDelete` (Function, Optional) - callback when a feature is being deleted. Receives one argument `featureId`.


### Code Example
```js
import React, { Component } from "react";
import MapGL from 'react-map-gl';
import { Editor, EditorModes } from 'react-map-gl-draw';

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
    this._mapRef = null;
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
    this.setState({
      selectedMode: evt.target.id,
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
  
  _getStyle = ({feature, featureState, vertexId, vertexState}) => {
    return {
      vertex: {
        clickRadius: 12,
        shape: `rect`,
        fill: vertexState === `SELECTED` ? '#000' : '#aaa'
      },
      line: {
        clickRadius: 12,
        shape: `rect`,
        fill: featureState === `SELECTED` ? '#080' : 'none',
        fillOpacity: 0.8
      }
    }
  }

  render() {
    const { viewport, selectedMode, selectedFeatureId, features } = this.state;
    return (
      <MapGL
        {...viewport}
        ref={_ => (this._mapRef = _)}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/uberdata/cive48w2e001a2imn5mcu2vrs"
        onViewportChange={this._updateViewport}
      >
        <Editor
          viewport={viewport}
          eventManager={this._mapRef && this._mapRef._eventManager}
          width="100%"
          height="100%"
          mode={selectedMode}
          features={features}
          selectedFeatureId={selectedFeatureId}
          onSelect={this._onSelect}
          onUpdate={this._onUpdate}
          getStyle={this._getStyle}
        />
        {this._renderToolbar()}
      </MapGL>
    );
  }
}
```

## Compare with `mapbox-gl-draw`
- `EditorModes` is a stateless component. To manipulate the features, simply change the `features` prop. This is different from calling the class methods of `MapboxDraw`.
- `EditorModes` does not contain UI for mode selection, giving user application the flexibility to control their user experience.
- Features of `MapboxDraw` that are not planned for the initial release of `EditorModes`: keyboard navigation, box select.

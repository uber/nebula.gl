import * as React from 'react';
import * as ReactDOM from 'react-dom';
import MapGL from 'react-map-gl';
import { Editor, EditingMode } from 'react-map-gl-draw';

import {
  DrawPointMode,
  DrawLineStringMode,
  DrawRectangleMode,
  DrawPolygonMode,
} from '@nebula.gl/edit-modes';

import { MODES } from './constants';
import Toolbar from './toolbar';
import { getEditHandleStyle, getFeatureStyle } from './style';
import featureCollection from './data/sample-geojson.json';

const MODE_TO_HANDLER = {
  [MODES.READ_ONLY]: null,
  [MODES.EDITING]: EditingMode,
  [MODES.DRAW_POINT]: DrawPointMode,
  [MODES.DRAW_PATH]: DrawLineStringMode,
  [MODES.DRAW_RECTANGLE]: DrawRectangleMode,
  [MODES.DRAW_POLYGON]: DrawPolygonMode,
};

// eslint-disable-next-line no-process-env, no-undef
const MAP_STYLE = process.env.MapStyle || 'mapbox://styles/mapbox/light-v9';

const DEFAULT_VIEWPORT = {
  width: 800,
  height: 600,
  longitude: -122.45,
  latitude: 37.78,
  zoom: 12,
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // map
      viewport: DEFAULT_VIEWPORT,
      // editor
      selectedMode: null,
      selectedFeatureIndex: null,
      selectedEditHandleIndexes: [],
      selectable: false,

      features: featureCollection,
    };
    this._editorRef = null;
  }

  _onSelect = (selected) => {
    this.setState({
      selectedFeatureIndex: selected && selected.selectedFeatureIndex,
      selectedEditHandleIndexes: selected && selected.selectedEditHandleIndexes,
    });
  };

  _onDelete = () => {
    const { selectedFeatureIndex, selectedEditHandleIndexes } = this.state;

    if (selectedEditHandleIndexes?.length) {
      try {
        this._editorRef.deleteHandles(selectedFeatureIndex, selectedEditHandleIndexes);
      } catch (error) {
        // eslint-disable-next-line no-undef, no-console
        console.error(error.message);
      }
      return;
    }

    if (selectedFeatureIndex === null || selectedFeatureIndex === undefined) {
      return;
    }

    this._editorRef.deleteFeatures(selectedFeatureIndex);
  };

  _switchMode = (evt) => {
    let selectedMode = evt.target.id;
    if (selectedMode === this.state.selectedMode) {
      selectedMode = null;
    }

    const HandlerClass = MODE_TO_HANDLER[selectedMode];
    const modeHandler = HandlerClass ? new HandlerClass() : null;
    this.setState({ selectedMode, modeHandler });
  };

  _updateViewport = (viewport) => {
    this.setState({ viewport });
  };

  _renderToolbar = () => {
    return (
      <Toolbar
        selectedMode={this.state.selectedMode}
        onSwitchMode={this._switchMode}
        onDelete={this._onDelete}
      />
    );
  };

  render() {
    const { viewport, modeHandler } = this.state;
    return (
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapStyle={MAP_STYLE}
        onViewportChange={this._updateViewport}
        onLoad={() => {
          // note: there is an issue with react-map-gl https://github.com/visgl/react-map-gl/issues/1098
          // Editor isn't available in `componentDidMount`
          // A workaround is calling` addFeatures`  when `map` loaded.
          this._editorRef.addFeatures(featureCollection.features);
        }}
      >
        <Editor
          ref={(_) => (this._editorRef = _)}
          clickRadius={12}
          onSelect={this._onSelect}
          featureStyle={getFeatureStyle}
          editHandleStyle={getEditHandleStyle}
          editHandleShape={'circle'}
          mode={modeHandler}
        />
        {this._renderToolbar()}
      </MapGL>
    );
  }
}

export function renderToDom(container) {
  ReactDOM.render(<App />, container);
}

/* global document */
import React, { Component } from "react";
import ReactDom from "react-dom";
import MapGL from "react-map-gl";
import {
  Editor,
  EditingMode,
  DrawLineStringMode,
  DrawPolygonMode,
} from "react-map-gl-draw";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pwY3owbGFxMDVwNTNxcXdwMms2OWtzbiJ9.1PPVl0VLUQgqrosrI2nUhg";

const MODES = [
  { id: "drawPolyline", text: "Draw Polyline", handler: DrawLineStringMode },
  { id: "drawPolygon", text: "Draw Polygon", handler: DrawPolygonMode },
  { id: "editing", text: "Edit Feature", handler: EditingMode },
];

const DEFAULT_VIEWPORT = {
  width: 800,
  height: 600,
  longitude: -122.45,
  latitude: 37.78,
  zoom: 14,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: DEFAULT_VIEWPORT,
      modeId: null,
      modeHandler: null,
    };
  }

  _switchMode = (evt) => {
    const modeId =
      evt.target.value === this.state.modeId ? null : evt.target.value;
    const mode = MODES.find((m) => m.id === modeId);
    const modeHandler = mode ? new mode.handler() : null;
    this.setState({ modeId, modeHandler });
  };

  _renderToolbar = () => {
    return (
      <div
        style={{ position: "absolute", top: 0, right: 0, maxWidth: "320px" }}
      >
        <select onChange={this._switchMode}>
          <option value="">--Please choose a draw mode--</option>
          {MODES.map((mode) => (
            <option key={mode.id} value={mode.id}>
              {mode.text}
            </option>
          ))}
        </select>
      </div>
    );
  };

  _updateViewport = (viewport) => {
    this.setState({ viewport });
  };

  render() {
    const { viewport, modeHandler } = this.state;
    return (
      <MapGL
        {...viewport}
        width="100%"
        height="100%"
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle={"mapbox://styles/mapbox/dark-v9"}
        onViewportChange={this._updateViewport}
      >
        <Editor
          // to make the lines/vertices easier to interact with
          clickRadius={12}
          mode={modeHandler}
          onSelect={(_) => {}}
        />
        {this._renderToolbar()}
      </MapGL>
    );
  }
}

document.body.style = "width: 100vw; height: 100vh; margin: 0;";
const container = document.getElementById("root");
container.style = "width: 100%; height: 100%";
ReactDom.render(<App />, container);

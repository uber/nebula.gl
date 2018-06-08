import window from 'global/window';
import React, { Component } from 'react';
import MapGL from 'react-map-gl';
import {
  Nebula,
  Feature,
  HtmlOverlay,
  HtmlOverlayItem,
  HtmlClusterOverlay,
  EditableJunctionsLayer,
  EditablePolygonsLayer
} from 'nebula.gl';

class Example extends Component {
  constructor() {
    super();
    this.state = {
      viewport: {
        bearing: 0,
        height: 300,
        latitude: 37.77919,
        longitude: -122.41914,
        pitch: 0,
        width: 600,
        zoom: 17
      }
    };
  }

  getNebulaContents() {
    return null;
  }

  getNebulaLayers() {
    return [];
  }

  render() {
    return (
      <div>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css" rel="stylesheet" />
        <MapGL {...this.state.viewport} onViewportChange={viewport => this.setState({ viewport })}>
          <Nebula
            ref={nebula => (this.nebula = nebula || this.nebula)}
            viewport={this.state.viewport}
            layers={this.getNebulaLayers()}
          >
            {this.getNebulaContents()}
          </Nebula>
        </MapGL>
      </div>
    );
  }
}

class SFCityHall extends HtmlOverlay {
  getItems() {
    return [
      <HtmlOverlayItem
        style={{ background: 'red', padding: 4, color: 'white' }}
        key={0}
        coordinates={[-122.41914, 37.77919]}
      >
        SF City Hall
      </HtmlOverlayItem>
    ];
  }
}

export class BasicOverlayExample extends Example {
  getNebulaContents() {
    return <SFCityHall />;
  }
}

class SFBridges extends HtmlClusterOverlay {
  getAllObjects() {
    return [
      { name: 'Golden Gate Bridge', coordinates: [-122.478611, 37.819722] },
      { name: 'Bay Bridge', coordinates: [-122.346667, 37.818056] }
    ];
  }

  getObjectCoordinates(object) {
    return object.coordinates;
  }

  renderObject(coordinates, object) {
    return (
      <HtmlOverlayItem
        style={{ background: 'blue', padding: 4, color: 'white' }}
        key={object.name}
        coordinates={coordinates}
      >
        {object.name}
      </HtmlOverlayItem>
    );
  }

  renderCluster(coordinates, clusterId, pointCount) {
    return (
      <HtmlOverlayItem
        style={{ background: 'pink', padding: 4, color: 'white' }}
        key={clusterId}
        coordinates={coordinates}
      >
        {pointCount} Bridges
      </HtmlOverlayItem>
    );
  }
}

export class ClusteringOverlayExample extends Example {
  constructor() {
    super();
    this.state.viewport.zoom = 10;
  }

  getNebulaContents() {
    return <SFBridges />;
  }
}

export class EditPointsExample extends Example {
  constructor() {
    super();
    this.state.viewport.zoom = 10;
    this.data = [];

    this.layer = new EditableJunctionsLayer({
      getData: () => this.data,
      toNebulaFeature: data => {
        const style = {
          outlineColor: [0, 0, 0],
          fillColor: data.edited ? [1, 0, 0] : [0, 0, 1],
          pointRadiusMeters: 100,
          outlineRadiusMeters: 100
        };
        const geoJson = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: data.coordinates
          }
        };
        return new Feature(geoJson, style);
      },
      on: {
        editEnd: (event, info) => {
          // Update object after edit has finished
          this.data[info.id].coordinates = info.feature.geoJson.geometry.coordinates;
          this.data[info.id].edited = true;
        }
      }
    });

    window
      .fetch(
        'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/website/bart-stations.json'
      )
      .then(response => {
        response.json().then(json => {
          json.forEach(({ coordinates }) =>
            this.data.push({ coordinates, id: this.data.length, edited: false })
          );
          // Refresh after fetching data
          this.nebula.updateAllDeckObjects();
        });
      });
  }

  getNebulaLayers() {
    return [this.layer];
  }
}

export class EditPolygonsExample extends Example {
  constructor() {
    super();
    this.state.viewport.zoom = 10;
    this.data = [];

    this.layer = new EditablePolygonsLayer({
      getData: () => this.data,
      toNebulaFeature: data => {
        const style = {
          outlineColor: [0, 0, 0, 0.8],
          fillColor: data.edited ? [1, 0, 0, 0.5] : [0, 0, 1, 0.5],
          lineWidthMeters: 50
        };
        return new Feature(data.geoJson, style);
      },
      on: {
        mousedown: event => {
          this.layer.selectedPolygonId = event.data.id;
          this.layer.selectedSubPolygonIndex = event.metadata.index;
          this.nebula.updateAllDeckObjects();
        },
        editEnd: (event, info) => {
          // Update object after edit has finished
          this.data[info.id].geoJson = info.feature.geoJson;
          this.data[info.id].edited = true;
        }
      }
    });

    window
      .fetch(
        'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/arc/counties.json'
      )
      .then(response => {
        response.json().then(json => {
          json.features.filter(feature => feature.geometry.type === 'Polygon').forEach(feature =>
            this.data.push({
              geoJson: feature,
              id: this.data.length,
              edited: false
            })
          );
          // Refresh after fetching data
          this.nebula.updateAllDeckObjects();
        });
      });
  }

  getNebulaLayers() {
    return [this.layer];
  }
}

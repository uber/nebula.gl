import window from 'global/window';
import React, { Component } from 'react';
import MapGL from 'react-map-gl';
import DeckGL from 'deck.gl';
import { featureCollection, point } from '@turf/helpers';

import { EditableGeoJsonLayer } from 'nebula.gl';
import { Nebula, HtmlOverlay, HtmlOverlayItem, HtmlClusterOverlay } from 'nebula.gl-react';

class Example extends Component {
  constructor() {
    super();
    this.state = {
      viewport: {
        bearing: 0,
        height: 400,
        latitude: 37.77919,
        longitude: -122.41914,
        pitch: 0,
        width: 800,
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
            layers={[]}
          >
            {this.getNebulaContents()}
          </Nebula>
          <DeckGL {...this.state.viewport} layers={this.getNebulaLayers()} />
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
        <br />
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/1/18/SFCityHall.png"
          style={{ width: 153, height: 100 }}
        />
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
    this.state.data = [];
    this.state.selectedFeatureIndexes = [];

    window
      .fetch(
        'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/website/bart-stations.json'
      )
      .then(response => {
        response.json().then(json => {
          this.setState({
            data: featureCollection(json.map(({ coordinates }) => point(coordinates)))
          });
        });
      });
  }

  getNebulaLayers() {
    const layer = new EditableGeoJsonLayer({
      id: 'edit-points-example',
      data: this.state.data,

      mode: 'modify',
      selectedFeatureIndexes: this.state.selectedFeatureIndexes,
      getRadius: 400,
      getFillColor: () => [0, 0, 255, 255],

      getEditHandlePointColor: () => [255, 0, 0, 200],
      getEditHandlePointRadius: () => 350,

      // Editing callbacks
      onEdit: ({ updatedData, editType }) => {
        this.setState({
          data: updatedData
        });
      },

      onClick: ({ index }) => this.setState({ selectedFeatureIndexes: [index] })
    });

    return [layer];
  }
}

export class EditPolygonsExample extends Example {
  constructor() {
    super();
    this.state.viewport.zoom = 7;
    this.state.data = [];
    this.state.selectedFeatureIndexes = [];

    window
      .fetch(
        'https://raw.githubusercontent.com/uber-common/deck.gl-data/master/examples/arc/counties.json'
      )
      .then(response => {
        response.json().then(json => {
          this.setState({ data: json });
        });
      });
  }

  getNebulaLayers() {
    const layer = new EditableGeoJsonLayer({
      id: 'edit-polygons-example',
      data: this.state.data,

      mode: 'modify',
      selectedFeatureIndexes: this.state.selectedFeatureIndexes,
      getRadius: 400,
      getFillColor: () => [0, 0, 200, 200],

      getEditHandlePointColor: ({ type }) =>
        type === 'existing' ? [255, 0, 0, 200] : [0, 255, 0, 200],
      getEditHandlePointRadius: () => 500,

      // Editing callbacks
      onEdit: ({ updatedData, editType }) => {
        this.setState({
          data: updatedData
        });
      },

      onClick: ({ index }) => this.setState({ selectedFeatureIndexes: [index] })
    });

    return [layer];
  }
}

class WorldHeritage extends HtmlClusterOverlay {
  getAllObjects() {
    return this.props.data;
  }

  getObjectCoordinates(object) {
    return [object.lng, object.lat];
  }

  renderObject(coordinates, object) {
    if (this.getZoom() > 8) {
      // show all details
      return (
        <HtmlOverlayItem
          style={{ background: 'red', padding: 8, color: 'white', maxWidth: 300 }}
          key={object.name}
          coordinates={coordinates}
        >
          <center>{object.title}</center>
          <div
            style={{ fontSize: 12, lineHeight: '12px', maxWidth: 300 }}
            dangerouslySetInnerHTML={{ __html: object.description }}
          />
        </HtmlOverlayItem>
      );
    } else if (this.getZoom() > 5) {
      // show title
      return (
        <HtmlOverlayItem
          style={{
            background: 'red',
            padding: 4,
            color: 'white',
            fontSize: 12,
            lineHeight: '10px',
            maxWidth: 300
          }}
          key={object.name}
          coordinates={coordinates}
        >
          {object.title}
        </HtmlOverlayItem>
      );
    }

    // just small square
    return (
      <HtmlOverlayItem
        style={{ background: 'red', padding: 4 }}
        key={object.name}
        coordinates={coordinates}
      />
    );
  }

  renderCluster(coordinates, clusterId, pointCount) {
    return (
      <HtmlOverlayItem
        style={{
          background: 'blue',
          padding: 4,
          color: 'white',
          width: 40,
          height: 40,
          borderRadius: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        key={clusterId}
        coordinates={coordinates}
      >
        {pointCount}
      </HtmlOverlayItem>
    );
  }
}

export class WorldHeritageExample extends Example {
  DATA_URL = 'https://cors-anywhere.herokuapp.com/http://whc.unesco.org/en/list/georss/';

  constructor() {
    super();
    this.state.viewport.zoom = 3;

    window.fetch(this.DATA_URL).then(response => {
      response.text().then(text => {
        const parser = new window.DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');

        const data = Array.from(xmlDoc.getElementsByTagName('item')).map(item => {
          const title = item.getElementsByTagName('title')[0].textContent;
          const description = item.getElementsByTagName('description')[0].textContent;
          const link = item.getElementsByTagName('link')[0].textContent;
          const lat = item.getElementsByTagName('geo:lat')[0].textContent;
          const lng = item.getElementsByTagName('geo:long')[0].textContent;

          return {
            title,
            description,
            link,
            lat,
            lng
          };
        });

        this.setState({ data });
      });
    });
  }

  getNebulaContents() {
    const { data } = this.state;
    if (data) {
      return <WorldHeritage data={data} />;
    }

    return <div>Loading...</div>;
  }
}

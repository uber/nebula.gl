// @flow
import window from 'global/window';
import React, { Component } from 'react';
import MapGL from 'react-map-gl';

import { HtmlClusterOverlay, HtmlOverlayItem, Nebula } from 'nebula.gl-react';

const initialViewport = {
  bearing: 0,
  height: 0,
  latitude: 37.75,
  longitude: -122.445,
  pitch: 0,
  width: 0,
  zoom: 10
};

const styles = {
  mapContainer: {
    alignItems: 'stretch',
    display: 'flex',
    height: '100vh'
  }
};

const DATA_URL = 'https://cors-anywhere.herokuapp.com/http://whc.unesco.org/en/list/georss/';

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

export default class Example extends Component<
  {},
  {
    viewport: Object,
    data: ?(Object[])
  }
> {
  constructor() {
    super();

    this.state = {
      viewport: initialViewport,
      data: null
    };

    window.fetch(DATA_URL).then(response => {
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

  componentDidMount() {
    window.addEventListener('resize', this._resize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  nebula: Nebula;

  _onChangeViewport = (viewport: Object) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  _resize = () => {
    this.forceUpdate();
  };

  getNebulaContents() {
    const { data } = this.state;
    if (data) {
      return <WorldHeritage data={data} />;
    }

    return <div>Loading...</div>;
  }

  render() {
    const { state } = this;
    let { viewport } = state;

    const { innerHeight: height, innerWidth: width } = window;
    viewport = Object.assign(viewport, { height, width });

    return (
      <div style={styles.mapContainer}>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.44.0/mapbox-gl.css" rel="stylesheet" />
        <MapGL {...viewport} onChangeViewport={this._onChangeViewport}>
          <Nebula
            ref={nebula => (this.nebula = nebula || this.nebula)}
            viewport={viewport}
            layers={[]}
            onMapMouseEvent={() => this.forceUpdate()}
          >
            {this.getNebulaContents()}
          </Nebula>
        </MapGL>
      </div>
    );
  }
}

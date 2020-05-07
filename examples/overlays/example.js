import window from 'global/window';
import * as React from 'react';
import DeckGL from '@deck.gl/react';
import { StaticMap } from 'react-map-gl';

import { HtmlOverlay, HtmlClusterOverlay, HtmlOverlayItem } from '@nebula.gl/overlays';

const initialViewState = {
  longitude: -122.4,
  latitude: 37.7,
  zoom: 10,
  pitch: 0,
  bearing: 0,
};

const styles = {
  mapContainer: {
    alignItems: 'stretch',
    display: 'flex',
    height: '100vh',
  },
  box: {
    background: 'white',
  },
  image: {
    float: 'left',
    margin: 10,
  },
};

const DATA_URL = 'https://cors-anywhere.herokuapp.com/http://whc.unesco.org/en/list/georss/';
// const DATA_URL = 'georss.xml';

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
          key={object.title}
          coordinates={coordinates}
        >
          <center>{object.title}</center>
          <div style={{ fontSize: 12, lineHeight: '12px', maxWidth: 300 }}>
            <img style={styles.image} src={object.image} />
            {object.description}
          </div>
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
            maxWidth: 300,
          }}
          key={object.title}
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
        key={object.title}
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
          justifyContent: 'center',
        }}
        key={clusterId}
        coordinates={coordinates}
      >
        {pointCount}
      </HtmlOverlayItem>
    );
  }
}

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };

    window.fetch(DATA_URL).then((response) => {
      response.text().then((text) => {
        const parser = new window.DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');

        const data = Array.from(xmlDoc.getElementsByTagName('item')).map((item) => {
          const title = item.getElementsByTagName('title')[0].textContent;
          const description = item.getElementsByTagName('description')[0].textContent;
          const link = item.getElementsByTagName('link')[0].textContent;
          const lat = Number(item.getElementsByTagName('geo:lat')[0].textContent);
          const lng = Number(item.getElementsByTagName('geo:long')[0].textContent);

          return {
            title,
            description: description.replace(/<.+?>/gi, ''),
            image: (/src='(.+?)'/.exec(description) || [])[1],
            link,
            lat,
            lng,
          };
        });

        this.setState({ data });
      });
    });
  }

  // componentDidMount() {
  //   window.addEventListener('resize', this._resize);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this._resize);
  // }

  // _resize = () => {
  //   this.forceUpdate();
  // };

  getWorldHeritage() {
    const { data } = this.state;
    if (data) {
      return <WorldHeritage data={data} />;
    }

    return <div>Loading...</div>;
  }

  getElevationTest() {
    return (
      <HtmlOverlay>
        <HtmlOverlayItem style={styles.box} coordinates={[0, 0, 0]}>
          Map Center Zero Elevation
        </HtmlOverlayItem>
        <HtmlOverlayItem style={styles.box} coordinates={[0, 0, 50000]}>
          Map Center 50km Elevation
        </HtmlOverlayItem>
      </HtmlOverlay>
    );
  }

  render() {
    return (
      <div style={styles.mapContainer}>
        <link href="https://api.mapbox.com/mapbox-gl-js/v0.47.0/mapbox-gl.css" rel="stylesheet" />
        <DeckGL initialViewState={initialViewState} controller={true} layers={[]}>
          <StaticMap />
          {this.getWorldHeritage()}
        </DeckGL>
      </div>
    );
  }
}

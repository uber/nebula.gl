<p align="right">
  <a href="https://npmjs.org/package/nebula.gl">
    <img src="https://img.shields.io/npm/v/nebula.gl.svg?label=nebula.gl" alt="version" />
  </a>
  <a href="https://npmjs.org/package/@nebula.gl/layers">
    <img src="https://img.shields.io/npm/v/@nebula.gl/layers.svg?label=@nebula.gl/layers" alt="version" />
  </a>
  <a href="https://npmjs.org/package/@nebula.gl/overlays">
    <img src="https://img.shields.io/npm/v/@nebula.gl/overlays.svg?label=@nebula.gl/overlays" alt="version" />
  </a>
  <a href="https://travis-ci.org/uber/nebula.gl">
    <img src="https://img.shields.io/travis/uber/nebula.gl/master.svg" alt="build" />
  </a>
  <a href="https://coveralls.io/github/uber/nebula.gl">
    <img src="https://img.shields.io/coveralls/github/uber/nebula.gl.svg" alt="coveralls" />
  </a>
</p>

<h1 align="center">Nebula.gl | <a href="https://neb.gl">Website</a></h1>

<h5 align="center">An editing framework for deck.gl</h5>

[![docs](https://i.imgur.com/BTVrsR4.jpg)](https://neb.gl)

# Getting started

## Running the example

1.  `git clone git@github.com:uber/nebula.gl.git`
2.  `cd nebula.gl`
3.  `yarn`
4.  `cd examples/deck`
5.  `yarn`
6.  `export MapboxAccessToken='<Add your key>'`
7.  `yarn start-local`
8.  You can view/edit geometry.

## Installation

```
yarn add nebula.gl
```

nebula.gl will automatically install a compatible version of deck.gl.

## EditableGeoJsonLayer

The Editable GeoJSON layer accepts a [GeoJSON](http://geojson.org) `FeatureCollection` and renders the features as editable polygons, lines, and points. See the example below and for the official documentation click [here](https://github.com/uber/nebula.gl/blob/master/docs/overview.md).

```js
import DeckGL from 'deck.gl';
import { EditableGeoJsonLayer } from 'nebula.gl';

const myFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    /* insert features here */
  ]
};

class App extends React.Component {
  state = {
    mode: 'modify',
    selectedFeatureIndexes: [0],
    data: myFeatureCollection
  };

  render() {
    const layer = new EditableGeoJsonLayer({
      id: 'geojson-layer',
      data: this.state.data,
      mode: this.state.mode,
      selectedFeatureIndexes: this.state.selectedFeatureIndexes,

      onEdit: ({ updatedData }) => {
        this.setState({
          data: updatedData,
        });
      }
    });

    return <DeckGL {...this.props.viewport} layers={[layer]} />;
  }
}
```

<p align="right">
  <a href="https://npmjs.org/package/nebula.gl">
    <img src="https://img.shields.io/npm/v/nebula.gl.svg?label=nebula.gl" alt="version" />
  </a>
  <a href="https://npmjs.org/package/react-map-gl-draw">
    <img src="https://img.shields.io/npm/v/react-map-gl-draw.svg?label=react-map-gl-draw" alt="version" />
  </a>
</p>
<p align="right">
  <a href="https://npmjs.org/package/@nebula.gl/edit-modes">
    <img src="https://img.shields.io/npm/v/@nebula.gl/edit-modes.svg?label=@nebula.gl/edit-modes" alt="version" />
  </a>
  <a href="https://npmjs.org/package/@nebula.gl/layers">
    <img src="https://img.shields.io/npm/v/@nebula.gl/layers.svg?label=@nebula.gl/layers" alt="version" />
  </a>
  <a href="https://npmjs.org/package/@nebula.gl/overlays">
    <img src="https://img.shields.io/npm/v/@nebula.gl/overlays.svg?label=@nebula.gl/overlays" alt="version" />
  </a>
</p>
<p align="right">
  <a href="https://travis-ci.org/uber/nebula.gl">
    <img src="https://img.shields.io/travis/uber/nebula.gl/master.svg" alt="build" />
  </a>
  <a href="https://app.fossa.com/projects/custom%2B4458%2Fgithub.com%2Fuber%2Fnebula.gl?ref=badge_shield" alt="FOSSA Status">
    <img src="https://app.fossa.com/api/projects/custom%2B4458%2Fgithub.com%2Fuber%2Fnebula.gl.svg?type=shield"/>
  </a>
  <a href="https://coveralls.io/github/uber/nebula.gl">
    <img src="https://img.shields.io/coveralls/github/uber/nebula.gl.svg" alt="coveralls" />
  </a>
</p>

<h1 align="center">nebula.gl | <a href="https://nebula.gl">Website</a></h1>

<h5 align="center">An editing framework for deck.gl</h5>

[![docs](https://i.imgur.com/bRDL1oh.gif)](https://nebula.gl)

[nebula.gl](https://nebula.gl) provides editable and interactive map overlay layers, built using the power of [deck.gl](https://uber.github.io/deck.gl).

## Getting started

### Running the example

1. `git clone git@github.com:uber/nebula.gl.git`
2. `cd nebula.gl`
3. `yarn`
4. `cd examples/advanced`
5. `yarn`
6. `export MapboxAccessToken='<Add your key>'`
7. `yarn start-local`
8. You can now view and edit geometry.

### Installation

```
yarn add @nebula.gl/layers
yarn add @nebula.gl/overlays
yarn add @deck.gl/core
yarn add @deck.gl/react
yarn add @deck.gl/layers
```

### `EditableGeoJsonLayer`

[EditableGeoJsonLayer](/docs/api-reference/layers/editable-geojson-layer.md) is implemented as a [deck.gl](https://deck.gl) layer. It provides the ability to view and edit multiple types of geometry formatted as [GeoJSON](https://tools.ietf.org/html/rfc7946) (an open standard format for geometry) including polygons, lines, and points.

```js
import DeckGL from '@deck.gl/react';
import { EditableGeoJsonLayer, DrawPolygonMode } from 'nebula.gl';

const myFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    /* insert features here */
  ],
};

const selectedFeatureIndexes = [];

class App extends React.Component {
  state = {
    data: myFeatureCollection,
  };

  render() {
    const layer = new EditableGeoJsonLayer({
      id: 'geojson-layer',
      data: this.state.data,
      mode: DrawPolygonMode,
      selectedFeatureIndexes,

      onEdit: ({ updatedData }) => {
        this.setState({
          data: updatedData,
        });
      },
    });

    return <DeckGL {...this.props.viewport} layers={[layer]} />;
  }
}
```

### Useful examples (Codesandbox)

* [Hello World (using deck.gl)](https://codesandbox.io/s/hello-world-nebulagl-csvsm)
* [With Toolbox](https://codesandbox.io/s/hello-nebulagl-with-toolbox-oelkr)
* [No React](https://codesandbox.io/s/deckgl-and-nebulagl-editablegeojsonlayer-no-react-p9yrs)
* [Custom EditMode](https://codesandbox.io/s/connect-the-dots-mode-yow65)

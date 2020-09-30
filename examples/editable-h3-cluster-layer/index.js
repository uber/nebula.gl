import * as React from 'react';
import ReactDOM from 'react-dom';
import DeckGL from '@deck.gl/react';
import { EditableH3ClusterLayer } from '@nebula.gl/layers';
import {
  DrawPointMode,
  DrawPolygonMode,
  DrawCircleFromCenterMode,
  DrawRectangleMode,
} from '@nebula.gl/edit-modes';
import { StaticMap } from 'react-map-gl';
import { hexagonCluster1, hexagonCluster2, hexagonCluster3 } from './data.js';

const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoiZ2Vvcmdpb3MtdWJlciIsImEiOiJjanZidTZzczAwajMxNGVwOGZrd2E5NG90In0.gdsRu_UeU_uPi9IulBruXA';

const SELECTED_FILL_COLOR = [50, 100, 200, 230];
const UNSELECTED_FILL_COLOR = [50, 100, 200, 100];

const initialViewState = {
  longitude: -122.43,
  latitude: 37.775,
  zoom: 12,
};

function getTentativeFillColor(booleanOperation) {
  switch (booleanOperation) {
    case 'union':
      return [50, 100, 200, 100];
    case 'difference':
      return [200, 100, 100, 100];
    case 'intersection':
    default:
      return [200, 150, 100, 100];
  }
}

function Button({ active, ...rest }) {
  return <button style={{ backgroundColor: active ? '#50a0f0' : '' }} {...rest} />;
}

function Toolbar({
  mode,
  setMode,
  booleanOperation,
  setBooleanOperation,
  h3Clusters,
  selectedIndexes,
  setSelectedIndexes,
}) {
  return (
    <div style={{ position: 'absolute', top: 0, right: 0, display: 'grid' }}>
      <Button onClick={() => setMode(() => DrawPolygonMode)} active={mode === DrawPolygonMode}>
        Polygon
      </Button>
      <Button
        onClick={() => setMode(() => DrawCircleFromCenterMode)}
        active={mode === DrawCircleFromCenterMode}
      >
        Circle
      </Button>
      <Button onClick={() => setMode(() => DrawRectangleMode)} active={mode === DrawRectangleMode}>
        Rectangle
      </Button>
      <Button onClick={() => setMode(() => DrawPointMode)} active={mode === DrawPointMode}>
        Point
      </Button>
      <div style={{ height: '7px' }} />
      <Button onClick={() => setBooleanOperation('union')} active={booleanOperation === 'union'}>
        Union
      </Button>
      <Button
        onClick={() => setBooleanOperation('difference')}
        active={booleanOperation === 'difference'}
      >
        Difference
      </Button>
      <Button
        onClick={() => setBooleanOperation('intersection')}
        active={booleanOperation === 'intersection'}
      >
        Intersection
      </Button>
      <div style={{ height: '7px' }} />
      {renderClusterSelectors(h3Clusters, selectedIndexes, setSelectedIndexes)}
    </div>
  );
}

function renderClusterSelectors(h3Clusters, selectedIndexes, setSelectedIndexes) {
  return h3Clusters.map((cluster, i) => (
    <div>
      <Button
        key={i}
        onClick={() => {
          if (!selectedIndexes.includes(i)) {
            setSelectedIndexes([...selectedIndexes, i]);
          } else {
            setSelectedIndexes(selectedIndexes.filter((index) => index !== i));
          }
        }}
        active={selectedIndexes.includes(i)}
      >
        Cluster {i}
      </Button>
    </div>
  ));
}

export function Example() {
  const [h3Clusters, setH3Clusters] = React.useState([
    {
      hexIds: hexagonCluster1,
    },
    {
      hexIds: hexagonCluster2,
    },
    {
      hexIds: hexagonCluster3,
    },
  ]);
  const [mode, setMode] = React.useState(() => DrawPolygonMode);
  const [booleanOperation, setBooleanOperation] = React.useState('union');
  const [selectedIndexes, setSelectedIndexes] = React.useState([0]);

  const layer = new EditableH3ClusterLayer({
    data: h3Clusters,
    getHexagons: (x) => x.hexIds,
    selectedIndexes,
    resolution: 9,
    modeConfig: {
      booleanOperation,
    },
    mode,
    onEdit: ({ updatedData }) => {
      const newH3Clusters = [...h3Clusters];
      newH3Clusters[selectedIndexes[0]] = {
        hexIds: updatedData,
      };
      setH3Clusters(newH3Clusters);
    },
    _subLayerProps: {
      'tentative-hexagons': {
        getFillColor: getTentativeFillColor(booleanOperation),
      },
      hexagons: {
        getFillColor: (cluster) => {
          if (selectedIndexes.some((i) => h3Clusters[i] === cluster)) {
            return SELECTED_FILL_COLOR;
          }
          return UNSELECTED_FILL_COLOR;
        },
        updateTriggers: {
          getFillColor: selectedIndexes,
        },
      },
    },
  });

  return (
    <>
      <DeckGL
        initialViewState={initialViewState}
        controller={{
          doubleClickZoom: false,
        }}
        layers={[layer]}
        getCursor={layer.getCursor.bind(layer)}
      >
        <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
      <Toolbar
        {...{
          mode,
          setMode,
          booleanOperation,
          setBooleanOperation,
          h3Clusters,
          selectedIndexes,
          setSelectedIndexes,
        }}
      />
    </>
  );
}

const root = document.createElement('div');

if (document.body) {
  document.body.style.margin = '0';

  document.body.appendChild(root);
  ReactDOM.render(<Example />, root);
}

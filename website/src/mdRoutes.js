// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

export default [
  {
    name: 'Examples',
    path: '/examples',
    data: [
      {
        name: 'OVERLAYS',
        children: [
          {
            name: 'Basic',
            markdown: require('../../docs/examples/overlay-basic.md')
          },
          {
            name: 'Clustering',
            markdown: require('../../docs/examples/overlay-clustering.md')
          },
          {
            name: 'World Heritage',
            markdown: require('../../docs/examples/world-heritage.md')
          }
        ]
      },
      {
        name: 'EDITABLE GEO JSON',
        children: [
          {
            name: 'Points',
            markdown: require('../../docs/examples/edit-points.md')
          },
          {
            name: 'Polygons',
            markdown: require('../../docs/examples/edit-polygons.md')
          }
        ]
      }
    ]
  },
  {
    name: 'Documentation',
    path: '/documentation',
    data: [
      {
        name: 'Overview',
        markdown: require('../../docs/overview.md')
      },
      {
        name: 'Roadmap',
        markdown: require('../../docs/roadmap.md')
      },
      {
        name: 'Get Started',
        children: [
          {
            name: 'Installation',
            markdown: require('../../docs/get-started/installing.md')
          },
          {
            name: 'Basic usage',
            markdown: require('../../docs/get-started/basic-usage.md')
          }
        ]
      },
      {
        name: 'Developer Guide',
        children: [
          {
            name: 'Configuring Nebula',
            markdown: require('../../docs/developer-guide/configuring-nebula.md')
          },
          {
            name: 'Using Editable Layers',
            markdown: require('../../docs/developer-guide/editable-layers.md')
          },
          {
            name: 'Using HTML Overlays',
            markdown: require('../../docs/developer-guide/html-overlays.md')
          }
        ]
      },
      {
        name: 'API Reference',
        children: [
          {
            name: 'Nebula (React class)',
            markdown: require('../../docs/api-reference/nebula.md')
          },
          {
            name: 'Layer',
            markdown: require('../../docs/api-reference/layers/layer.md')
          },
          {
            name: 'Feature',
            markdown: require('../../docs/api-reference/layers/feature.md')
          },
          {
            name: 'JunctionsLayer',
            markdown: require('../../docs/api-reference/layers/junctions-layer.md')
          },
          {
            name: 'EditableJunctionsLayer',
            markdown: require('../../docs/api-reference/layers/editable-junctions-layer.md')
          },
          {
            name: 'PolygonLayer',
            markdown: require('../../docs/api-reference/layers/polygons-layer.md')
          },
          {
            name: 'EditablePolygonLayer',
            markdown: require('../../docs/api-reference/layers/editable-polygons-layer.md')
          },
          {
            name: 'EditableLinesLayer',
            markdown: require('../../docs/api-reference/layers/editable-lines-layer.md')
          },
          {
            name: 'SegmentLayer',
            markdown: require('../../docs/api-reference/layers/segment-layer.md')
          },
          {
            name: 'TextsLayer',
            markdown: require('../../docs/api-reference/layers/texts-layer.md')
          },
          {
            name: 'HtmlOverlay',
            markdown: require('../../docs/api-reference/overlays/html-overlay.md')
          },
          {
            name: 'HtmlClusterOverlay',
            markdown: require('../../docs/api-reference/overlays/html-cluster-overlay.md')
          },
          {
            name: 'HtmlTooltipOverlay',
            markdown: require('../../docs/api-reference/overlays/html-tooltip-overlay.md')
          },
          {
            name: 'HtmlOverlayItem',
            markdown: require('../../docs/api-reference/overlays/html-overlay-item.md')
          },
          {
            name: 'NebulaOverlay',
            markdown: require('../../docs/api-reference/overlays/nebula-overlay.md')
          }
        ]
      }
    ]
  }
];

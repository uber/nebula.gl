// @flow-ignore
import { polygon } from '@turf/helpers';

import Feature from '../../lib/feature';
import { expandMultiGeometry, GeoJsonGeometryTypes } from '../../lib/geojson';

it('test expandMultiGeometry()', () => {
  const data = [
    {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.44065057089426, 37.86997264051048],
            [-122.45034943869211, 37.85716578496087],
            [-122.42906342794993, 37.85059209014963],
            [-122.41327058127024, 37.852557483014245],
            [-122.41678963949778, 37.87010815089117],
            [-122.4302650575886, 37.87471535553951],
            [-122.44065057089426, 37.86997264051048]
          ],
          [
            [-122.43309691521875, 37.863841448225706],
            [-122.43262484643213, 37.85709893121648],
            [-122.42301180932276, 37.85791213180541],
            [-122.423955946896, 37.865366052490586],
            [-122.43309691521875, 37.863841448225706]
          ]
        ]
      },
      properties: {}
    },
    {
      type: 'Feature',
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [-122.4960994720459, 37.88474434096118],
              [-122.48335361480711, 37.88474434096118],
              [-122.48335361480711, 37.889689316564045],
              [-122.4960994720459, 37.889689316564045],
              [-122.4960994720459, 37.88474434096118]
            ]
          ],
          [
            [
              [-122.48936176300049, 37.88152654150914],
              [-122.48588562011717, 37.88152654150914],
              [-122.48588562011717, 37.88403305002908],
              [-122.48936176300049, 37.88403305002908],
              [-122.48936176300049, 37.88152654150914]
            ]
          ]
        ]
      },
      properties: {}
    },
    {
      type: 'Feature',
      geometry: {
        type: 'INVALID'
      },
      properties: {}
    }
  ];

  const { result, rejected } = expandMultiGeometry(
    data.map(d => new Feature(d, {})),
    GeoJsonGeometryTypes.Polygon,
    GeoJsonGeometryTypes.MultiPolygon,
    polygon
  );

  expect(result.length).toBe(3);
  expect(rejected.length).toBe(1);
});

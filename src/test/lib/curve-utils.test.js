import { generateCurveFromControlPoints } from '../../lib/curve-utils';

const POLYLINE = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'LineString',
    coordinates: [
      [-122.41988182067871, 37.8014343052295],
      [-122.41904497146605, 37.802790657411244],
      [-122.41724252700804, 37.801603850614384],
      [-122.41612672805786, 37.80314669573162]
    ]
  }
};

it('test generateCurveFromControlPoints', () => {
  const result = generateCurveFromControlPoints(POLYLINE);
  expect(result).toMatchSnapshot();
});

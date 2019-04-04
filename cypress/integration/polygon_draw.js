import { nebulaInit, canvasClick, expectGeoJson } from '../utils';

describe('Nebula.gl test polygon creation', () => {
  it('Create new polygon', () => {
    nebulaInit();

    canvasClick(700, 100);
    canvasClick(800, 100);

    // double click to finish
    canvasClick(700, 200);
    canvasClick(700, 200);

    expectGeoJson(
      '{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-122.37133544921865,37.822401410052365],[-122.33700317382798,37.822401410052365],[-122.37133544921865,37.79527683771109],[-122.37133544921865,37.822401410052365]]]}}]}'
    );
  });
});

/* global cy */

let canvas;

const emptyGeoJson = { type: 'FeatureCollection', features: [] };

export function nebulaInit() {
  cy.visit('http://localhost:8080/');

  // clear existing geoJson
  cy.window().then(({ document }) => {
    document.getElementById('geo-json-text').value = JSON.stringify(emptyGeoJson);
  });
  // We need this logic because of React
  cy.get('#geo-json-text').type(' ');

  canvas = cy.get('#deckgl-overlay');
}

export function canvasClick(x, y) {
  canvas.trigger('pointerdown', x, y);
  canvas.trigger('pointermove', x, y);
  canvas.trigger('pointerup', x, y);
}

export function expectGeoJson(value) {
  cy.get('#geo-json-text').should('have.value', value);
}

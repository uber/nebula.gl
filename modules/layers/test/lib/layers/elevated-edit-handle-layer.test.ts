/* eslint-env jest */

import ElevatedEditHandleLayer from '../../../src/layers/elevated-edit-handle-layer';

// @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('ElevatedEditHandleLayer tests', () => {
  // @ts-expect-error ts-migrate(2593) FIXME: Cannot find name 'test'. Do you need to install ty... Remove this comment to see the full error message
  test('renderLayers()', () => {
    // @ts-expect-error ts-migrate(2555) FIXME: Expected at least 1 arguments, but got 0.
    const layer = new ElevatedEditHandleLayer();
    const render = layer.renderLayers();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(Array.isArray(render)).toBeTruthy();
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'expect'.
    expect(render.length).toBe(2);
  });
});

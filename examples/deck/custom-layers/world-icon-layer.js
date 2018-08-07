import { IconLayer } from 'deck.gl';
import worldIconShader from './world-icon-layer-vertex.glsl';

/*
 * WorldIconLayer
 *
 * Orients with the world rather than screen
 * Repurposes `getSize` to determine height in meters rather than pixels
 * Could be useful for icons which are too complex to render with Scatterplot/GeoJsonLayer
 *
 * Note that the Icons are rendered into a WebGL texture by the shader, so SVG's are not
 * useable. To improve appearance on max zoom:
 *  a) define heightMaxPixels to the size of the Icon in pixels
 *  b) make the .png image large to begin with
 */
export default class WorldIconLayer extends IconLayer {
  draw({ uniforms }) {
    const { heightMinPixels, heightMaxPixels, sizeUnit } = this.props;
    super.draw({
      uniforms: {
        ...uniforms,
        heightMinPixels,
        heightMaxPixels,
        scaleWithMap: sizeUnit === 'meter' ? 1.0 : 0.0
      }
    });
  }

  getShaders() {
    const shaders = Object.assign({}, super.getShaders(), {
      vs: worldIconShader
    });
    return shaders;
  }
}
WorldIconLayer.defaultProps = {
  ...IconLayer.defaultProps,
  sizeUnit: 'pixel',
  heightMinPixels: 0,
  heightMaxPixels: Number.MAX_SAFE_INTEGER
};

import { PathLayer } from '@deck.gl/layers';
import { PathLayerProps } from '@deck.gl/layers/path-layer/path-layer';
import GL from '@luma.gl/constants';
import { Framebuffer, Texture2D } from '@luma.gl/core';
import outline from '../../shaderlib/outline/outline';
import { UNIT } from '../../constants';

// TODO - this should be built into assembleShaders
function injectShaderCode({ source, code = '' }) {
  const INJECT_CODE = /}[^{}]*$/;
  return source.replace(INJECT_CODE, code.concat('\n}\n'));
}

const VS_CODE = `\
  outline_setUV(gl_Position);
  outline_setZLevel(instanceZLevel);
`;

const FS_CODE = `\
  gl_FragColor = outline_filterColor(gl_FragColor);
`;

export interface PathOutlineLayerProps<D> extends PathLayerProps<D> {
  dashJustified?: boolean;
  getDashArray?: [number, number] | ((d: D) => [number, number] | null);
  getZLevel?: (d: D, index: number) => number;
}

const defaultProps: PathOutlineLayerProps<any> = {
  getZLevel: () => 0,
};

export default class PathOutlineLayer<
  D,
  P extends PathOutlineLayerProps<D> = PathOutlineLayerProps<D>
> extends PathLayer<D, P> {
  static layerName = 'PathOutlineLayer';
  static defaultProps = defaultProps;

  // Override getShaders to inject the outline module
  getShaders() {
    const shaders = super.getShaders();
    return Object.assign({}, shaders, {
      modules: shaders.modules.concat([outline]),
      vs: injectShaderCode({ source: shaders.vs, code: VS_CODE }),
      fs: injectShaderCode({ source: shaders.fs, code: FS_CODE }),
    });
  }

  initializeState(context: any) {
    super.initializeState(context);

    // Create an outline "shadow" map
    // TODO - we should create a single outlineMap for all layers
    this.setState({
      outlineFramebuffer: new Framebuffer(context.gl),
      dummyTexture: new Texture2D(context.gl),
    });

    // Create an attribute manager
    this.state.attributeManager.addInstanced({
      instanceZLevel: {
        size: 1,
        type: GL.UNSIGNED_BYTE,
        accessor: 'getZLevel',
      },
    });
  }

  // Override draw to add render module
  draw({ moduleParameters = {}, parameters, uniforms, context }) {
    // Need to calculate same uniforms as base layer
    const {
      jointRounded,
      capRounded,
      billboard,
      miterLimit,
      widthUnits,
      widthScale,
      widthMinPixels,
      widthMaxPixels,
    } = this.props;

    uniforms = Object.assign({}, uniforms, {
      jointType: Number(jointRounded),
      capType: Number(capRounded),
      billboard,
      widthUnits: UNIT[widthUnits],
      widthScale,
      miterLimit,
      widthMinPixels,
      widthMaxPixels,
    });

    // Render the outline shadowmap (based on segment z orders)
    const { outlineFramebuffer, dummyTexture } = this.state;
    outlineFramebuffer.resize();
    outlineFramebuffer.clear({ color: true, depth: true });

    this.state.model.updateModuleSettings({
      outlineEnabled: true,
      outlineRenderShadowmap: true,
      outlineShadowmap: dummyTexture,
    });

    this.state.model.draw({
      uniforms: Object.assign({}, uniforms, {
        jointType: 0,
        widthScale: this.props.widthScale * 1.3,
      }),
      parameters: {
        depthTest: false,
        // Biggest value needs to go into buffer
        blendEquation: GL.MAX,
      },
      framebuffer: outlineFramebuffer,
    });

    // Now use the outline shadowmap to render the lines (with outlines)
    this.state.model.updateModuleSettings({
      outlineEnabled: true,
      outlineRenderShadowmap: false,
      outlineShadowmap: outlineFramebuffer,
    });
    this.state.model.draw({
      uniforms: Object.assign({}, uniforms, {
        jointType: Number(jointRounded),
        capType: Number(capRounded),
        widthScale: this.props.widthScale,
      }),
      parameters: {
        depthTest: false,
      },
    });
  }
}

// @flow
import Feature from './feature';
import type { RenderState } from './types';

export const DEFAULT_FEATURE_STYLES = {
  '*': {
    stroke: '#333333',
    fillOpacity: 0.2,
    strokeWidth: 2,
    radius: 6
  },
  selected: {
    strokeDasharray: '2,1',
    fill: '#ffff00',
    stroke: '#7ac943',
    fillOpacity: 0.5,
    radius: 10
  },
  hovered: {
    stroke: '#7ac943',
    fill: '#ffff00',
    strokeWidth: 4,
    fillOpacity: 0.4
  },
  LineString: {
    fill: 'none'
  }
};

export type StyleSheetProps = {
  '*': any,
  selected?: any,
  hovered?: any,
  LineString?: any,
  Point?: any,
  Polygon?: any,
  Rectangle?: any
};

export function getStyle(
  stylesheet: ?StyleSheetProps,
  feature: Feature,
  { hovered, selected }: RenderState
) {
  if (!feature) {
    return null;
  }

  const type = feature.renderType;

  if (typeof stylesheet === 'function') {
    return stylesheet(feature.toFeature(), { hovered, selected });
  }

  stylesheet = stylesheet || DEFAULT_FEATURE_STYLES;
  let baseStyle = { ...stylesheet['*'] };
  let typeStyle = type ? { ...stylesheet[type] } : {};

  if (selected) {
    baseStyle = {
      ...baseStyle,
      ...(stylesheet.selected || {})
    };
    typeStyle = {
      ...typeStyle,
      ...(type ? stylesheet[`${type} selected`] : null)
    };
  } else if (hovered) {
    baseStyle = {
      ...baseStyle,
      ...stylesheet.hovered
    };
    typeStyle = {
      ...typeStyle,
      ...(type ? stylesheet[`${type} selected`] : null)
    };
  }

  return { ...baseStyle, ...typeStyle };
}

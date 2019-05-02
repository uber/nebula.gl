export const DEFAULT_FEATURE_STYLES = {
  '*': {
    fill: '#202030',
    stroke: '#202020',
    fillOpacity: 0.2,
    strokeWidth: 2,
    radius: 6
  },
  selected: {
    strokeDasharray: '2,1',
    fill: '#204090',
    stroke: '#002090',
    fillOpacity: 0.5,
    radius: 10
  },
  hovered: {
    strokeWidth: 4,
    fillOpacity: 0.4
  },
  LineString: {
    fill: 'none'
  }
};

export function getStyle(stylesheet, feature, { selected, hovered }) {
  if (!feature) {
    return null;
  }

  const type = feature.renderType;

  if (typeof stylesheet === 'function') {
    return stylesheet(feature.toFeature(), { hovered, selected });
  }

  let baseStyle = { ...stylesheet['*'] };
  let typeStyle = { ...stylesheet[type] };

  if (selected) {
    baseStyle = {
      ...baseStyle,
      ...stylesheet.selected
    };
    typeStyle = {
      ...typeStyle,
      ...stylesheet[`${type} selected`]
    };
  } else if (hovered) {
    baseStyle = {
      ...baseStyle,
      ...stylesheet.hovered
    };
    typeStyle = {
      ...typeStyle,
      ...stylesheet[`${type} selected`]
    };
  }

  return { ...baseStyle, ...typeStyle };
}

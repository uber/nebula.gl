import { CompositeLayer } from 'deck.gl';

/* deck.gl util methods */
function flatten(array, { filter = () => true, map = x => x, result = [] } = {}) {
  // Wrap single object in array
  if (!Array.isArray(array)) {
    return filter(array) ? [map(array)] : [];
  }
  // Deep flatten and filter the array
  return flattenArray(array, filter, map, result);
}

// Deep flattens an array. Helper to `flatten`, see its parameters
function flattenArray(array, filter, map, result) {
  let index = -1;
  while (++index < array.length) {
    const value = array[index];
    if (Array.isArray(value)) {
      flattenArray(value, filter, map, result);
    } else if (filter(value)) {
      result.push(map(value));
    }
  }
  return result;
}

export default class ConfigurableCompositeLayer extends CompositeLayer {
  _renderLayers() {
    let { subLayers } = this.internalState;
    if (subLayers && !this.needsUpdate()) {
      // log.log(3, `Composite layer reused subLayers ${this}`, this.internalState.subLayers)();
    } else {
      subLayers = this.renderLayers();
      subLayers = this.handleOverrides(subLayers);
      // Flatten the returned array, removing any null, undefined or false
      // this allows layers to render sublayers conditionally
      // (see CompositeLayer.renderLayers docs)
      subLayers = flatten(subLayers, { filter: Boolean });
      this.internalState.subLayers = subLayers;
      // log.log(2, `Composite layer rendered new subLayers ${this}`, subLayers)();
    }

    // populate reference to parent layer (this layer)
    // NOTE: needs to be done even when reusing layers as the parent may have changed
    for (const layer of subLayers) {
      layer.parent = this;
    }
  }

  // if overrides exist, matches sublayers to override and creates a new layer
  // otherwise returns existing layer
  handleOverrides(subLayers) {
    const { layerOverrides } = this.props;
    if (!layerOverrides) {
      return subLayers;
    }
    return subLayers.map(subLayer => {
      const subLayerId = subLayer.id.slice(this.props.id.length + 1);

      if (layerOverrides.hasOwnProperty(subLayerId)) {
        const override = layerOverrides[subLayerId];
        return new override.Layer(
          this.getSubLayerProps({
            ...override.Layer.defaultProps,

            id: subLayer.id,
            data: subLayer.props.data,
            ...override.props,
            ...this.wrapAccessors(override.accessors)
          })
        );
      }
      // no override
      return subLayer;
    });
  }

  // updates all acessors with context given by wrapAccessorWithContext()
  wrapAccessors(accessors) {
    const awareAccessors = { ...accessors };
    Object.keys(awareAccessors).forEach(
      key => (awareAccessors[key] = this.wrapAccessorWithContext(awareAccessors[key]))
    );
    return awareAccessors;
  }

  wrapAccessorWithContext(fn) {
    // default: do nothing
    return fn;
  }
}

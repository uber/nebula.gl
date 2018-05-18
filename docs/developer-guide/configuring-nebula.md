# Configuring Nebula

> While deck.gl v5.2 can be used without React, Nebula.gl is currently React only.

To use Nebula.gl, you instantiate the Nebula React component, usually.

```js
render() {
  const { editablePolygonsLayer, state } = this;
  let { viewport } = state;

  const layers = [editablePolygonsLayer];

  return (
    <div>
      <MapGL {...viewport} onChangeViewport={this._onChangeViewport}>
        <Nebula
          ref={nebula => (this.nebula = nebula || this.nebula)}
          {...{ layers, viewport }}
        />
      </MapGL>
    </div>
  );
}

_onChangeViewport = (viewport: Object) => {
  this.setState({
    viewport: { ...this.state.viewport, ...viewport }
  });
};
```

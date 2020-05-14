# HtmlOverlay

Use this class if you have HTML items that need to be displayed at specific geo coordinates on the map.
If you need clustering see [HtmlClusterOverlay](/docs/api-reference/overlays/html-cluster-overlay).
You can subclass this class or provide [HtmlOverlayItem](/docs/api-reference/overlays/html-overlay-item) as children.
Then use it as a `react component` inside `DeckGL`.

```jsx
<DeckGL initialViewState={initialViewState} controller={true}>
  <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
  <HtmlOverlay>
    <HtmlOverlayItem coordinates={coordinates}>{title}</HtmlOverlayItem>
  </HtmlOverlay>
</DeckGL>
```

Or if you prefer to subclass:

```jsx
class YourClassName extends HtmlOverlay {
  getItems() {
    return [
      <HtmlOverlayItem
        style={{ ...your style here... }}
        key={ ... unique key... }
        coordinates={[-122.41914, 37.77919]}
      >
        You can have text and children like <div>...</div>
      </HtmlOverlayItem>
    ];
  }
}
```

## Properties

### zIndex

Default is `1`. Set to `0` to move items _under_ deck.gl layer.

## Methods to override

### getItems()

Provide an array of [HtmlOverlayItem](/docs/api-reference/overlays/html-overlay-item)
if not providing them as JSX children.

# Using Html Overlays

HTML overlays are very easy to use and take advantage of [react's architecture](https://reactjs.org/docs/).

Checkout the [basic overlay example](examples/overlays/basic)



```js
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

You need to extend `HtmlOverlay` and override `getItems`, where you
return an array of `HtmlOverlayItem`.

You need to provide a unique `key` and `coordinates` for each item.

See [Html Overlay Item docs](documentation/api-reference/htmloverlayitem) for more details.



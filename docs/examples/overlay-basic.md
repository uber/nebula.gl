# Basic Overlay Example


<!-- INJECT:"BasicOverlayExample" -->


```js
class SFCityHall extends HtmlOverlay {
  getItems() {
    return [
      <HtmlOverlayItem
        style={{ background: 'red', padding: 4, color: 'white' }}
        key={0}
        coordinates={[-122.41914, 37.77919]}
      >
        SF City Hall
      </HtmlOverlayItem>
    ];
  }
}
```



# HtmlOverlayItem

This is an HTML item that will be rendered inside
[HtmlOverlay](documentation/api-reference/htmloverlay) or
[HtmlClusterOverlay](documentation/api-reference/htmlclusteroverlay).


```js
return (
  <HtmlOverlayItem
    style={{
      transform: 'translate(-50%,-50%)',
      pointerEvents: 'all'
    }}
    coordinates={coordinates}
    key={key}
  >
    YOUR CONTENT HERE.
  </HtmlOverlayItem>
);
```

## Props
### coordinates
Array of two numbers where this will be displayed.

## Best practices

### Anchor point
By default the top-left corner will align with the provided `coordinates`.
You can use CSS to change the **anchor point**.
For example use `transform: 'translate(-50%,-50%)'` to center.


### Mouse events
By default this will not receive any mouse events.
Use `pointerEvents: 'all'` to receive events.


### Key property
Because this is used inside an array of `react components` you
need to provide a unique `key`. See the [React docs](https://reactjs.org/docs/lists-and-keys.html)


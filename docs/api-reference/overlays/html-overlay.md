# HtmlOverlay

Use this class if you have HTML items that need to be displayed at specific geo coordinates on the map.
If you need clustering see [HtmlClusterOverlay](documentation/api-reference/htmlclusteroverlay).
**You need to subclass this class.** Then use it as a `react component` inside `Nebula`.


```js
<Nebula
  ref={nebula => (this.nebula = nebula || this.nebula)}
  {...{ layers, viewport }}
>
  <YourNewClass />
</Nebula>
```


## Methods to override
### getItems()
Provide an array of [HtmlOverlayItem](documentation/api-reference/htmloverlayitem).



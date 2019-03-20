# HtmlOverlay

Use this class if you have HTML items that need to be displayed at specific geo coordinates on the map.
If you need clustering see [HtmlClusterOverlay](documentation/api-reference/htmlclusteroverlay).
**You need to subclass this class.** Then use it as a `react component` inside `Nebula`.


```js
<Deck ...>
  <YourNewClass />
</Deck>
```

## Properties
### zIndex

Default is `1`. Set to `0` to move items _under_ deck.gl layer.

## Methods to override
### getItems()
Provide an array of [HtmlOverlayItem](documentation/api-reference/htmloverlayitem).



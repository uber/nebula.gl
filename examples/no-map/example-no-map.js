import { BitmapLayer } from '@deck.gl/layers';
import Example from '../deck/example';

// https://en.wikipedia.org/wiki/Wikipedia:Featured_pictures/Animals/Birds#/media/File:Dendrocygna_eytoni_-_Macquarie_University.jpg
// JJ Harrison (jjharrison89@facebook.com) - Own work - CC BY-SA 4.0
const IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/1/1b/Dendrocygna_eytoni_-_Macquarie_University.jpg';

export default class ExampleNoMap extends Example {
  constructor() {
    super();
    this.state.viewport = {
      bearing: 0,
      height: 0,
      latitude: 0,
      longitude: 0,
      pitch: 0,
      width: 0,
      zoom: 5,
    };
  }

  renderStaticMap(viewport) {
    return null;
  }

  customizeLayers(layers) {
    layers.unshift(
      new BitmapLayer({
        id: 'bitmap-layer',
        bounds: [-10, -10, +10, +10],
        image: IMAGE,
      })
    );
  }
}

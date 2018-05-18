// @flow
import EventEmitter from 'events';
import uuid from 'uuid';

import Feature from './feature';

export default class NebulaLayer extends EventEmitter {
  getData: () => Object[];
  toNebulaFeature: (data: Object) => Feature;
  id: string;
  helperLayers: Object[];

  // flags
  usesMapEvents: boolean = false;
  enablePicking: boolean = false;
  enableSelection: boolean = false;
  //

  constructor({ getData, on, toNebulaFeature }: Object) {
    super();
    this.id = uuid.v4();
    this.getData = getData;
    this.toNebulaFeature = toNebulaFeature;
    this.helperLayers = [];

    if (on) {
      Object.keys(on).forEach(key => this.on(key, on[key]));
    }
  }

  render(config: Object) {
    return null;
  }
}

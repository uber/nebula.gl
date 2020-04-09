import Event from 'events';
import uuid from 'uuid';

import Feature from './feature';

export default class NebulaLayer extends Event.EventEmitter {
  getData: () => Record<string, any>[];
  toNebulaFeature: (data: Record<string, any>) => Feature;
  id: string;
  helperLayers: Record<string, any>[];

  // flags
  usesMapEvents = false;
  enablePicking = false;
  enableSelection = false;
  //

  constructor({ getData, on, toNebulaFeature }: Record<string, any>) {
    super();
    this.id = uuid.v4();
    this.getData = getData;
    this.toNebulaFeature = toNebulaFeature;
    this.helperLayers = [];

    if (on) {
      // @ts-ignore
      Object.keys(on).forEach((key) => this.on(key, on[key]));
    }
  }

  render(config: Record<string, any>): unknown {
    return null;
  }
}

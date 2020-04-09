import { ClickEvent, PointerMoveEvent, ModeProps } from '../types';
import { FeatureCollection } from '../geojson-types';
import { GeoJsonEditMode } from './geojson-edit-mode';

export class DrawPointMode extends GeoJsonEditMode {
  handleClick({ mapCoords }: ClickEvent, props: ModeProps<FeatureCollection>): void {
    const geometry = {
      type: 'Point',
      coordinates: mapCoords,
    };
    // @ts-ignore
    props.onEdit(this.getAddFeatureAction(geometry, props.data));
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    props.onUpdateCursor('cell');
  }
}

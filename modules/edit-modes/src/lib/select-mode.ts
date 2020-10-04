import { ClickEvent, ModeProps, PointerMoveEvent } from '../types';
import { FeatureCollection } from '../geojson-types';
import { GeoJsonEditMode } from './geojson-edit-mode';

export class SelectMode extends GeoJsonEditMode {
  handleClick(
    { picks, screenCoords }: ClickEvent,
    { data, onSelectionChanged }: ModeProps<FeatureCollection>
  ): void {
    picks = picks || [];
    const selectedIndexes = new Set(picks.map(({ object }) => data.features.indexOf(object)));

    onSelectionChanged({
      selectedIndexes: [...selectedIndexes].sort(),
      selectContext: {
        screenCoords,
      },
    });
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void {
    const picks = (event && event.picks) || [];

    let cursor = null;
    if (picks.length) {
      cursor = 'pointer';
    }

    props.onUpdateCursor(cursor);
  }
}

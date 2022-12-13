import { Geometry } from '@nebula.gl/edit-modes';
import { ClickEvent } from '../event-types';
import { EditAction, ModeHandler } from './mode-handler';

// TODO edit-modes: delete handlers once EditMode fully implemented
export class DrawPointHandler extends ModeHandler {
  handleClick({ groundCoords }: ClickEvent): EditAction | null | undefined {
    const geometry: Geometry = {
      type: 'Point',
      coordinates: groundCoords,
    };

    return this.getAddFeatureAction(geometry);
  }
}

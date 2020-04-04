import { ClickEvent } from '../event-types';
import { EditAction, ModeHandler } from './mode-handler';

// TODO edit-modes: delete handlers once EditMode fully implemented
export class DrawPointHandler extends ModeHandler {
  handleClick({ groundCoords }: ClickEvent): EditAction | null | undefined {
    const geometry = {
      type: 'Point',
      coordinates: groundCoords,
    };
    // @ts-ignore
    return this.getAddFeatureAction(geometry);
  }
}

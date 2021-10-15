import { ClickEvent } from '../event-types';
import { EditAction, ModeHandler } from './mode-handler';

// TODO edit-modes: delete handlers once EditMode fully implemented
export class DrawPointHandler extends ModeHandler {
  handleClick({ groundCoords }: ClickEvent): EditAction | null | undefined {
    const geometry = {
      type: 'Point',
      coordinates: groundCoords,
    };
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ type: string; coordinates: Pos... Remove this comment to see the full error message
    return this.getAddFeatureAction(geometry);
  }
}

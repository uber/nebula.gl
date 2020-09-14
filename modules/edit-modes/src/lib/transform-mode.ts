import { featureCollection } from '@turf/helpers';
import { PointerMoveEvent, ModeProps, StartDraggingEvent } from '../types';
import { FeatureCollection } from '../geojson-types';
import { TranslateMode } from './translate-mode';
import { ScaleMode } from './scale-mode';
import { RotateMode } from './rotate-mode';

import { CompositeMode } from './composite-mode';

export class TransformMode extends CompositeMode {
  constructor() {
    super([new TranslateMode(), new ScaleMode(), new RotateMode()]);
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    let updatedCursor = null;
    super.handlePointerMove(event, {
      ...props,
      onUpdateCursor: (cursor) => {
        updatedCursor = cursor || updatedCursor;
      },
    });
    props.onUpdateCursor(updatedCursor);
  }

  handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>) {
    let scaleMode = null;
    let translateMode = null;
    const filteredModes = [];

    // If the user selects a scaling edit handle that overlaps with part of the selected feature,
    // it is possible for both scale and translate actions to be triggered. This logic prevents
    // this simultaneous action trigger from happening by putting a higher priority on scaling
    // since the user needs to be more precise to hover over a scaling edit handle.
    this._modes.forEach((mode) => {
      if (mode instanceof TranslateMode) {
        translateMode = mode;
      } else {
        if (mode instanceof ScaleMode) {
          scaleMode = mode;
        }
        filteredModes.push(mode);
      }
    });

    if (scaleMode instanceof ScaleMode && !scaleMode.isEditHandleSelected()) {
      filteredModes.push(translateMode);
    }

    filteredModes.filter(Boolean).forEach((mode) => mode.handleStartDragging(event, props));
  }

  getGuides(props: ModeProps<FeatureCollection>) {
    let compositeGuides = super.getGuides(props);
    const rotateMode = (this._modes || []).find((mode) => mode instanceof RotateMode);

    if (rotateMode instanceof RotateMode) {
      const nonEnvelopeGuides = compositeGuides.features.filter((guide) => {
        const { editHandleType, mode } = (guide.properties as any) || {};
        // Both scale and rotate modes have the same enveloping box as a guide - only need one
        const guidesToFilterOut = [mode];
        // Do not render scaling edit handles if rotating
        if (rotateMode.getIsRotating()) {
          guidesToFilterOut.push(editHandleType);
        }
        return !guidesToFilterOut.includes('scale');
      });
      // @ts-ignore
      compositeGuides = featureCollection(nonEnvelopeGuides);
    }
    return compositeGuides;
  }
}

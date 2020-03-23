// @flow

import type { ClickEvent, ModeProps } from '../types.js';
import type { Polygon, FeatureCollection } from '../geojson-types.js';
import { getPickedEditHandle } from '../utils.js';
import { DrawPolygonMode } from './draw-polygon-mode';

export class DrawLassoMode extends DrawPolygonMode {
    handleClick() {
        // No-op
    }

    handleStartDragging() {
        // No-op
    }

    handleStopDragging(event: ClickEvent, props: ModeProps<FeatureCollection>) {
        this.addClickSequence(event);
        const clickSequence = this.getClickSequence();

        if (clickSequence.length > 2) {
            // Complete the polygon.
            const polygonToAdd: Polygon = {
                type: 'Polygon',
                coordinates: [[...clickSequence, clickSequence[0]]]
            };

            this.resetClickSequence();

            const editAction = this.getAddFeatureOrBooleanPolygonAction(polygonToAdd, props);
            if (editAction) {
                props.onEdit(editAction);
            }
        }
    }

    handleDragging(event: ClickEvent, props: ModeProps<FeatureCollection>) {
        const { picks } = event;
        const clickedEditHandle = getPickedEditHandle(picks);

        if (!clickedEditHandle) {
            // Don't add another point right next to an existing one.
            this.addClickSequence(event);
        }
    }
}

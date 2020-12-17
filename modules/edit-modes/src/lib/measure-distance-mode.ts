import turfDistance from '@turf/distance';
import { FeatureCollection } from '../geojson-types';
import { ClickEvent, PointerMoveEvent, ModeProps, GuideFeatureCollection, Tooltip } from '../types';
import { getPickedEditHandle } from '../utils';
import { GeoJsonEditMode } from './geojson-edit-mode';
import memoize from '../memoize';

export class MeasureDistanceMode extends GeoJsonEditMode {
  _isMeasuringSessionFinished = false;
  _currentTooltips = [];
  _currentDistance = 0;

  _calculateDistanceForTooltip = memoize(({ positionA, positionB, modeConfig }) => {
    const { turfOptions, measurementCallback } = modeConfig || {};
    const distance = turfDistance(positionA, positionB, turfOptions);

    if (measurementCallback) {
      measurementCallback(distance);
    }

    return distance;
  });

  _formatTooltip(distance, modeConfig?) {
    const { formatTooltip, turfOptions } = modeConfig || {};
    const units = (turfOptions && turfOptions.units) || 'kilometers';

    let text;
    if (formatTooltip) {
      text = formatTooltip(distance);
    } else {
      // By default, round to 2 decimal places and append units
      text = `${parseFloat(distance).toFixed(2)} ${units}`;
    }

    return text;
  }

  handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>) {
    const { modeConfig, data, onEdit } = props;

    // restart measuring session
    if (this._isMeasuringSessionFinished) {
      this._isMeasuringSessionFinished = false;
      this.resetClickSequence();
      this._currentTooltips = [];
      this._currentDistance = 0;
    }

    const { picks } = event;
    const clickedEditHandle = getPickedEditHandle(picks);

    let positionAdded = false;
    if (!clickedEditHandle) {
      // Don't add another point right next to an existing one
      this.addClickSequence(event);
      positionAdded = true;
    }
    const clickSequence = this.getClickSequence();

    if (
      clickSequence.length > 1 &&
      clickedEditHandle &&
      Array.isArray(clickedEditHandle.properties.positionIndexes) &&
      clickedEditHandle.properties.positionIndexes[0] === clickSequence.length - 1
    ) {
      // They clicked the last point (or double-clicked), so add the LineString
      this._isMeasuringSessionFinished = true;
    } else if (positionAdded) {
      if (clickSequence.length > 1) {
        this._currentDistance += this._calculateDistanceForTooltip({
          positionA: clickSequence[clickSequence.length - 2],
          positionB: clickSequence[clickSequence.length - 1],
          modeConfig: modeConfig,
        });
        this._currentTooltips.push({
          position: event.mapCoords,
          text: this._formatTooltip(this._currentDistance, modeConfig),
        });

        // finish measuring session on second click if multipoint is not specified
        if (clickSequence.length === 2 && !modeConfig?.multipoint) {
          this._isMeasuringSessionFinished = true;
        }
      }

      // new tentative point
      onEdit({
        // data is the same
        updatedData: data,
        editType: 'addTentativePosition',
        editContext: {
          position: event.mapCoords,
        },
      });
    }
  }

  handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>) {
    const { key } = event;
    if (key === 'Enter') {
      const clickSequence = this.getClickSequence();
      if (clickSequence.length > 1) {
        this._isMeasuringSessionFinished = true;
      }
    }
  }

  getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection {
    const { lastPointerMoveEvent } = props;
    const clickSequence = this.getClickSequence();

    const lastCoords =
      lastPointerMoveEvent && !this._isMeasuringSessionFinished
        ? [lastPointerMoveEvent.mapCoords]
        : [];

    const guides = {
      type: 'FeatureCollection',
      features: [],
    };

    if (clickSequence.length > 0) {
      guides.features.push({
        type: 'Feature',
        properties: {
          guideType: 'tentative',
        },
        geometry: {
          type: 'LineString',
          coordinates: [...clickSequence, ...lastCoords],
        },
      });
    }

    const editHandles = clickSequence.map((clickedCoord, index) => ({
      type: 'Feature',
      properties: {
        guideType: 'editHandle',
        editHandleType: 'existing',
        featureIndex: -1,
        positionIndexes: [index],
      },
      geometry: {
        type: 'Point',
        coordinates: clickedCoord,
      },
    }));

    guides.features.push(...editHandles);
    // @ts-ignore
    return guides;
  }

  handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>) {
    props.onUpdateCursor('cell');
  }

  getTooltips(props: ModeProps<FeatureCollection>): Tooltip[] {
    const { lastPointerMoveEvent, modeConfig } = props;
    const positions = this.getClickSequence();

    if (positions.length > 0 && lastPointerMoveEvent && !this._isMeasuringSessionFinished) {
      const distance = this._calculateDistanceForTooltip({
        positionA: positions[positions.length - 1],
        positionB: lastPointerMoveEvent.mapCoords,
        modeConfig: props.modeConfig,
      });
      return [
        ...this._currentTooltips,
        {
          position: lastPointerMoveEvent.mapCoords,
          text: this._formatTooltip(this._currentDistance + distance, modeConfig),
        },
      ];
    } else {
      return this._currentTooltips;
    }
  }
}

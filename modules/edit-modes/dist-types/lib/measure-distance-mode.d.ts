import { FeatureCollection } from '../geojson-types';
import { ClickEvent, PointerMoveEvent, ModeProps, GuideFeatureCollection, Tooltip } from '../types';
import { GeoJsonEditMode } from './geojson-edit-mode';
export declare class MeasureDistanceMode extends GeoJsonEditMode {
    _isMeasuringSessionFinished: boolean;
    _currentTooltips: any[];
    _currentDistance: number;
    _calculateDistanceForTooltip: ({ positionA, positionB, modeConfig }: {
        positionA: any;
        positionB: any;
        modeConfig: any;
    }) => any;
    _formatTooltip(distance: any, modeConfig?: any): any;
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    handleKeyUp(event: KeyboardEvent, props: ModeProps<FeatureCollection>): void;
    getGuides(props: ModeProps<FeatureCollection>): GuideFeatureCollection;
    handlePointerMove(event: PointerMoveEvent, props: ModeProps<FeatureCollection>): void;
    getTooltips(props: ModeProps<FeatureCollection>): Tooltip[];
}
//# sourceMappingURL=measure-distance-mode.d.ts.map
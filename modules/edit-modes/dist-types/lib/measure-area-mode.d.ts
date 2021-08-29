import { ClickEvent, Tooltip, ModeProps } from '../types';
import { FeatureCollection } from '../geojson-types';
import { DrawPolygonMode } from './draw-polygon-mode';
export declare class MeasureAreaMode extends DrawPolygonMode {
    handleClick(event: ClickEvent, props: ModeProps<FeatureCollection>): void;
    getTooltips(props: ModeProps<FeatureCollection>): Tooltip[];
}
//# sourceMappingURL=measure-area-mode.d.ts.map
import { StartDraggingEvent, ModeProps } from '../types';
import { FeatureCollection } from '../geojson-types';
import { TranslateMode } from './translate-mode';
export declare class DuplicateMode extends TranslateMode {
    handleStartDragging(event: StartDraggingEvent, props: ModeProps<FeatureCollection>): void;
    updateCursor(props: ModeProps<FeatureCollection>): void;
}
//# sourceMappingURL=duplicate-mode.d.ts.map
/// <reference types="react" />
import HtmlOverlay from './html-overlay';
declare type State = {
    visible: boolean;
    pickingInfo: Record<string, any> | null | undefined;
};
export default class HtmlTooltipOverlay extends HtmlOverlay {
    constructor(props: any);
    componentWillMount(): void;
    timeoutID: number | null | undefined;
    state: State;
    _getTooltip(pickingInfo: Record<string, any>): string;
    _makeOverlay(): JSX.Element;
    getItems(): Array<Record<string, any> | null | undefined>;
}
export {};
//# sourceMappingURL=html-tooltip-overlay.d.ts.map
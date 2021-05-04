import * as React from 'react';
export default class HtmlOverlay extends React.Component<{
    viewport?: Record<string, any>;
    zIndex?: number;
    children?: React.ReactNode;
}, any> {
    getItems(): Array<any>;
    getCoords(coordinates: number[]): [number, number];
    inView([x, y]: number[]): boolean;
    scaleWithZoom(n: number): number;
    breakpointWithZoom(threshold: number, a: any, b: any): any;
    getViewport(): Record<string, any>;
    getZoom(): any;
    render(): JSX.Element;
}
//# sourceMappingURL=html-overlay.d.ts.map
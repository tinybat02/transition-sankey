declare module 'react-vis' {
  import {
    Component,
    PureComponent,
    ReactChild,
    ReactNode,
    SFC,
    MouseEventHandler,
    TouchEventHandler,
    WheelEventHandler,
    MouseEvent,
    CSSProperties,
  } from 'react';

  export interface AbstractSeriesPoint {
    [key: string]: any;
  }

  export interface SankeyPoint extends AbstractSeriesPoint {
    name: string;
    color?: string;
    opacity?: number;
    key?: string;
  }

  export type RVValueEventHandler<T extends AbstractSeriesPoint> = (datapoint: T, event: MouseEvent<HTMLElement>) => void;

  export class Sankey extends React.Component<SankeyProps> {}

  interface SankeyProps {
    width: number;
    height: number;
    hasVoronoi?: boolean;

    nodes: SankeyPoint[];
    links: Array<{
      source: { [key: string]: any };
      target: { [key: string]: any };
    }>;
    style: { [key: string]: any };
    onLinkMouseOver?: RVValueEventHandler<T>;
    onLinkMouseOut?: RVValueEventHandler<T>;
  }

  export interface HintProps {
    marginTop?: number;
    marginLeft?: number;
    innerWidth?: number;
    innerHeight?: number;
    scales?: { [key: string]: any };
    value?: { [key: string]: any };
    format?: Function;
    style?: CSSProperties; //default: {}
    align?: {
      horizontal?: 'auto' | 'left' | 'right' | 'leftEdge' | 'rightEdge';
      vertical?: 'auto' | 'bottom' | 'top' | 'bottomEdge' | 'topEdge';
    }; //default: {'horizontal':'auto','vertical':'auto'}
    getAlignStyle?: RVGetAlignStyle;
    orientation?: 'bottomleft' | 'bottomright' | 'topleft' | 'topright';
  }
  export class Hint<T = any> extends PureComponent<HintProps & T> {}
}

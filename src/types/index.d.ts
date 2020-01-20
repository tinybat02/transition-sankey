declare module 'react-vis' {
  export class Sankey extends React.Component<SankeyProps> {}

  interface SankeyProps {
    width: number;
    height: number;

    nodes: any;
    links: any;
    style: any;
  }
}

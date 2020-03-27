import React, { PureComponent } from 'react';
import { PanelProps, Vector as VectorData } from '@grafana/data';
import { SimpleOptions } from 'types';
import 'react-vis/dist/style.css';
import { Sankey, Hint, SankeyPoint } from 'react-vis';

const BLURRED_LINK_OPACITY = 0.3;
const FOCUSED_LINK_OPACITY = 0.6;

interface Link {
  source: { x1: number; name: string };
  target: { x0: number; name: string };
  y0: number;
  y1: number;
  value: number;
  index: number;
}

type ALink = Link | null;

interface State {
  nodes: any;
  links: any;
  activeLink: ALink;
}

interface Buffer extends VectorData {
  buffer: number[];
}

interface Props extends PanelProps<SimpleOptions> {}

export class MainPanel extends PureComponent<Props> {
  state: State = {
    nodes: [],
    links: [],
    activeLink: null,
  };

  componentDidMount() {
    const { buffer: bufferSource } = this.props.data.series[0].fields[0].values as Buffer;
    const { buffer: bufferTarget } = this.props.data.series[0].fields[1].values as Buffer;
    const { buffer: bufferValue } = this.props.data.series[0].fields[2].values as Buffer;

    const lookUp = [...new Set([...bufferSource, ...bufferTarget])];
    const nodes = lookUp.map(item => ({ name: item }));
    const links = bufferSource.map((item, index) => ({
      source: lookUp.indexOf(item),
      target: lookUp.indexOf(bufferTarget[index]),
      value: bufferValue[index],
    }));
    this.setState({ nodes, links });
  }

  _renderHint() {
    const { activeLink } = this.state;

    // calculate center x,y position of link for positioning of hint
    if (activeLink) {
      const x = activeLink.source.x1 + (activeLink.target.x0 - activeLink.source.x1) / 2;
      const y = activeLink.y0 - (activeLink.y0 - activeLink.y1) / 2;

      const hintValue = {
        [`${activeLink.source.name} ➞ ${activeLink.target.name}`]: activeLink.value,
      };
      return <Hint x={x} y={y} value={hintValue} />;
    }
    return <div />;
  }

  render() {
    const { width, height } = this.props;
    const { activeLink } = this.state;

    const { nodes, links } = this.state;
    if (nodes.length === 0) {
      return <div />;
    }

    return (
      <Sankey
        nodes={nodes.map((d: SankeyPoint) => ({ ...d }))}
        links={links.map((d: Link, i: number) => ({
          ...d,
          opacity: activeLink && i === activeLink.index ? FOCUSED_LINK_OPACITY : BLURRED_LINK_OPACITY,
        }))}
        width={width}
        height={height}
        style={{ labels: { font: 20 } }}
        hasVoronoi={false}
        onLinkMouseOver={(node: Link) => this.setState({ activeLink: node })}
        onLinkMouseOut={() => this.setState({ activeLink: null })}
      >
        {activeLink && this._renderHint()}
      </Sankey>
    );
  }
}

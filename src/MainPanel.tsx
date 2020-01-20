import React, { PureComponent } from 'react';
import { PanelProps, Vector as VectorData } from '@grafana/data';
import { SimpleOptions } from 'types';
import 'react-vis/dist/style.css';
import { Sankey } from 'react-vis';

interface Buffer extends VectorData {
  buffer: number[];
}

interface Props extends PanelProps<SimpleOptions> {}

export class MainPanel extends PureComponent<Props> {
  state = {
    nodes: [],
    links: [],
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

  render() {
    const { width, height } = this.props;

    const { nodes, links } = this.state;
    if (nodes.length === 0) {
      return <div />;
    }

    return <Sankey nodes={nodes} links={links} width={width} height={height} style={{ labels: { font: 20 } }} />;
  }
}

import './style.scss';
import {
  createElementWithAttributes,
  createElementWithClassnames,
  // createElementWithContent,
} from "../utils";
import { setLongTermGraph } from '../../controller/ui';

export class LongStats {

  stats: { string?: number[] | undefined}[]| undefined;

  constructor(stats: { string?: number[] | undefined}[] | undefined){
    this.stats = stats;
  }

  create(): HTMLElement {
    const longStatsContainer = createElementWithClassnames('div', 'long-stats');

    const graphHTMLElemOptions = {
      id: `long-graph`,
      class: `graph`
    }
    const graph = createElementWithAttributes('canvas', graphHTMLElemOptions);
    const data = this.stats;
    setLongTermGraph((graph as HTMLCanvasElement), data);
    longStatsContainer.append(graph);
    return longStatsContainer;
  }
}
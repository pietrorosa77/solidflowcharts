import { render } from "solid-js/web";
import { ExtendedNode, IChart } from "../definitions";
import Diagram from "./diagram/Diagram";
import { ISidebarNode } from "./sidebar/Sidebar";
import { IChartActions } from "./store/chartStore";

interface IDGProps {
  chart: IChart;
  fontFace?: string;
  onNodeSettingsClick?: (node: ExtendedNode) => void;
  onLoad?: (ctions: IChartActions) => void;
  onHistoryChange?: (chart: IChart) => void;
  availableNodes: ISidebarNode[];
  root?: any;
  width?: string;
  height?: string;
}

export default function FChart(props: IDGProps, elementId: string) {
  render(
    () => (
      <Diagram
        chart={props.chart}
        width={props.width}
        height={props.height}
        root={props.root || document}
        fontFace={props.fontFace}
        availableNodes={props.availableNodes}
        onNodeSettingsClick={props.onNodeSettingsClick}
        onHistoryChange={props.onHistoryChange}
        onLoad={props.onLoad}
      />
    ),
    document.getElementById(elementId) as HTMLElement
  );
}

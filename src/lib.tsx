import { render } from "solid-js/web";
import { ExtendedNode, IChart } from "../definitions";
import Diagram from "./diagram/Diagram";
import { ISidebarNode } from "./sidebar/Sidebar";
import { IChartActions } from "./store/chartStore";
import { ICustomTheme } from "./defaultTheme";

interface IDGProps {
  chart: IChart;
  fontFace?: string;
  onLoad?: (ctions: IChartActions) => void;
  onHistoryChange?: (chart: IChart) => void;
  onNodeChanged?: (oldNode: ExtendedNode, newNode: ExtendedNode) => void;
  availableNodes: ISidebarNode[];
  root?: any;
  width?: string;
  height?: string;
  customTheme?: ICustomTheme;
  onCustomEditNode?: (node: ExtendedNode) => void;
  customNodeContentRenderer?: (node: ExtendedNode) => void;
}

export function FChart(props: IDGProps, elementId: string) {
  render(
    () => (
      <Diagram
        initialChart={props.chart}
        width={props.width}
        height={props.height}
        root={props.root || document}
        fontFace={props.fontFace}
        availableNodes={props.availableNodes}
        onHistoryChange={props.onHistoryChange}
        onNodeChanged={props.onNodeChanged}
        onLoad={props.onLoad}
        customTheme={props.customTheme}
        onCustomEditNode={props.onCustomEditNode}
        customNodeContentRenderer={props.customNodeContentRenderer}
      />
    ),
    document.getElementById(elementId) as HTMLElement,
  );
}

import { render } from "solid-js/web";
import { ExtendedNode, IChart } from "../definitions";
import Diagram from "./diagram/Diagram";
import { NodeContentReadonly } from "./node/NodeContent";
import { ISidebarNode } from "./sidebar/Sidebar";
import { IChartActions } from "./store/chartStore";
import "./index.css";
import { getCssVariables } from "./defaultTheme";

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
  messageSeparator: string;
}

export function FChart(props: IDGProps, elementId: string) {
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
        messageSeparator={props.messageSeparator}
      />
    ),
    document.getElementById(elementId) as HTMLElement
  );
}

export function NodeRenderer(
  props: {
    content: string;
    messageSeparator: string;
  },
  id: string
) {
  const cssVariables = {
    ...getCssVariables("100%", "100%"),
    width: "100%",
    height: "100%",
  };

  render(
    () => (
      <div style={cssVariables}>
        <NodeContentReadonly
          content={props.content}
          separator={props.messageSeparator}
        />
      </div>
    ),
    document.getElementById(id) as HTMLElement
  );
}

import { render } from "solid-js/web";
import { ExtendedNode, IChart } from "../definitions";
import Diagram from "./diagram/Diagram";
import { ISidebarNode } from "./sidebar/Sidebar";
import { IChartActions } from "./store/chartStore";
import { ICustomTheme } from "./defaultTheme";
export * from "./components/EditorJsExtensions";

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
  customTheme?: ICustomTheme;
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
        onNodeSettingsClick={props.onNodeSettingsClick}
        onHistoryChange={props.onHistoryChange}
        onLoad={props.onLoad}
        customTheme={props.customTheme}
      />
    ),
    document.getElementById(elementId) as HTMLElement
  );
}

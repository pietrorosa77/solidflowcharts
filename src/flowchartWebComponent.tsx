import { customElement } from "solid-element";
import { ExtendedNode, IChart } from "../definitions";
import DiagramWrapper from "./diagram/Diagram";
import { IChartActions } from "./store/chartStore";

const DumbotDiagramWC = customElement(
  "dumbot-flowchart",
  {
    chart: {},
    fontFace: "",
    availableNodes: [],
    css: "",
    width: "",
    height: "",
  },
  (props, options) => {
    let actions: IChartActions;
    let state: IChart;

    const onload = (actions: IChartActions) => {
      actions = actions;
    };

    const historyChange = (statec: IChart) => {
      state = statec;
      console.log(state);
    };

    const onNodeSettings = (node: ExtendedNode) => {
      console.log(node);
    };

    const onDiagramDashboardToggle = () => {
      console.log("dashboard");
    };

    return (
      <>
        <style>{props.css}</style>
        <DiagramWrapper
          onLoad={onload}
          chart={props.chart as IChart}
          fontFace={props.fontFace}
          availableNodes={props.availableNodes}
          onHistoryChange={historyChange}
          onNodeSettingsClick={onNodeSettings}
          width={props.width}
          height={props.height}
          root={options.element.renderRoot}
          onDiagramDashboardToggle={onDiagramDashboardToggle}
        />
      </>
    );
  }
);

export default DumbotDiagramWC;

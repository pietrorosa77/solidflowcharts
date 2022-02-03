import { customElement } from "solid-element";
import { createSignal } from "solid-js";
import { ExtendedNode, IChart } from "../definitions";
import DiagramWrapper from "./diagram/Diagram";
import { IChartActions } from "./store/chartStore";

// let historyUpdateCallback: any;
// let crtActions: IChartActions;

let notifier: (action: string, data: any) => void;

const [chartstr, setChartStr] = createSignal("");

const DumbotDiagramWC = customElement(
  "dumbot-flowchart",
  {
    fontFace: "",
    availableNodes: [],
    css: "",
    width: "",
    height: "",
    addNotifier: (cbIn: (action: string, data: any) => void) => {
      notifier = cbIn;
    },
    setInitialChart: (chart: string) => {
      console.log("setting init charty");
      setChartStr(chart);
    },
  },
  (props, options) => {
    const onload = (actions: IChartActions) => {
      notifier("load", actions);
    };

    const historyChange = (state: IChart) => {
      notifier("statechange", state);
    };

    const onNodeSettings = (node: ExtendedNode) => {
      notifier("onnodesettings", node);
    };

    const onDiagramDashboardToggle = () => {
      notifier("dashboardtoggle", null);
    };

    return (
      <>
        {!chartstr() && <div>loading diagram...</div>}
        {chartstr() && (
          <>
            <style>{props.css}</style>
            <DiagramWrapper
              onLoad={onload}
              chart={JSON.parse(chartstr())}
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
        )}
      </>
    );
  }
);

export default DumbotDiagramWC;

import { Component, onMount, Show, ErrorBoundary } from "solid-js";
import { ExtendedNode, IChart } from "../../definitions";
import Canvas from "../canvas/Canvas";
import Nodes from "../node/Node";
import { nanoid } from "nanoid";
import "./Helper.css";
import styles from "./Diagram.module.css";
import {
  ChartProvider,
  IChartActions,
  useChartStore,
} from "../store/chartStore";
import { PanZoom } from "panzoom";
import { ICustomTheme, getCssVariables } from "../defaultTheme";
import Links, { Link as NewLink } from "../link/Link";
import Sidebar, { ISidebarNode } from "../sidebar/Sidebar";
import EditorHtml from "../components/EditorHtml";

const Diagram: Component<{
  onNodeSettingsClick?: (node: ExtendedNode) => void;
  onLoad?: (ctions: IChartActions) => void;
  availableNodes: ISidebarNode[];
  width?: string;
  height?: string;
}> = (props) => {
  const minZoom = 0.2;
  const maxZoom = 2;
  const canvasId = nanoid(10);
  const [state, actions] = useChartStore();

  onMount(() => {
    console.debug("Mounting flowchart diagram");
    if (props.onLoad) {
      props.onLoad(actions);
    }
  });

  const onScale = (evt: PanZoom) => {
    actions.onScale(evt.getTransform().scale);
  };

  const onNodeSettings = (nodeId: string) => {
    if (props.onNodeSettingsClick) {
      props.onNodeSettingsClick(state.chart.nodes[nodeId]);
    }
  };

  return (
    <div class={styles.Diagram}>
      <EditorHtml />
      <Sidebar nodes={props.availableNodes} />
      <Canvas
        id={canvasId}
        onScale={onScale}
        minZoom={minZoom}
        maxZoom={maxZoom}
      >
        <Nodes canvasId={canvasId} onNodeSettings={onNodeSettings} />
        <Links />
        <Show when={!!state.newLink}>
          <NewLink linkId="newLink" creating />
        </Show>
      </Canvas>
    </div>
  );
};

const DiagramWrapper: Component<{
  initialChart: IChart;
  fontFace?: string;
  onNodeSettingsClick?: (node: ExtendedNode) => void;
  onLoad?: (ctions: IChartActions) => void;
  onHistoryChange?: (chart: IChart) => void;
  availableNodes: ISidebarNode[];
  root?: any;
  width?: string;
  height?: string;
  getNodeHtml?: (content: string) => Promise<string[]>;
  customTheme?: ICustomTheme;
}> = (props) => {
  // eslint-disable-next-line
  (window as any).DMBRoot = props.root || document;

  const onNodeSettings = (node: ExtendedNode) => {
    props.onNodeSettingsClick?.(node);
  };

  const onLoad = (actions: IChartActions) => {
    props.onLoad?.(actions);
  };

  const onHistoryChanged = (chart: IChart) => {
    props.onHistoryChange?.(chart);
  };
  return (
    <>
      <style type="text/css" id="customBotCssOverrides">
        {getCssVariables(props.width, props.height, props.customTheme)}
      </style>
      <ChartProvider
        initialChart={props.initialChart}
        onHistoryChange={onHistoryChanged}
      >
        <ErrorBoundary fallback={(err) => err}>
          <Diagram
            width={props.width}
            height={props.height}
            onNodeSettingsClick={onNodeSettings}
            onLoad={onLoad}
            availableNodes={props.availableNodes}
          />
        </ErrorBoundary>
      </ChartProvider>
    </>
  );
};

export default DiagramWrapper;

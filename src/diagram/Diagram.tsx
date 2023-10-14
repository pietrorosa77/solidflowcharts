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
import EditorNodeSettings from "../components/EditorNodeSettings";

const Diagram: Component<{
  onLoad?: (ctions: IChartActions) => void;
  onNodeChanged:(oldNode: ExtendedNode, newNode: ExtendedNode) => void;
  availableNodes: ISidebarNode[];
  width?: string;
  height?: string;
  onCustomEditNode?: (node: ExtendedNode) => void;
  customNodeContentRenderer?: (node: ExtendedNode) => void;
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

  const onSettingsChanged = (oldNode: ExtendedNode, newNode: ExtendedNode) => {
      props.onNodeChanged?.(oldNode, newNode);
  };

  const onCustomEditNode = (nodeId: string) => {
    if (props.onCustomEditNode) {
      props.onCustomEditNode(state.chart.nodes[nodeId]);
    }
  };

  return (
    <div class={styles.Diagram}>
      <Show when={!props.onCustomEditNode}>
        <EditorNodeSettings nodes={props.availableNodes} onSettingsChanged={onSettingsChanged}/>
      </Show>
      <Sidebar nodes={props.availableNodes} />
      <Canvas
        id={canvasId}
        onScale={onScale}
        minZoom={minZoom}
        maxZoom={maxZoom}
      >
        <Nodes onCustomEditNode={props.onCustomEditNode ? onCustomEditNode : undefined} canvasId={canvasId} customNodeContentRenderer={props.customNodeContentRenderer} />
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
  onNodeChanged?:(oldNode: ExtendedNode, newNode: ExtendedNode) => void;
  fontFace?: string;
  onLoad?: (ctions: IChartActions) => void;
  onHistoryChange?: (chart: IChart) => void;
  availableNodes: ISidebarNode[];
  root?: any;
  width?: string;
  height?: string;
  getNodeHtml?: (content: string) => Promise<string[]>;
  customTheme?: ICustomTheme;
  customNodeContentRenderer?: (node: ExtendedNode) => void;
  onCustomEditNode?: (node: ExtendedNode) => void;
}> = (props) => {
  // eslint-disable-next-line
  (window as any).DMBRoot = props.root || document;

  const onLoad = (actions: IChartActions) => {
    props.onLoad?.(actions);
  };

  const onHistoryChanged = (chart: IChart) => {
    props.onHistoryChange?.(chart);
  };

  const onNodeChanged = (oldNode: ExtendedNode, newNode: ExtendedNode) => {
    props.onNodeChanged?.(oldNode, newNode);
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
            onLoad={onLoad}
            onNodeChanged={onNodeChanged}
            availableNodes={props.availableNodes}
            customNodeContentRenderer={props.customNodeContentRenderer}
            onCustomEditNode={props.onCustomEditNode}
          />
        </ErrorBoundary>
      </ChartProvider>
    </>
  );
};

export default DiagramWrapper;

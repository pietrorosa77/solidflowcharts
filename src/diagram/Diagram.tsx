import { Component, JSX, onMount, Show, ErrorBoundary } from "solid-js";
import { ExtendedNode, IChart } from "../../definitions";
import Canvas from "../canvas/Canvas";
import Nodes from "../node/Node";
import { nanoid } from "nanoid";

import styles from "./Diagram.module.css";
import {
  ChartProvider,
  IChartActions,
  useChartStore,
} from "../store/chartStore";
import { PanZoom } from "panzoom";
import { defaultFontFace, getCssVariables } from "../defaultTheme";
import { createFontStyle } from "../store/utils";
import Links, { Link as NewLink } from "../link/Link";
import Sidebar, { ISidebarNode } from "../sidebar/Sidebar";

const Diagram: Component<{
  onNodeSettingsClick?: (node: ExtendedNode) => void;
  onLoad?: (ctions: IChartActions) => void;
  availableNodes: ISidebarNode[];
  width?: string;
  height?: string;
  separator: string;
  // eslint-disable-next-line
}> = ({
  onNodeSettingsClick,
  onLoad,
  availableNodes,
  width,
  height,
  separator,
}) => {
  const minZoom = 0.2;
  const maxZoom = 2;
  const canvasId = nanoid(10);
  const [state, actions] = useChartStore();

  onMount(() => {
    console.log("Mounting flowchart diagram");
    if (onLoad) {
      onLoad(actions);
    }
  });

  const onScale = (evt: PanZoom) => {
    actions.onScale(evt.getTransform().scale);
  };

  const cssVariables: JSX.CSSProperties = {
    ...getCssVariables(width, height),
  };

  const onNodeSettings = (nodeId: string) => {
    if (onNodeSettingsClick) {
      onNodeSettingsClick(state.chart.nodes[nodeId]);
    }
  };

  return (
    <div style={cssVariables} class={styles.Diagram}>
      <Sidebar nodes={availableNodes} />
      <Canvas
        id={canvasId}
        onScale={onScale}
        minZoom={minZoom}
        maxZoom={maxZoom}
      >
        <Nodes
          canvasId={canvasId}
          onNodeSettings={onNodeSettings}
          separator={separator}
        />
        <Links />
        <Show when={!!state.newLink}>
          <NewLink linkId="newLink" creating />
        </Show>
      </Canvas>
    </div>
  );
};

const DiagramWrapper: Component<{
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
  // eslint-disable-next-line
}> = ({
  chart,
  fontFace,
  onNodeSettingsClick,
  onLoad,
  onHistoryChange,
  availableNodes,
  root,
  width,
  height,
  messageSeparator: separator,
}) => {
  createFontStyle(fontFace || defaultFontFace);
  (window as any).DMBRoot = root || document;
  return (
    <ChartProvider chart={chart} onHistoryChange={onHistoryChange}>
      <ErrorBoundary fallback={(err) => err}>
        <Diagram
          width={width}
          height={height}
          separator={separator}
          onNodeSettingsClick={onNodeSettingsClick}
          onLoad={onLoad}
          availableNodes={availableNodes}
        />
      </ErrorBoundary>
    </ChartProvider>
  );
};

export default DiagramWrapper;

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
import { ISidebarNode } from "../sidebar/Sidebar";
import { customElement } from "solid-element";

const Diagram: Component<{
  onNodeSettingsClick?: (node: ExtendedNode) => void;
  onDiagramDashboardToggle?: () => void;
  onLoad?: (ctions: IChartActions) => void;
  availableNodes: ISidebarNode[];
  width?: string;
  height?: string;
}> = ({
  onNodeSettingsClick,
  onLoad,
  onDiagramDashboardToggle,
  availableNodes,
  width,
  height,
}) => {
  const minZoom = 0.2;
  const maxZoom = 2;
  const canvasId = nanoid(10);
  const [state, actions] = useChartStore();

  onMount(() => {
    console.log("wwwww");
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
    <div style={cssVariables} className={styles.Diagram}>
      <Canvas
        id={canvasId}
        onScale={onScale}
        minZoom={minZoom}
        maxZoom={maxZoom}
        onDiagramDashboardToggle={onDiagramDashboardToggle}
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
  chart: IChart;
  fontFace?: string;
  onNodeSettingsClick?: (node: ExtendedNode) => void;
  onDiagramDashboardToggle?: () => void;
  onLoad?: (ctions: IChartActions) => void;
  onHistoryChange?: (chart: IChart) => void;
  availableNodes: ISidebarNode[];
  root?: any;
  width?: string;
  height?: string;
}> = ({
  chart,
  fontFace,
  onNodeSettingsClick,
  onLoad,
  onDiagramDashboardToggle,
  onHistoryChange,
  availableNodes,
  root,
  width,
  height,
}) => {
  createFontStyle(fontFace || defaultFontFace);
  (window as any).DMBRoot = root || document;

  return (
    <ChartProvider chart={chart} onHistoryChange={onHistoryChange}>
      <ErrorBoundary fallback={(err) => err}>
        <Diagram
          width={width}
          height={height}
          onNodeSettingsClick={onNodeSettingsClick}
          onLoad={onLoad}
          availableNodes={availableNodes}
          onDiagramDashboardToggle={onDiagramDashboardToggle}
        />
      </ErrorBoundary>
    </ChartProvider>
  );
};

export default DiagramWrapper;

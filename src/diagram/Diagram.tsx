import { Component, JSX, onMount, Show } from "solid-js";
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

const Diagram: Component<{
  onNodeSettingsClick?: (node: ExtendedNode) => void;
  onLoad?: (ctions: IChartActions) => void;
}> = ({ onNodeSettingsClick, onLoad }) => {
  const canvasId = nanoid(10);
  const [state, actions] = useChartStore();

  onMount(() => {
    if (onLoad) {
      onLoad(actions);
    }
  });

  const onScale = (evt: PanZoom) => {
    actions.onScale(evt.getTransform().scale);
  };

  const cssVariables: JSX.CSSProperties = {
    ...getCssVariables(),
  };

  const onNodeSettings = (nodeId: string) => {
    if (onNodeSettingsClick) {
      onNodeSettingsClick(state.chart.nodes[nodeId]);
    }
  };

  return (
    <div style={cssVariables} className={styles.Diagram}>
      <Canvas id={canvasId} onScale={onScale}>
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
  onLoad?: (ctions: IChartActions) => void;
}> = ({ chart, fontFace, onNodeSettingsClick, onLoad }) => {
  createFontStyle(fontFace || defaultFontFace);
  return (
    <ChartProvider chart={chart}>
      <Diagram onNodeSettingsClick={onNodeSettingsClick} onLoad={onLoad} />
    </ChartProvider>
  );
};

export default DiagramWrapper;

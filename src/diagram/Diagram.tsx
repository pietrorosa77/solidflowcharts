import { Component, JSX } from "solid-js";
import { For, onMount, onCleanup } from "solid-js";
import { IChart } from "../../definitions";
import Canvas from "../canvas/Canvas";
import Node from "../node/Node";
import { nanoid } from "nanoid";

import styles from "./Diagram.module.css";
import { ChartProvider, useChartStore } from "../store/chartStore";
import { PanZoom } from "panzoom";
import { getCssVariables, IDiagramTheme } from "../defaultTheme";

const Diagram: Component = () => {
  const canvasId = nanoid(10);
  const [state, actions] = useChartStore();
  const observer: ResizeObserver = new ResizeObserver(
    (evt: ResizeObserverEntry[]) => {
      actions.nodesSizeChanged(evt);
    }
  );
  const nodesArray = () =>
    Object.keys(state.chart.nodes).map((k: string) => state.chart.nodes[k]);

  onMount(() => {
    console.log("mount");
  });
  console.log("RENDERING DIAGRAM");
  onCleanup(() => observer.disconnect());

  const onScale = (evt: PanZoom) => {
    actions.onScale(evt.getTransform().scale);
  };

  const cssVariables: JSX.CSSProperties = {
    ...getCssVariables(state.theme),
  };

  return (
    <div style={cssVariables} className={styles.Diagram}>
      <Canvas id={canvasId} onScale={onScale}>
        <For each={nodesArray()}>
          {(node, i) => {
            console.log(`"creating ${node.id}"`);
            return (
              <Node node={node} sizeObserver={observer} canvasId={canvasId} />
            );
          }}
        </For>
      </Canvas>
    </div>
  );
};

const DiagramWrapper: Component<{ chart: IChart; theme: IDiagramTheme }> = ({
  chart,
  theme,
}) => {
  return (
    <ChartProvider chart={chart} theme={theme}>
      <Diagram />
    </ChartProvider>
  );
};

export default DiagramWrapper;

import { Component } from "solid-js";
import { For, onMount, onCleanup } from "solid-js";
import { IChart } from "../../definitions";
import Canvas from "../canvas/Canvas";
import Node from "../node/Node";
import { nanoid } from "nanoid";

import styles from "./Diagram.module.css";
import { ChartProvider, useChartStore } from "../store/chartStore";
import { PanZoom } from "panzoom";

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

  return (
    <div class={styles.Diagram}>
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

const DiagramWrapper: Component<{ chart: IChart }> = ({ chart }) => {
  return (
    <ChartProvider chart={chart}>
      <Diagram />
    </ChartProvider>
  );
};

export default DiagramWrapper;

import { Component, JSX, Show } from "solid-js";
import { onMount } from "solid-js";
import { ExtendedNode, IChart } from "../../definitions";
import Canvas from "../canvas/Canvas";
import Nodes from "../node/Node";
import { nanoid } from "nanoid";

import styles from "./Diagram.module.css";
import { ChartProvider, useChartStore } from "../store/chartStore";
import { PanZoom } from "panzoom";
import { defaultFontFace, getCssVariables } from "../defaultTheme";
import { createFontStyle } from "../store/utils";
import Links, { Link as NewLink } from "../link/Link";

const Diagram: Component<{
  CustomNodeContent?: (props: { node: ExtendedNode }) => JSX.Element;
}> = ({ CustomNodeContent }) => {
  const canvasId = nanoid(10);
  const [state, actions] = useChartStore();

  onMount(() => {
    console.log("mounting diagram");
  });
  console.log("RENDERING DIAGRAM");

  const onScale = (evt: PanZoom) => {
    actions.onScale(evt.getTransform().scale);
  };

  const cssVariables: JSX.CSSProperties = {
    ...getCssVariables(),
  };

  return (
    <div style={cssVariables} className={styles.Diagram}>
      <Canvas id={canvasId} onScale={onScale}>
        <Nodes canvasId={canvasId} CustomNodeContent={CustomNodeContent} />
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
  CustomNodeContent?: (props: { node: ExtendedNode }) => JSX.Element;
}> = ({ chart, fontFace, CustomNodeContent }) => {
  createFontStyle(fontFace || defaultFontFace);
  return (
    <ChartProvider chart={chart}>
      <Diagram CustomNodeContent={CustomNodeContent} />
    </ChartProvider>
  );
};

export default DiagramWrapper;

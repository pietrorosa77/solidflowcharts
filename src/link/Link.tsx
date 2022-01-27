import { Component, For } from "solid-js";
import { onMount } from "solid-js";
import { IChart, IPosition } from "../../definitions";
import { useChartStore } from "../store/chartStore";
import styles from "./Link.module.css";

export function calculatePosition(
  portOffset: number,
  from: IPosition,
  to: IPosition,
  portIndex: number,
  fromSize?: { h: number; w: number },
  creating?: boolean
) {
  //  10 + 100 +
  const offsetY = portOffset / 2;
  const startPos = {
    x: from.x + (fromSize ? fromSize.w : 0),
    y:
      from.y +
      (fromSize ? fromSize.h : 0) -
      (portIndex || 1) * portOffset +
      offsetY,
  };

  const endPos = {
    x: to.x - 5,
    y: to.y + (creating ? 0 : 35),
  };

  return {
    startPos,
    endPos,
  };
}

export function defaultPath(startPos: IPosition, endPos: IPosition) {
  const bezierWeight = 0.675;
  const x1 = startPos.x;
  const x2 = endPos.x;
  const y1 = startPos.y;
  const y2 = endPos.y;
  const hx1 = x1 + Math.abs(x2 - x1) * bezierWeight;
  const hx2 = x2 - Math.abs(x2 - x1) * bezierWeight;

  return `M ${x1} ${y1} C ${hx1} ${y1} ${hx2} ${y2} ${x2} ${y2}`;
}

export function straightPath(startPos: IPosition, endPos: IPosition) {
  const x1 = startPos.x;
  const x2 = endPos.x;
  const y1 = startPos.y;
  const y2 = endPos.y;
  return `M ${x1} ${y1} ${x2} ${y2}`;
}

const getLinePoints = (chart: IChart, linkId: string, portOffset: number) => {
  const link = chart.links[linkId];
  const nodeFrom = chart.nodes[link.from.nodeId];
  const nodeTo = chart.nodes[link.to];

  const portIndex = nodeFrom.ports[link.from.portId].index;
  const { startPos, endPos } = calculatePosition(
    portOffset,
    nodeFrom.position,
    nodeTo.position,
    portIndex,
    nodeFrom.size
  );
  return defaultPath(startPos, endPos);
};

const Link = (props: { linkId: string }) => {
  let lineEl: any;
  let markerEl: any;
  const [state, actions] = useChartStore();

  return (
    <svg class={styles.LinkStyle}>
      <defs>
        <marker
          id={`lmark-${props.linkId}`}
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path
            class={styles.LineMarker}
            d="M 0 0 L 10 5 L 0 10 z"
            ref={markerEl}
          />
        </marker>
      </defs>
      <path
        marker-end={`url(#lmark-${props.linkId})`}
        ref={lineEl}
        d={getLinePoints(state.chart, props.linkId, state.portOffset)}
        class={styles.Line}
      />
    </svg>
  );
};

const Links: Component = () => {
  const [state, actions] = useChartStore();
  console.log("rendering links");

  onMount(() => {
    console.log("mounting links");
  });

  return (
    <For each={Object.keys(state.chart.links)}>
      {(key, i) => {
        console.log(`"creating link ${key}"`);
        return <Link linkId={key} />;
      }}
    </For>
  );
};

export default Links;

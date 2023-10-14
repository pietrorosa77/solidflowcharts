import { Component, For, Show } from "solid-js";
import { IChart, ILink, IPosition } from "../../definitions";
import { useChartStore } from "../store/chartStore";
import styles from "./Link.module.css";
import { getSmoothStepPath } from "./SmoothStepPath";

export function calculatePosition(
  portOffset: number,
  from: IPosition,
  to: IPosition,
  portIndex: number,
  fromSize?: { h: number; w: number },
  creating?: boolean,
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

  return [`M ${x1} ${y1} C ${hx1} ${y1} ${hx2} ${y2} ${x2} ${y2}`];
}

export function straightPath(startPos: IPosition, endPos: IPosition) {
  const x1 = startPos.x;
  const x2 = endPos.x;
  const y1 = startPos.y;
  const y2 = endPos.y;
  return `M ${x1} ${y1} ${x2} ${y2}`;
}

const getLinePoints = (
  chart: IChart,
  linkId: string,
  portOffset: number,
  newLink?: ILink,
) => {
  const link = newLink || chart.links[linkId];
  const nodeFrom = chart.nodes[link.from.nodeId];
  const posTo = link.posTo || chart.nodes[link.to].position;
  const isUsingBezier = !!chart.properties?.useBezierPath;

  const portIndex = nodeFrom.ports[link.from.portId].index;
  const { startPos, endPos } = calculatePosition(
    portOffset,
    nodeFrom.position,
    posTo,
    portIndex,
    nodeFrom.size,
    newLink ? true : false,
  );

  const [path] = isUsingBezier
    ? defaultPath(startPos, endPos)
    : getSmoothStepPath({
        sourceX: startPos.x,
        sourceY: startPos.y,
        sourcePosition: "Right",
        targetX: endPos.x,
        targetY: endPos.y,
        targetPosition: "Left",
        borderRadius: 20,
        offset: 20,
      });

  return path;
};

export const Link = (props: { linkId: string; creating?: boolean }) => {
  let lineEl: any;
  let markerEl: any;
  const [state] = useChartStore();

  return (
    <Show
      when={
        props.creating ||
        state.chart.links[props.linkId].from.nodeId !==
          state.chart.links[props.linkId].to
      }
    >
      <svg
        class={styles.LinkStyle}
        classList={{ [`${styles.LinkCreating}`]: props.creating }}
      >
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
          d={getLinePoints(
            state.chart,
            props.linkId,
            state.portOffset,
            props.creating ? state.newLink : undefined,
          )}
          class={styles.Line}
        />
      </svg>
    </Show>
  );
};

const Links: Component = () => {
  const [state] = useChartStore();

  return (
    <For each={Object.keys(state.chart.links)}>
      {(key) => {
        return <Link linkId={key} />;
      }}
    </For>
  );
};

export default Links;

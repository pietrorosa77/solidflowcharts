import { Component, For } from "solid-js";
import { onMount } from "solid-js";
import { INode, IPort } from "../../definitions";
import { useChartStore } from "../store/chartStore";
import styles from "./Ports.module.css";

const getPortBgColor = (port: IPort) => {
  if (!port.bgColor) {
    return undefined;
  }

  return port.bgColor;
};
const Port = (props: {
  portId: string;
  nodeId: string;
  canvasId: string;
  allowMultiple?: boolean;
}) => {
  const [state, actions] = useChartStore();
  onMount(() => {
    console.log("mounting port", props.portId);
  });

  const handleMouseDown = (startEvent: PointerEvent) => {
    startEvent.preventDefault();
    startEvent.stopPropagation();
    const portLinks = Object.keys(state.chart.links)
      .filter(
        (k) =>
          state.chart.links[k].from.nodeId === props.nodeId &&
          state.chart.links[k].from.portId === props.portId
      )
      .map((linkId) => state.chart.links[linkId]);

    if (!props.allowMultiple && portLinks.length > 0) {
      return;
    }

    const canvas: any = document.getElementById(props.canvasId);
    const canvasRect = canvas.getBoundingClientRect();
    const scale: number = state.scale;
    let raFrameHandle = 0;

    const _mouseMoveHandler = (e: MouseEvent) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.cancelBubble = true;

      const to = {
        x: (e.clientX - canvasRect.left) / scale,
        y: (e.clientY - canvasRect.top) / scale,
      };

      raFrameHandle = requestAnimationFrame(() =>
        actions.onCreatingLink({
          from: {
            nodeId: props.nodeId,
            portId: props.portId,
          },
          to: "",
          posTo: to,
          id: "newLinkCreating",
        })
      );
    };

    const mouseUpHandler = (e: MouseEvent) => {
      window.removeEventListener("pointermove", throttledMove, {
        capture: false,
      });
      window.removeEventListener("pointerup", mouseUpHandler, false);
      cancelAnimationFrame(raFrameHandle);
      const link = {
        from: {
          nodeId: props.nodeId,
          portId: props.portId,
        },
        id: "newLinkCreating",
        to: "",
        posTo: {
          x: (e.clientX - canvasRect.left) / scale,
          y: (e.clientY - canvasRect.top) / scale,
        },
      };

      // ensure mouse up comes last and no other mousedown will be queued after it
      // causing a double line
      const upTimeout = setTimeout(() => {
        actions.onEndConnection(link, portLinks);
        clearTimeout(upTimeout);
      }, 100);
    };

    const throttledMove = (e: any) =>
      (raFrameHandle = requestAnimationFrame(() => _mouseMoveHandler(e)));

    window.addEventListener("pointerup", mouseUpHandler, false);
    window.addEventListener("pointermove", throttledMove, {
      capture: false,
      passive: true,
    });
  };

  return (
    <div
      class={styles.PortContainer}
      style={{ height: `${state.portOffset}px`, width: "100%" }}
    >
      <div
        class={styles.PortOuter}
        style={{
          height: `${state.portHeight}px`,
          width: "100%",
          "background-color": getPortBgColor(
            state.chart.nodes[props.nodeId].ports[props.portId]
          ),
        }}
      >
        <div class={styles.PortContent}>
          {state.chart.nodes[props.nodeId].ports[props.portId].text}
        </div>
        <div class={styles.PortOutContainer} onPointerDown={handleMouseDown}>
          <div class={styles.PortOutInner}></div>
        </div>
      </div>
    </div>
  );
};

const getPortsSorted = (node: INode) =>
  Object.keys(node.ports || {}).sort(
    (p1, p2) => node.ports[p2].index - node.ports[p1].index
  );
const Ports: Component<{
  nodeId: string;
  canvasId: string;
}> = ({ nodeId, canvasId }) => {
  const [state, actions] = useChartStore();

  return (
    <div
      class={styles.PortsContainer}
      id={`${nodeId}-port-container`}
      data-node-id={`${nodeId}`}
    >
      <For each={getPortsSorted(state.chart.nodes[nodeId])}>
        {(key, i) => {
          return <Port portId={key} canvasId={canvasId} nodeId={nodeId} />;
        }}
      </For>
    </div>
  );
};

export default Ports;

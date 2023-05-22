import { Component, For, Show } from "solid-js";
import { INode, IPort } from "../../definitions";
import { useChartStore } from "../store/chartStore";
import styles from "./Ports.module.css";
import { TiArrowLoop } from "solid-icons/ti";
import { BiSolidTrash } from "solid-icons/bi";
import { getLinksForPort } from "../store/utils";

const getPortBgColor = (port: IPort) => {
  if (!port.bgColor) {
    return undefined;
  }

  return port.bgColor;
};

const getPortColor = (port: IPort) => {
  if (!port.fontColor) {
    return undefined;
  }

  return port.fontColor;
};

const Port = (props: {
  portId: string;
  nodeId: string;
  canvasId: string;
  allowMultiple?: boolean;
}) => {
  const [state, actions] = useChartStore();

  const handleMouseDown = (startEvent: PointerEvent) => {
    startEvent.preventDefault();
    startEvent.stopPropagation();

    const portLinks = getLinksForPort(state.chart, props.nodeId, props.portId);

    if (!props.allowMultiple && portLinks.length > 0) {
      return;
    }

    const canvas: any = (window as any).DMBRoot.getElementById(props.canvasId);
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

  const onDeleteLink = (e: PointerEvent) => {
    e.cancelBubble = true;
    e.preventDefault();
    e.stopImmediatePropagation();
    e.stopPropagation();
    actions.onRemoveLinks(props.nodeId, props.portId);
  };

  const hasLink = () => {
    return !!state.chart.paths[`${props.nodeId}-${props.portId}`];
  };

  const forceHide = () =>
    !!state.chart.nodes[props.nodeId].ports[props.portId].properties.disabled;

  const hasLoop = () =>
    hasLink() &&
    state.chart.paths[`${props.nodeId}-${props.portId}`] === props.nodeId;

  const deleteLinkAccessibilityProps = {
    role: "button",
    "aria-text": `delete link`,
  } as any;

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
          )
        }}
      >
        <div class={styles.PortContent}>
          <span class={styles.PortText} style={{
              color: getPortColor(state.chart.nodes[props.nodeId].ports[props.portId])
          }}>
            {state.chart.nodes[props.nodeId].ports[props.portId].text}
          </span>
          <Show when={hasLoop()}>
            <TiArrowLoop
              size={24}
              class={styles.LoopPortIndicator}
              title="this port has a loop link"
            />
          </Show>
        </div>
        <Show when={!forceHide()}>
          <div class={styles.PortOutContainer} onPointerDown={handleMouseDown}>
            <Show
              when={hasLink()}
              fallback={<div class={styles.PortOutInner} />}
            >
              <BiSolidTrash
                aria-label="delete link"
                title="delete link"
                size={20}
                onPointerDown={onDeleteLink}
                class={styles.DeleteLinkIcon}
                {...deleteLinkAccessibilityProps}
              />
            </Show>
          </div>
        </Show>
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
}> = (props) => {
  const [state] = useChartStore();

  return (
    <div
      class={styles.PortsContainer}
      id={`${props.nodeId}-port-container`}
      data-node-id={`${props.nodeId}`}
    >
      <For each={getPortsSorted(state.chart.nodes[props.nodeId])}>
        {(key) => {
          return <Port portId={key} canvasId={props.canvasId} nodeId={props.nodeId} />;
        }}
      </For>
    </div>
  );
};

export default Ports;

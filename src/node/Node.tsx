import { Component, For, onMount, onCleanup, Show } from "solid-js";
import { Checkbox } from "../components/Checkbox";
import { useChartStore } from "../store/chartStore";
import {
  blockEventHandler,
  getMultiselectionSquareRectOffsets,
  getPositionWithParentBoundsSize,
} from "../store/utils";
import {NodeContentReadonly} from './NodeContent'
import styles from "./Node.module.css";
import Ports from "../port/Ports";
import { AiFillSetting } from "solid-icons/ai";
import { BiSolidTrash } from "solid-icons/bi";
import { ExtendedNode } from "../../definitions";

const NodeHead = (props: {
  nodeId: string;
  title: string;
  selected: boolean;
  preventRemoval?: boolean;
  onToggle: () => void;
  onDeleteNode: () => void;
  onNodeSettings: () => void;
  onCustomEditNode?: (nodeId: string) => void;
}) => {
  const preventNodeDrag = (e: PointerEvent) => {
    (e as any)["diagramDetails"] = "prevent node drag";
  };
  const onCheckboxChange = () => {
    props.onToggle();
  };
  const onNodeSettings = () => {
    if(props.onCustomEditNode) {
      props.onCustomEditNode(props.nodeId);
    } else {
      props.onNodeSettings();
    }
  };

  const onNodeTrash = () => {
    props.onDeleteNode();
  };
  return (
    <div class={styles.NodeHead}>
      <div onPointerDown={preventNodeDrag}>
        <Checkbox onChange={onCheckboxChange} checked={!!props.selected} />
      </div>
      <div class={styles.NodeHeadTitle}>
        <span>{props.title}</span>
      </div>
      <div class={styles.NodeCommandsContainer} onPointerDown={preventNodeDrag}>
        <AiFillSetting
          size={18}
          class={styles.NodeCommands}
          onPointerDown={onNodeSettings}
        />
        {!props.preventRemoval && <BiSolidTrash
          size={18}
          class={styles.NodeCommands}
          onPointerDown={onNodeTrash}
        />}
      </div>
    </div>
  );
};

const Node: Component<{
  nodeId: string;
  canvasId: string;
  sizeObserver: ResizeObserver;
  customNodeContentRenderer?: (node: ExtendedNode) => any;
  onCustomEditNode?: (nodeID: string) => void;
}> = (props) => {
  let nodeRef: any;
  const [state, actions] = useChartStore();

  onMount(() => {
    props.sizeObserver.observe(nodeRef);
    (nodeRef as HTMLDivElement).addEventListener(
      "touchstart",
      blockEventHandler,
      { passive: false }
    );
    if(props.customNodeContentRenderer) {
      props.customNodeContentRenderer({
        ...state.chart.nodes[props.nodeId],
        holderEl: document.getElementById(`node_content_${props.nodeId}`)
      })
    }
    console.debug("mounting node", props.nodeId);
  });

  onCleanup(() => {
    props.sizeObserver.unobserve(nodeRef);
    (nodeRef as HTMLDivElement).removeEventListener(
      "touchstart",
      blockEventHandler
    );
  });

  const onToggleSelection = () => {
    const selected = state.chart.selected[props.nodeId];
    actions.onToggleNodeSelection(props.nodeId, !selected);
  };

  const onPointerDown = (e: PointerEvent) => {
    if ((e as any)["diagramDetails"]) {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.cancelBubble = true;
      return;
    }
    const scale = state.scale;
    const canvas: HTMLDivElement = (window as any).DMBRoot.getElementById(
      props.canvasId
    ) as any;
    let raFrameHandle = 0;
    const canvasRect = canvas.getBoundingClientRect();
    nodeRef.classList.add(styles.NodeDragging);
    //while dragging make it faster disabling other css effects
    document.body.classList.add("disable-hover");
    const nodeRect = nodeRef.getBoundingClientRect() as DOMRect;
    const canvasSize = {
      w: canvasRect.width / scale,
      h: canvasRect.height / scale,
    };
    let StartingDragPosition = state.chart.nodes[props.nodeId].position;
    const isMulti =
      state.chart.selected[props.nodeId] &&
      Object.entries(state.chart.selected).filter((e) => e[1]).length > 1;
    const nodeSize = { w: nodeRect.width / scale, h: nodeRect.height / scale };
    const multiSelectOffsets: any = isMulti
      ? getMultiselectionSquareRectOffsets(scale)
      : {};

    // initial offset of pointer comapred to node position
    const mouseOffsetToNode = {
      x: e.clientX - nodeRect.x,
      y: e.clientY - nodeRect.y,
    };

    const scrollLeft = canvas.scrollLeft;
    const rectTop = canvasRect.top;
    const rectLeft = canvasRect.left;
    const scrollTop = canvas.scrollTop;

    e.preventDefault();
    e.stopPropagation();

    const mouseMoveHandler = (e: PointerEvent) => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.cancelBubble = true;

      const x =
        (e.clientX + scrollLeft - rectLeft - mouseOffsetToNode.x) / scale;
      const y = (e.clientY + scrollTop - rectTop - mouseOffsetToNode.y) / scale;

      const finalPosition = getPositionWithParentBoundsSize(
        canvasSize,
        nodeSize,
        multiSelectOffsets[`${props.nodeId}-drag-hat`] as any,
        x,
        y
      );

      const delta = {
        x: finalPosition.x - StartingDragPosition.x,
        y: finalPosition.y - StartingDragPosition.y,
      };
      StartingDragPosition = finalPosition;

      if (!isMulti) {
        actions.onNodeDrag({
          nodeId: props.nodeId,
          position: finalPosition,
        });
      } else {
        actions.onMultiDrag({
          leaderId: props.nodeId,
          leaderPos: finalPosition,
          canvasSize,
          delta,
          multiSelectOffsets,
        });
      }
    };

    const throttledMove = (e: any) =>
      (raFrameHandle = requestAnimationFrame(() => mouseMoveHandler(e)));

    const mouseUpHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      cancelAnimationFrame(raFrameHandle);
      nodeRef.classList.remove(styles.NodeDragging);
      document.body.classList.remove("disable-hover");
      window.removeEventListener("pointerup", mouseUpHandler, false);
      window.removeEventListener("pointercancel", mouseUpHandler, false);
      window.removeEventListener("pointermove", throttledMove, true);
      actions.onNodeDraggingEnd();
    };

    window.addEventListener("pointerup", mouseUpHandler, false);
    window.addEventListener("pointercancel", mouseUpHandler, false);
    window.addEventListener("pointermove", throttledMove, {
      capture: true,
      passive: true,
    });
  };

  const onDeleteNode = () => {
    actions.onDeleteNodes([props.nodeId]);
  };

  const onNodeSettingsClick = () => {
    actions.onToggleEditNodeSettings(props.nodeId);
  };

  return (
    <div
      onPointerDown={onPointerDown}
      class={styles.Node}
      classList={{
        "drag-hat-selected": state.chart.selected[props.nodeId],
        [`${styles.NodeSelected}`]: state.chart.selected[props.nodeId],
      }}
      id={`${props.nodeId}-drag-hat`}
      data-node-id={`${props.nodeId}`}
      ref={nodeRef}
      style={{
        transform: `translate(${
          state.chart.nodes[props.nodeId].position.x
        }px, ${state.chart.nodes[props.nodeId].position.y}px)`,
      }}
    >
      <NodeHead
        nodeId={props.nodeId}
        selected={state.chart.selected[props.nodeId]}
        title={state.chart.nodes[props.nodeId].title}
        preventRemoval={state.chart.nodes[props.nodeId].preventRemoval}
        onToggle={onToggleSelection}
        onDeleteNode={onDeleteNode}
        onNodeSettings={onNodeSettingsClick}
        onCustomEditNode={props.onCustomEditNode}
      />

      <div class={`${styles.NodeContent} flowchart-node-content`}>
        <div class={styles.NodeContentView} id={`node_content_${props.nodeId}`}>
          <Show when={!props.customNodeContentRenderer}>
              <NodeContentReadonly
                content={state.chart.nodes[props.nodeId].content}
              />
          </Show>
        </div>
      </div>
      <Ports nodeId={props.nodeId} canvasId={props.canvasId} />
    </div>
  );
};

const Nodes: Component<{
  canvasId: string;
  customNodeContentRenderer?: (node: ExtendedNode) => any;
  onCustomEditNode?: (nodeID: string) => void;
}> = (props) => {
  const [state, actions] = useChartStore();
  const observer: ResizeObserver = new ResizeObserver(
    (evt: ResizeObserverEntry[]) => {
      actions.nodesSizeChanged(evt);
    }
  );

  onCleanup(() => observer.disconnect());

  return (
    <For each={Object.keys(state.chart.nodes)}>
      {(key) => {
        return (
          <Node
            nodeId={key}
            sizeObserver={observer}
            canvasId={props.canvasId}
            customNodeContentRenderer={props.customNodeContentRenderer}
          />
        );
      }}
    </For>
  );
};

export default Nodes;

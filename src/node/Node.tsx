import { Component } from "solid-js";
import { onMount, onCleanup } from "solid-js";
import { ExtendedNode } from "../../definitions";
import { Checkbox } from "../components/Checkbox";
import { useChartStore } from "../store/chartStore";
import {
  blockEventHandler,
  getMultiselectionSquareRectOffsets,
  getPositionWithParentBoundsSize,
} from "../store/utils";

import styles from "./Node.module.css";

const NodeHead = (props: {
  title: string;
  selected: boolean;
  onToggle: () => void;
}) => {
  return (
    <div class={styles.NodeHead}>
      <div onPointerDown={blockEventHandler}>
        <Checkbox onInput={props.onToggle} checked={props.selected} />
      </div>
      <div class={styles.NodeHeadTitle}>
        <span>{props.title}</span>
      </div>
    </div>
  );
};

const Node: Component<{
  node: ExtendedNode;
  canvasId: string;
  sizeObserver: ResizeObserver;
}> = ({ node, canvasId, sizeObserver }) => {
  let nodeRef: any;
  const [state, actions] = useChartStore();
  console.log("rendering node!!!", node.id);

  onMount(() => {
    sizeObserver.observe(nodeRef);
    (nodeRef as HTMLDivElement).addEventListener(
      "touchstart",
      blockEventHandler,
      { passive: false }
    );
    console.log("mounting node", node.id);
  });

  onCleanup(() => {
    sizeObserver.unobserve(nodeRef);
    (nodeRef as HTMLDivElement).removeEventListener(
      "touchstart",
      blockEventHandler
    );
  });

  const onToggleSelection = () => {
    const selected = state.chart.selected[node.id];
    actions.onToggleNodeSelection(node.id, !selected);
  };

  const onPointerDown = (e: PointerEvent) => {
    const scale = state.scale;
    const canvas: HTMLDivElement = document.getElementById(canvasId) as any;
    let raFrameHandle = 0;
    const canvasRect = canvas.getBoundingClientRect();
    const nodeRect = nodeRef.getBoundingClientRect() as DOMRect;
    const canvasSize = {
      w: canvasRect.width / scale,
      h: canvasRect.height / scale,
    };
    let StartingDragPosition = node.position;
    const isMulti =
      state.chart.selected[node.id] &&
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
        multiSelectOffsets[`${node.id}-drag-hat`] as any,
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
          nodeId: node.id,
          position: finalPosition,
        });
      } else {
        actions.onMultiDrag({
          leaderId: node.id,
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
      window.removeEventListener("pointerup", mouseUpHandler, false);
      window.removeEventListener("pointercancel", mouseUpHandler, false);
      window.removeEventListener("pointermove", throttledMove, true);
    };

    window.addEventListener("pointerup", mouseUpHandler, false);
    window.addEventListener("pointercancel", mouseUpHandler, false);
    window.addEventListener("pointermove", throttledMove, {
      capture: true,
      passive: true,
    });
  };

  return (
    <div
      onPointerDown={onPointerDown}
      class={styles.Node}
      classList={{
        "drag-hat-selected": state.chart.selected[node.id],
        [`${styles.NodeSelected}`]: state.chart.selected[node.id],
      }}
      id={`${node.id}-drag-hat`}
      data-node-id={`${node.id}`}
      ref={nodeRef}
      style={{
        transform: `translate(${node.position.x}px, ${node.position.y}px)`,
      }}
    >
      <NodeHead
        selected={state.chart.selected[node.id]}
        title={node.title}
        onToggle={onToggleSelection}
      />
      <div>{node.content}</div>
    </div>
  );
};

export default Node;

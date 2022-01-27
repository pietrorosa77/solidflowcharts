import { Component, For, JSX, Show } from "solid-js";
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
import { nanoid } from "nanoid";
import Viewer from "@toast-ui/editor/dist/toastui-editor-viewer";
import Ports from "../port/Ports";
import { AiFillSetting } from "solid-icons/ai";
import { BiTrash } from "solid-icons/bi";

const NodeContent = (props: { content: string }) => {
  let mdContent: any;
  let tuiEditorInstance: any;
  const contentId = nanoid();
  onMount(() => {
    console.log("MOUNTING NODE CONTENT");
    tuiEditorInstance = new Viewer({
      el: mdContent,
      initialValue: props.content,
    });
  });
  return <div ref={mdContent} id={contentId} />;
};

const NodeHead = (props: {
  title: string;
  selected: boolean;
  onToggle: () => void;
  onDeleteNode: () => void;
  onNodeSettings: () => void;
}) => {
  return (
    <div class={styles.NodeHead}>
      <div onPointerDown={blockEventHandler}>
        <Checkbox onChange={props.onToggle} checked={!!props.selected} />
      </div>
      <div class={styles.NodeHeadTitle}>
        <span>{props.title}</span>
      </div>
      <div
        class={styles.NodeCommandsContainer}
        onPointerDown={blockEventHandler}
      >
        <AiFillSetting
          size={24}
          class={styles.NodeCommands}
          onPointerDown={props.onNodeSettings}
        />
        <BiTrash
          size={24}
          class={styles.NodeCommands}
          onPointerDown={props.onDeleteNode}
        />
      </div>
    </div>
  );
};

const Node: Component<{
  nodeId: string;
  canvasId: string;
  CustomNodeContent?: (props: { node: ExtendedNode }) => JSX.Element;
  sizeObserver: ResizeObserver;
}> = ({ nodeId, canvasId, sizeObserver, CustomNodeContent }) => {
  let nodeRef: any;
  const [state, actions] = useChartStore();

  onMount(() => {
    sizeObserver.observe(nodeRef);
    (nodeRef as HTMLDivElement).addEventListener(
      "touchstart",
      blockEventHandler,
      { passive: false }
    );
    console.log("mounting node", nodeId);
  });

  onCleanup(() => {
    sizeObserver.unobserve(nodeRef);
    (nodeRef as HTMLDivElement).removeEventListener(
      "touchstart",
      blockEventHandler
    );
  });

  const onToggleSelection = () => {
    const selected = state.chart.selected[nodeId];
    console.log("SELECTED", !!selected);
    actions.onToggleNodeSelection(nodeId, !selected);
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
    let StartingDragPosition = state.chart.nodes[nodeId].position;
    const isMulti =
      state.chart.selected[nodeId] &&
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
        multiSelectOffsets[`${nodeId}-drag-hat`] as any,
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
          nodeId: nodeId,
          position: finalPosition,
        });
      } else {
        actions.onMultiDrag({
          leaderId: nodeId,
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

  const onDeleteNode = () => {
    actions.onDeleteNodes([nodeId]);
  };

  const onNodeSettings = () => {
    alert("Node settings to edit");
    //actions.onNodeSettings(nodeId)
  };

  return (
    <div
      onPointerDown={onPointerDown}
      class={styles.Node}
      classList={{
        "drag-hat-selected": state.chart.selected[nodeId],
        [`${styles.NodeSelected}`]: state.chart.selected[nodeId],
      }}
      id={`${nodeId}-drag-hat`}
      data-node-id={`${nodeId}`}
      ref={nodeRef}
      style={{
        transform: `translate(${state.chart.nodes[nodeId].position.x}px, ${state.chart.nodes[nodeId].position.y}px)`,
      }}
    >
      <NodeHead
        selected={state.chart.selected[nodeId]}
        title={state.chart.nodes[nodeId].title}
        onToggle={onToggleSelection}
        onDeleteNode={onDeleteNode}
        onNodeSettings={onNodeSettings}
      />

      <div class={styles.NodeContent}>
        <div class={styles.NodeContentView}>
          <Show
            when={CustomNodeContent}
            fallback={
              <NodeContent content={state.chart.nodes[nodeId].content} />
            }
          >
            {CustomNodeContent && (
              <CustomNodeContent node={state.chart.nodes[nodeId]} />
            )}
          </Show>
        </div>
      </div>
      <Ports nodeId={nodeId} canvasId={canvasId} />
    </div>
  );
};

const Nodes: Component<{
  canvasId: string;
  CustomNodeContent?: (props: { node: ExtendedNode }) => JSX.Element;
}> = ({ canvasId, CustomNodeContent }) => {
  const [state, actions] = useChartStore();
  const observer: ResizeObserver = new ResizeObserver(
    (evt: ResizeObserverEntry[]) => {
      actions.nodesSizeChanged(evt);
    }
  );

  onMount(() => {
    console.log("mounting nodes");
  });

  onCleanup(() => observer.disconnect());

  return (
    <For each={Object.keys(state.chart.nodes)}>
      {(key, i) => {
        return (
          <Node
            nodeId={key}
            sizeObserver={observer}
            canvasId={canvasId}
            CustomNodeContent={CustomNodeContent}
          />
        );
      }}
    </For>
  );
};

export default Nodes;

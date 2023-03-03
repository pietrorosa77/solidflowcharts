import { Component, For, onMount, onCleanup } from "solid-js";
import { Checkbox } from "../components/Checkbox";
import { useChartStore } from "../store/chartStore";
import {
  blockEventHandler,
  getMultiselectionSquareRectOffsets,
  getPositionWithParentBoundsSize,
} from "../store/utils";

import styles from "./Node.module.css";
import Ports from "../port/Ports";
import { AiFillSetting } from "solid-icons/ai";
import { BiSolidTrash } from "solid-icons/bi";
import { NodeContentReadonly } from "./NodeContent";

const NodeHead = (props: {
  title: string;
  selected: boolean;
  onToggle: () => void;
  onDeleteNode: () => void;
  onNodeSettings: () => void;
}) => {
  const preventNodeDrag = (e: PointerEvent) => {
    (e as any)["diagramDetails"] = "prevent node drag";
  };
  const onCheckboxChange = () => {
    props.onToggle();
  }
  const onNodeSettings = () => {
    props.onNodeSettings()
  }

  const onNodeTrash = () => {
    props.onDeleteNode()
  }
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
          size={24}
          class={styles.NodeCommands}
          onPointerDown={onNodeSettings}
        />
        <BiSolidTrash
          size={24}
          class={styles.NodeCommands}
          onPointerDown={onNodeTrash}
        />
      </div>
    </div>
  );
};

const Node: Component<{
  nodeId: string;
  canvasId: string;
  onNodeSettings: (nodeId: string) => void;
  sizeObserver: ResizeObserver;
  separator: string;
  getNodeHtml: (content: string) => Promise<string>;
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
    document.body.classList.add('disable-hover');
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
      document.body.classList.remove('disable-hover');
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
    props.onNodeSettings(props.nodeId);
  };

  const getContent = () => {
    const node = state.chart.nodes[props.nodeId];
    return node.content;
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
        transform: `translate(${state.chart.nodes[props.nodeId].position.x}px, ${state.chart.nodes[props.nodeId].position.y}px)`,
      }}
    >
      <NodeHead
        selected={state.chart.selected[props.nodeId]}
        title={state.chart.nodes[props.nodeId].title}
        onToggle={onToggleSelection}
        onDeleteNode={onDeleteNode}
        onNodeSettings={onNodeSettingsClick}
      />

      <div class={`${styles.NodeContent} flowchart-node-content`}>
        <div class={styles.NodeContentView}>
          <NodeContentReadonly
            content={getContent()}
            separator={props.separator}
            getHtmlContent={props.getNodeHtml}
          />
        </div>
      </div>
      <Ports nodeId={props.nodeId} canvasId={props.canvasId} />
    </div>
  );
};

const Nodes: Component<{
  canvasId: string;
  onNodeSettings: (nodeId: string) => void;
  separator: string;
  getNodeHtml: (content: string) => Promise<string>;
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
            separator={props.separator}
            nodeId={key}
            getNodeHtml={props.getNodeHtml}
            sizeObserver={observer}
            canvasId={props.canvasId}
            onNodeSettings={props.onNodeSettings}
          />
        );
      }}
    </For>
  );
};

export default Nodes;

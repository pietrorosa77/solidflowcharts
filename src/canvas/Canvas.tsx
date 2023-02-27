import { Component } from "solid-js";
import { onMount, onCleanup } from "solid-js";
import panzoom, { PanZoom } from "panzoom";

import styles from "./Canvas.module.css";
import CanvasCommands from "./CanvasCommands";
import { AreaSelect } from "./AreaSelect";
import { useChartStore } from "../store/chartStore";
import { ExtendedNode } from "../../definitions";

const Canvas: Component<{
  id: string;
  minZoom: number;
  maxZoom: number;
  onScale: (evt: PanZoom) => void;
  children: any;
}> = (props) => {
  let cnv: any;
  let zoomInstance: PanZoom;
  const [state, actions] = useChartStore();
  const zoomHandler = (e: PanZoom) => {
    props.onScale(e);
  };
  onMount(() => {
    zoomInstance = panzoom(cnv, {
      minZoom: props.minZoom,
      maxZoom: props.maxZoom,
      zoomDoubleClickSpeed: 1,
      onDoubleClick: function () {
        // `e` - is current double click event.
        return false; // tells the library to not preventDefault, and not stop propagation
      },
    });
    zoomInstance.on("transform", zoomHandler);
  });

  onCleanup(() => {
    if (!zoomInstance) {
      return;
    }
    zoomInstance.off("transform", zoomHandler);
    zoomInstance.dispose();
  });

  const onEnableSelection = () => {
    zoomInstance.pause();
    actions.onToggleAreaSelection(true);
  };

  const onEnablePanZoom = () => {
    zoomInstance.resume();
    actions.onToggleAreaSelection(false);
  };

  const onReset = () => {
    zoomInstance.moveTo(0, 0);
    zoomInstance.zoomAbs(0, 0, 1);
  };

  const onBlockDrop = (e: DragEvent) => {
    if (!e.dataTransfer) {
      return;
    }
    const diagramData = e.dataTransfer.getData("DIAGRAM-BLOCK");
    const newNode = JSON.parse(diagramData) as ExtendedNode;
    const canvasRect = cnv.getBoundingClientRect();

    const x = (e.clientX + cnv.scrollLeft - canvasRect.left) / state.scale;
    const y = (e.clientY + cnv.scrollTop - canvasRect.top) / state.scale;

    newNode.position = {
      x,
      y,
    };
    actions.onAddNode(newNode);
  };

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <div class={styles.CanvasWrapper}>
        <div
          class={styles.Canvas}
          id={props.id}
          ref={cnv}
          onDrop={onBlockDrop}
          onDragOver={onDragOver}
          style={{
            cursor: state.selection ? "crosshair" : "grab",
          }}
        >
          <AreaSelect>{props.children}</AreaSelect>
        </div>
      </div>
      <CanvasCommands
        onResetAll={onReset}
        onEnableSelection={onEnableSelection}
        onEnablePanZoom={onEnablePanZoom}
      />
    </>
  );
};

export default Canvas;

import { Component } from "solid-js";
import { onMount, onCleanup } from "solid-js";
import panzoom, { PanZoom } from "panzoom";

import styles from "./Canvas.module.css";
import CanvasCommands from "./CanvasCommands";
import { AreaSelect } from "./AreaSelect";
import { useChartStore } from "../store/chartStore";

const Canvas: Component<{
  id: string;
  minZoom: number;
  maxZoom: number;
  onScale: (evt: PanZoom) => void;
  // eslint-disable-next-line
}> = ({
  id,
  children,
  onScale,
  minZoom,
  maxZoom,
}) => {
  let cnv: any;
  let zoomInstance: PanZoom;
  const [state, actions] = useChartStore();
  const zoomHandler = (e: PanZoom) => {
    onScale(e);
  };
  onMount(() => {
    zoomInstance = panzoom(cnv, {
      minZoom,
      maxZoom,
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

  return (
    <>
      <div class={styles.CanvasWrapper}>
        <div
          class={styles.Canvas}
          id={id}
          ref={cnv}
          style={{
            cursor: state.selection ? "crosshair" : "grab",
          }}
        >
          <AreaSelect>{children}</AreaSelect>
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

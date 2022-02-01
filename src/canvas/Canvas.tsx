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
  onDiagramDashboardToggle?: () => void;
}> = ({ id, children, onScale, minZoom, maxZoom, onDiagramDashboardToggle }) => {
  let cnv: any;
  let zoomInstance: PanZoom;
  const [_state, actions] = useChartStore();
  const zoomHandler = (e: PanZoom) => {
    onScale(e);
  };
  onMount(() => {
    zoomInstance = panzoom(cnv, {
      minZoom,
      maxZoom,
      zoomDoubleClickSpeed: 1,
      // beforeWheel: function (e) {
      //   // allow wheel-zoom only if altKey is down. Otherwise - ignore
      //   const shouldIgnore = !e.altKey;
      //   return shouldIgnore;
      // },
      // beforeMouseDown: function (e) {
      //   // allow mouse-down panning only if altKey is down. Otherwise - ignore
      //   var shouldIgnore = !e.altKey;
      //   return shouldIgnore;
      // },
      // filterKey: function (e: any) {
      //   const shouldIgnore = !e.altKey;
      //   // don't let panzoom handle this event:
      //   return shouldIgnore;
      // } as any,
      onDoubleClick: function (e) {
        // `e` - is current double click event.
        return false; // tells the library to not preventDefault, and not stop propagation
      },
    });
    zoomInstance.on("transform", zoomHandler);
  });

  onCleanup(() => {
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
        <div class={styles.Canvas} id={id} ref={cnv}>
          <AreaSelect>{children}</AreaSelect>
        </div>
      </div>
      <CanvasCommands
        onResetAll={onReset}
        onDiagramDashboardToggle={onDiagramDashboardToggle}
        onEnableSelection={onEnableSelection}
        onEnablePanZoom={onEnablePanZoom}
      />
    </>
  );
};

export default Canvas;

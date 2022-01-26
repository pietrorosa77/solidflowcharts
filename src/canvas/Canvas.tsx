import { Component } from "solid-js";
import { onMount, onCleanup } from "solid-js";
import panzoom, { PanZoom } from "panzoom";

import styles from "./Canvas.module.css";

const Canvas: Component<{
  id: string;
  onScale: (evt: PanZoom) => void;
}> = ({ id, children, onScale }) => {
  let cnv: any;
  let zoomInstance: PanZoom;
  const zoomHandler = (e: PanZoom) => {
    onScale(e);
  };
  onMount(() => {
    zoomInstance = panzoom(cnv, {
      minZoom: 0.3,
      maxZoom: 3,
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

  return (
    <div class={styles.CanvasWrapper}>
      <div class={styles.Canvas} id={id} ref={cnv}>
        {children}
      </div>
    </div>
  );
};

export default Canvas;

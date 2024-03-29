import { createSignal, JSX, Show } from "solid-js";
import { IPosition } from "../../definitions";
import { useChartStore } from "../store/chartStore";

import styles from "./Canvas.module.css";
export function AreaSelect(props: { children: any }) {
  const [state, actions] = useChartStore();
  const [coord, setCoord] = createSignal();
  let canvas: any;

  const onMouseDown = (startEvent: PointerEvent) => {
    if (!canvas || !state.selection || (startEvent as any)["diagramDetails"]) {
      return;
    }

    const scale = state.scale;
    const canvasRect = canvas.getBoundingClientRect();

    startEvent.preventDefault();
    startEvent.stopPropagation();

    const from = {
      x: (startEvent.clientX - canvasRect.left) / scale,
      y: (startEvent.clientY - canvasRect.top) / scale,
    };

    let pointTo: IPosition;

    const mouseMoveHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      pointTo = {
        x: (e.clientX - canvasRect.left) / scale,
        y: (e.clientY - canvasRect.top) / scale,
      };

      setCoord({ from, to: pointTo });
    };

    const mouseUpHandler = () => {
      const selection = getSelectedNodes({ from, to: pointTo });
      actions.onAreaSelection(selection);
      window.removeEventListener("pointerup", mouseUpHandler, false);
      window.removeEventListener("pointermove", mouseMoveHandler, false);
      setCoord(undefined);
    };

    window.addEventListener("pointerup", mouseUpHandler, false);
    window.addEventListener("pointermove", mouseMoveHandler, false);
  };

  const getSelectionBox = (selArea: any) => {
    const rect = selArea ? selectionBoxRect(selArea) : undefined;

    const style: JSX.CSSProperties | undefined = rect
      ? {
          height: `${rect?.height}px`,
          width: `${rect?.width}px`,
          top: `${rect?.top}px`,
          left: `${rect?.left}px`,
        }
      : undefined;

    return (
      <Show when={style}>
        <div style={style} class={styles.SelectedArea} />
      </Show>
    );
  };

  const selectionBoxRect = (selArea: any) => {
    if (!selArea.to || !selArea.from) {
      return undefined;
    }
    const left = Math.min(selArea.from.x, selArea.to.x) - 1;
    const top = Math.min(selArea.from.y, selArea.to.y) - 1;
    const width = Math.abs(selArea.from.x - selArea.to.x) + 1;
    const height = Math.abs(selArea.from.y - selArea.to.y) + 1;
    return {
      top,
      left,
      width,
      height,
    };
  };

  const getSelectedNodes = (selectedArea: {
    from: IPosition;
    to: IPosition;
  }) => {
    const selectionRect = selectionBoxRect(selectedArea);
    const selection = Object.keys(state.chart.nodes).reduce(
      (acc: any, key: string) => {
        const node = state.chart.nodes[key];
        const nodeEl = (window as any).DMBRoot.getElementById(
          `${node.id}-drag-hat`,
        ) as HTMLElement;
        const nodeBox = {
          top: node.position.y,
          left: node.position.x,
          width: nodeEl.clientWidth,
          height: nodeEl.clientHeight,
        };

        return {
          ...acc,
          [`${key}`]: boxIntersects(selectionRect, nodeBox),
        };
      },
      {},
    );
    return selection;
  };

  return (
    <div
      role="presentation"
      ref={canvas}
      onPointerDown={onMouseDown}
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      {getSelectionBox(coord())}
      {props.children}
    </div>
  );
}

/**
 * Calculate if two segments overlap in 1D
 * @param lineA [min, max]
 * @param lineB [min, max]
 */
const lineIntersects = (lineA: Array<number>, lineB: Array<number>): boolean =>
  lineA[1] >= lineB[0] && lineB[1] >= lineA[0];

/**
 * Detect 2D box intersection - the two boxes will intersect
 * if their projections to both axis overlap
 * @private
 */
const boxIntersects = (
  boxA:
    | { left: number; top: number; width: number; height: number }
    | undefined,
  boxB:
    | { left: number; top: number; width: number; height: number }
    | undefined,
): boolean => {
  if (!boxA || !boxB) {
    return false;
  }
  // calculate coordinates of all points
  const boxAProjection = {
    x: [boxA.left, boxA.left + boxA.width],
    y: [boxA.top, boxA.top + boxA.height],
  };

  const boxBProjection = {
    x: [boxB.left, boxB.left + boxB.width],
    y: [boxB.top, boxB.top + boxB.height],
  };

  return (
    lineIntersects(boxAProjection.x, boxBProjection.x) &&
    lineIntersects(boxAProjection.y, boxBProjection.y)
  );
};

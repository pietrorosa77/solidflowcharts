import { createContext, useContext, batch } from "solid-js";
import { createStore, DeepReadonly } from "solid-js/store";
import { IChart, IPosition, ISize } from "../../definitions";
import { getPositionWithParentBoundsSize } from "./utils";

const ChartContext = createContext();

interface IChartActions {
  nodesSizeChanged(evt: ResizeObserverEntry[]): void;
  onNodeDrag(evt: { nodeId: string; position: IPosition }): void;
  onMultiDrag(evt: {
    leaderId: string;
    leaderPos: IPosition;
    canvasSize: ISize;
    multiSelectOffsets: any;
    delta: { x: number; y: number };
  }): void;
  onScale(scale: number): void;
  onToggleNodeSelection(id: string, selected: boolean): void;
}

export function ChartProvider(props: {
  chart: IChart;
  children: any;
}) {
  const [state, setChart] = createStore({
      chart: props.chart,
      scale: 1,
    }),
    store = [
      state,
      {
        nodesSizeChanged(evt: ResizeObserverEntry[]) {
          onNodesSizeChanged(evt);
        },
        onNodeDrag(evt: { nodeId: string; position: IPosition }) {
          onNodeDrag(evt);
        },
        onMultiDrag(evt: {
          leaderId: string;
          leaderPos: IPosition;
          canvasSize: ISize;
          multiSelectOffsets: any;
          delta: { x: number; y: number };
        }) {
          onMultiDrag(evt);
        },
        onScale(scale: number) {
          onScale(scale);
        },
        onToggleNodeSelection(id: string, selected: boolean) {
          onToggleNodeSelection(id, selected);
        },
      } as IChartActions,
    ];

  const onNodesSizeChanged = (evt: ResizeObserverEntry[]): void => {
    batch(() => {
      evt.forEach((e) => {
        const nodeId = e.target.getAttribute("data-node-id") as string;
        setChart("chart", "nodes", nodeId, "size", () => {
          return {
            h: e.contentRect.height,
            w: e.contentRect.width,
          };
        });
      });
    });
    console.log("node size changed", evt);
  };

  const onScale = (scale: number): void => {
    setChart("scale", () => scale);
  };

  const onNodeDrag = (evt: { nodeId: string; position: IPosition }): void => {
    setChart("chart", "nodes", evt.nodeId, "position", () => {
      return evt.position;
    });
  };

  const onToggleNodeSelection = (id: string, selected: boolean): void => {
    setChart("chart", "selected", id, () => selected);
  };

  const onMultiDrag = (evt: {
    leaderId: string;
    leaderPos: IPosition;
    canvasSize: ISize;
    multiSelectOffsets: any;
    delta: { x: number; y: number };
  }) => {
    batch(() => {
      setChart("chart", "nodes", evt.leaderId, "position", () => {
        return evt.leaderPos;
      });

      Object.keys(state.chart.selected)
        .filter((k) => k !== evt.leaderId)
        .forEach((nodeId) => {
          const currNode = state.chart.nodes[nodeId];
          const newPosition = getPositionWithParentBoundsSize(
            evt.canvasSize,
            currNode.size || { w: 0, h: 0 },
            evt.multiSelectOffsets[`${currNode.id}-drag-hat`],
            currNode.position.x + evt.delta.x,
            currNode.position.y + evt.delta.y
          );
          setChart("chart", "nodes", nodeId, "position", () => {
            return newPosition;
          });
        });
    });
  };

  return (
    <ChartContext.Provider value={store}>
      {props.children}
    </ChartContext.Provider>
  );
}

export function useChartStore(): [
  DeepReadonly<{
    chart: IChart;
    scale: number;
  }>,
  IChartActions
] {
  return useContext(ChartContext) as any;
}

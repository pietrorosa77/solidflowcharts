import { cloneDeep } from "lodash";
import { nanoid } from "nanoid";
import { createContext, useContext, batch } from "solid-js";
import { createStore, DeepReadonly } from "solid-js/store";
import {
  ExtendedNode,
  IChart,
  ILink,
  IPosition,
  ISize,
} from "../../definitions";
import { UndoRedoManager } from "./undo-redo";
import {
  getLinksForPort,
  getPositionWithParentBoundsSize,
  isValidLink,
  pointInNode,
} from "./utils";

const ChartContext = createContext();

export interface IChartActions {
  nodesSizeChanged: (evt: ResizeObserverEntry[]) => void;
  onNodeDrag: (evt: { nodeId: string; position: IPosition }) => void;
  onMultiDrag: (evt: {
    leaderId: string;
    leaderPos: IPosition;
    canvasSize: ISize;
    multiSelectOffsets: any;
    delta: { x: number; y: number };
  }) => void;
  onNodeDraggingEnd: () => void;
  onScale: (scale: number) => void;
  onToggleNodeSelection: (id: string, selected: boolean) => void;
  onCreatingLink: (link: ILink) => void;
  onEndConnection: (link: ILink, portLinks: DeepReadonly<ILink>[]) => void;
  onRemoveLinks: (nodeId: string, portId: string) => void;
  onDeleteNodes: (nodeIds: string[]) => void;
  onNodeChanged: (nodeId: string, node: ExtendedNode) => void;
  onAddNode: (node: ExtendedNode) => void;
  onToggleAreaSelection: (enableSelection: boolean) => void;
  onAreaSelection: (selection: { [key: string]: boolean }) => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleSidebar: () => void;
}

export function ChartProvider(props: {
  chart: IChart;
  children: any;
  onHistoryChange?: (chart: IChart) => void;
}) {
  // eslint-disable-next-line
  const history = new UndoRedoManager(cloneDeep(props.chart));

  const recordHistory = (chart: IChart, action: string, skipSaving = false) => {
    const current = skipSaving ? chart : history.save(chart, action);
    setChart("canRedo", () => history.canRedo());
    setChart("canUndo", () => history.canUndo());
    if (props.onHistoryChange) {
      props.onHistoryChange(current);
    }
  };

  const [state, setChart] = createStore({
      // eslint-disable-next-line
      chart: props.chart,
      scale: 1,
      selection: false,
      portHeight: 30,
      portOffset: 35,
      newLink: undefined,
      canUndo: false,
      canRedo: false,
      sidebar: false,
    } as DeepReadonly<{
      chart: IChart;
      scale: number;
      newLink: undefined | ILink;
      selection: boolean;
      canUndo: boolean;
      canRedo: boolean;
      sidebar: boolean;
    }>),
    store = [
      state,
      {
        nodesSizeChanged(evt: ResizeObserverEntry[]) {
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
            recordHistory(state.chart, "onNodeSizeChanged");
          });
        },
        onNodeDrag(evt: { nodeId: string; position: IPosition }) {
          setChart("chart", "nodes", evt.nodeId, "position", () => {
            return evt.position;
          });
        },
        onToggleSidebar() {
          setChart("sidebar", () => !state.sidebar);
        },
        onMultiDrag(evt: {
          leaderId: string;
          leaderPos: IPosition;
          canvasSize: ISize;
          multiSelectOffsets: any;
          delta: { x: number; y: number };
        }) {
          batch(() => {
            setChart("chart", "nodes", evt.leaderId, "position", () => {
              return evt.leaderPos;
            });

            Object.keys(state.chart.selected)
              .filter((k) => k !== evt.leaderId && state.chart.selected[k])
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
        },
        onScale(scale: number) {
          setChart("scale", () => scale);
        },
        onAreaSelection(selection: { [key: string]: boolean }) {
          batch(() => {
            setChart("chart", "selected", () => selection);
            recordHistory(state.chart, "crtAction");
          });
        },
        onToggleNodeSelection(id: string, selected: boolean) {
          batch(() => {
            setChart("chart", "selected", id, () => selected);
            recordHistory(state.chart, "crtAction");
          });
        },
        onToggleAreaSelection(enableSelection: boolean) {
          batch(() => {
            setChart("selection", () => enableSelection);
            recordHistory(state.chart, "crtAction");
          });
        },
        onCreatingLink(link: ILink) {
          setChart("newLink", () => link as any);
        },
        onEndConnection(link: ILink, portLinks: DeepReadonly<ILink>[]) {
          batch(() => {
            const nodeTo = Object.keys(state.chart.nodes)
              .map((key) => state.chart.nodes[key])
              .find((n) => link.posTo && pointInNode(n, link.posTo));

            if (
              !nodeTo ||
              !isValidLink(nodeTo.id, portLinks, link.from.nodeId)
            ) {
              setChart("newLink", () => undefined);
              return;
            }

            const newLink = {
              ...link,
              id: nanoid(),
              posTo: undefined,
              to: nodeTo.id,
            };

            setChart("chart", "links", newLink.id, () => newLink);
            setChart(
              "chart",
              "paths",
              `${newLink.from.nodeId}-${newLink.from.portId}`,
              () => newLink.to
            );
            setChart("newLink", () => undefined);
            recordHistory(state.chart, "crtAction");
          });
        },
        // eslint-disable-next-line
        onRemoveLinks(nodeId: string, portId: string) {
          const portLinks = getLinksForPort(state.chart, nodeId, portId);
          batch(() => {
            portLinks.forEach((l) => {
              setChart("chart", "links", l.id, () => undefined);
            });
            setChart("chart", "paths", `${nodeId}-${portId}`, () => undefined);
            recordHistory(state.chart, "crtAction");
          });
        },
        onDeleteNodes(ids: string[]) {
          batch(() => {
            const links = Object.keys(state.chart.links).filter((k) => {
              const l = state.chart.links[k];
              return ids.includes(l.to) || ids.includes(l.from.nodeId);
            });

            const paths = Object.keys(state.chart.paths).filter((k) => {
              const pathsFrom = ids.filter((id) => k.startsWith(id)).length;
              const pathTo = ids.includes(state.chart.paths[k]);
              return pathsFrom || pathTo;
            });
            ids.forEach((id) => {
              setChart("chart", "nodes", id, () => undefined);
            });
            links.forEach((l) => {
              setChart("chart", "links", l, () => undefined);
            });
            paths.forEach((p) => {
              setChart("chart", "paths", p, () => undefined);
            });
            recordHistory(state.chart, "crtAction");
          });
        },
        onNodeChanged(nodeId: string, node: ExtendedNode) {
          batch(() => {
            const oldNode = state.chart.nodes[nodeId];
            const oldPortsKeys = Object.keys(oldNode.ports);
            const newPortKeys = Object.keys(node.ports);

            const removedPorts = oldPortsKeys.filter(
              (k) => !newPortKeys.includes(k)
            );
            const removedLinks = Object.keys(state.chart.links).filter((k) => {
              const l = state.chart.links[k];
              return (
                removedPorts.includes(l.from.portId) &&
                l.from.nodeId === oldNode.id
              );
            });

            const pathsToDelete = Object.keys(state.chart.paths).filter((k) => {
              const toDelete =
                newPortKeys.filter((id) => k.endsWith(id)).length === 0;
              return toDelete;
            });

            removedLinks.forEach((l) => {
              setChart("chart", "links", l, () => undefined);
            });
            pathsToDelete.forEach((p) => {
              setChart("chart", "paths", p, () => undefined);
            });
            setChart("chart", "nodes", nodeId, () => node);

            recordHistory(state.chart, "crtAction");
          });
        },
        onAddNode(node: ExtendedNode) {
          batch(() => {
            const newNode = {
              ...node,
              id: nanoid(),
            };

            setChart("chart", "nodes", newNode.id, () => newNode);
            recordHistory(state.chart, "crtAction");
          });
        },
        onUndo() {
          batch(() => {
            const chart = history.undo();
            setChart("chart", () => chart);
            recordHistory(state.chart, "undo");
          });
        },
        onRedo() {
          batch(() => {
            const chart = history.redo();
            setChart("chart", () => chart);
            recordHistory(chart, "crtAction");
          });
        },
        onNodeDraggingEnd() {
          batch(() => {
            recordHistory(state.chart, "crtAction");
          });
        },
      } as IChartActions,
    ];

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
    selection: boolean;
    portHeight: number;
    portOffset: number;
    newLink: undefined | ILink;
    canUndo: boolean;
    canRedo: boolean;
    sidebar: boolean;
  }>,
  IChartActions
] {
  return useContext(ChartContext) as any;
}

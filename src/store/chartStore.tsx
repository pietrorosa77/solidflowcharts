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

type ChartStore = {
  chart: IChart;
  scale: number;
  selection: boolean;
  portHeight: number;
  portOffset: number;
  newLink: undefined;
  canUndo: boolean;
  canRedo: boolean;
  sidebar: boolean;
  editNodeContent?: string;
  editNodeSettings?: string;
};
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
  onUpdateChartProps: (props: any) => void;
  onEndConnection: (link: ILink, portLinks: DeepReadonly<ILink>[]) => void;
  onRemoveLinks: (nodeId: string, portId: string) => void;
  onDeleteNodes: (nodeIds: string[]) => void;
  onNodeChanged: (nodeId: string, node: ExtendedNode) => void;
  onAddNode: (node: ExtendedNode) => void;
  onToggleAreaSelection: (enableSelection: boolean) => void;
  onAreaSelection: (selection: { [key: string]: boolean }) => void;
  onToggleEditNodeSettings: (nodeId?: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleSidebar: () => void;
}

export function ChartProvider(props: {
  initialChart: IChart;
  children: any;
  onHistoryChange?: (chart: IChart) => void;
}) {
  const history = new UndoRedoManager(cloneDeep(props.initialChart));

  const recordHistory = (chart: IChart, action: string, skipSaving = false) => {
    const current = skipSaving ? chart : history.save(chart, action);
    setChart("canRedo", () => history.canRedo());
    setChart("canUndo", () => history.canUndo());
    if (props.onHistoryChange) {
      props.onHistoryChange(current);
    }
  };

  const [state, setChart] = createStore({
      chart: props.initialChart,
      scale: 1,
      selection: false,
      portHeight: 30,
      portOffset: 35,
      newLink: undefined,
      canUndo: false,
      canRedo: false,
      sidebar: false,
    } as ChartStore),
    store = [
      state,
      {
        // eslint-disable-next-line
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
        // eslint-disable-next-line
        onNodeDrag(evt: { nodeId: string; position: IPosition }) {
          setChart("chart", "nodes", evt.nodeId, "position", () => {
            return evt.position;
          });
        },
        // eslint-disable-next-line
        onToggleSidebar() {
          setChart("sidebar", () => !state.sidebar);
        },
        // eslint-disable-next-line
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
                  currNode.position.y + evt.delta.y,
                );
                setChart("chart", "nodes", nodeId, "position", () => {
                  return newPosition;
                });
              });
          });
        },
        // eslint-disable-next-line
        onScale(scale: number) {
          setChart("scale", () => scale);
        },
        // eslint-disable-next-line
        onUpdateChartProps(props: any) {
          const oldProps = state.chart.properties || {};
          const newProps = {
            ...oldProps,
            ...props,
          };
          setChart("chart", "properties", () => newProps);
        },
        // eslint-disable-next-line
        onAreaSelection(selection: { [key: string]: boolean }) {
          batch(() => {
            setChart("chart", "selected", () => selection);
            recordHistory(state.chart, "crtAction");
          });
        },
        // eslint-disable-next-line
        onToggleNodeSelection(id: string, selected: boolean) {
          batch(() => {
            setChart("chart", "selected", id, () => selected);
            recordHistory(state.chart, "crtAction");
          });
        },
        // eslint-disable-next-line
        onToggleAreaSelection(enableSelection: boolean) {
          batch(() => {
            setChart("selection", () => enableSelection);
            recordHistory(state.chart, "crtAction");
          });
        },
        // eslint-disable-next-line
        onCreatingLink(link: ILink) {
          setChart("newLink", () => link as any);
        },
        // eslint-disable-next-line
        onEndConnection(link: ILink, portLinks: DeepReadonly<ILink>[]) {
          batch(() => {
            const nodeTo = Object.keys(state.chart.nodes)
              .map((key) => state.chart.nodes[key])
              .find((n) => link.posTo && pointInNode(n, link.posTo));

            if (!nodeTo || !isValidLink(nodeTo, portLinks, link.from.nodeId)) {
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
              () => newLink.to,
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
              setChart("chart", "links", l.id, () => undefined as any);
            });
            setChart(
              "chart",
              "paths",
              `${nodeId}-${portId}`,
              () => undefined as any,
            );
            recordHistory(state.chart, "crtAction");
          });
        },
        // eslint-disable-next-line
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
              setChart("chart", "selected", id, () => undefined as any);
            });
            links.forEach((l) => {
              setChart("chart", "links", l, () => undefined as any);
            });
            paths.forEach((p) => {
              setChart("chart", "paths", p, () => undefined as any);
            });
            recordHistory(state.chart, "crtAction");
          });
        },
        // eslint-disable-next-line
        onNodeChanged(nodeId: string, node: ExtendedNode) {
          batch(() => {
            debugger;
            const oldNode = state.chart.nodes[nodeId];
            const oldPortsKeys = Object.keys(oldNode.ports);
            const newPortKeys = Object.keys(node.ports);

            const removedPorts = oldPortsKeys.filter(
              (k) => !newPortKeys.includes(k),
            );
            const removedLinks = Object.keys(state.chart.links).filter((k) => {
              const l = state.chart.links[k];
              return (
                removedPorts.includes(l.from.portId) &&
                l.from.nodeId === oldNode.id
              );
            });

            const oldNodePaths = Object.keys(state.chart.paths).filter((k) =>
              k.startsWith(`${nodeId}-`),
            );
            const pathsToDelete = oldNodePaths.filter(
              (path) =>
                newPortKeys.filter((pid) => path.endsWith(pid)).length === 0,
            );

            removedLinks.forEach((l) => {
              setChart("chart", "links", l, () => undefined as any);
            });
            pathsToDelete.forEach((p) => {
              setChart("chart", "paths", p, () => undefined as any);
            });
            setChart("chart", "nodes", nodeId, () => node);
            setChart("chart", "nodes", nodeId, 'content', () => [...node.content]);

            recordHistory(state.chart, "crtAction");
          });
        },
        // eslint-disable-next-line
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
        // eslint-disable-next-line
        onUndo() {
          batch(() => {
            const chart = history.undo();
            setChart("chart", () => chart);
            recordHistory(state.chart, "undo");
          });
        },
        // eslint-disable-next-line
        onRedo() {
          batch(() => {
            const chart = history.redo();
            setChart("chart", () => chart);
            recordHistory(chart, "crtAction");
          });
        },
        // eslint-disable-next-line
        onNodeDraggingEnd() {
          batch(() => {
            recordHistory(state.chart, "crtAction");
          });
        },
        // eslint-disable-next-line
        onToggleEditNodeSettings(nodeId?: string) {
          setChart("editNodeSettings", () => nodeId || undefined);
        },
      } as IChartActions,
    ];

  return (
    <ChartContext.Provider value={store}>
      {props.children}
    </ChartContext.Provider>
  );
}

export function useChartStore(): [ChartStore, IChartActions] {
  return useContext(ChartContext) as any;
}

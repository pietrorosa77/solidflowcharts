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
}

export function ChartProvider(props: { chart: IChart; children: any }) {
  const [state, setChart] = createStore({
      chart: props.chart,
      scale: 1,
      selection: false,
      portHeight: 30,
      portOffset: 35,
      newLink: undefined,
    } as DeepReadonly<{
      chart: IChart;
      scale: number;
      newLink: undefined | ILink;
      selection: boolean;
    }>),
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
        onAreaSelection(selection: { [key: string]: boolean }) {
          setChart("chart", "selected", () => selection);
        },
        onToggleNodeSelection(id: string, selected: boolean) {
          onToggleNodeSelection(id, selected);
        },
        onToggleAreaSelection(enableSelection: boolean) {
          setChart("selection", () => enableSelection);
        },
        onCreatingLink(link: ILink) {
          onCreatingLink(link);
        },
        onEndConnection(link: ILink, portLinks: DeepReadonly<ILink>[]) {
          onEndConnection(link, portLinks);
        },
        onRemoveLinks(nodeId: string, portId: string) {
          onRemoveLinks(nodeId, portId);
        },
        onDeleteNodes(nodeIds: string[]) {
          onDeleteNodes(nodeIds);
        },
        onNodeChanged(nodeId: string, node: ExtendedNode) {
          onNodeChanged(nodeId, node);
        },
        onAddNode(node: ExtendedNode) {
          onAddNode(node);
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

  const onCreatingLink = (link: ILink): void => {
    setChart("newLink", () => link as any);
  };

  const onEndConnection = (
    link: ILink,
    portLinks: DeepReadonly<ILink>[]
  ): void => {
    batch(() => {
      const nodeTo = Object.keys(state.chart.nodes)
        .map((key) => state.chart.nodes[key])
        .find((n) => link.posTo && pointInNode(n, link.posTo));

      if (!nodeTo || !isValidLink(nodeTo.id, portLinks, link.from.nodeId)) {
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
    });
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

  const onRemoveLinks = (nodeId: string, portId: string): void => {
    const portLinks = getLinksForPort(state.chart, nodeId, portId);
    batch(() => {
      portLinks.forEach((l) => {
        setChart("chart", "links", l.id, () => undefined);
      });
      setChart("chart", "paths", `${nodeId}-${portId}`, () => undefined);
    });
  };

  const onDeleteNodes = (ids: string[]): void => {
    const links = Object.keys(state.chart.links).filter((k) => {
      const l = state.chart.links[k];
      return ids.includes(l.to) || ids.includes(l.from.nodeId);
    });

    const paths = Object.keys(state.chart.paths).filter((k) => {
      const pathsFrom = ids.filter((id) => k.startsWith(id)).length;
      const pathTo = ids.includes(state.chart.paths[k]);
      return pathsFrom || pathTo;
    });

    batch(() => {
      ids.forEach((id) => {
        setChart("chart", "nodes", id, () => undefined);
      });
      links.forEach((l) => {
        setChart("chart", "links", l, () => undefined);
      });
      paths.forEach((p) => {
        setChart("chart", "paths", p, () => undefined);
      });
    });
  };

  const onNodeChanged = (nodeId: string, node: ExtendedNode) => {
    const oldNode = state.chart.nodes[nodeId];
    const oldPortsKeys = Object.keys(oldNode.ports);
    const newPortKeys = Object.keys(node.ports);

    const removedPorts = oldPortsKeys.filter((k) => !newPortKeys.includes(k));
    const removedLinks = Object.keys(state.chart.links).filter((k) => {
      const l = state.chart.links[k];
      return (
        removedPorts.includes(l.from.portId) && l.from.nodeId === oldNode.id
      );
    });

    const pathsToDelete = Object.keys(state.chart.paths).filter((k) => {
      const toDelete = newPortKeys.filter((id) => k.endsWith(id)).length === 0;
      return toDelete;
    });

    batch(() => {
      removedLinks.forEach((l) => {
        setChart("chart", "links", l, () => undefined);
      });
      pathsToDelete.forEach((p) => {
        setChart("chart", "paths", p, () => undefined);
      });
      setChart("chart", "nodes", nodeId, () => node);
    });
  };

  const onAddNode = (node: ExtendedNode) => {
    const newNode = {
      ...node,
      id: nanoid(),
    };

    setChart("chart", "nodes", newNode.id, () => newNode);
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
    selection: boolean;
    portHeight: number;
    portOffset: number;
    newLink: undefined | ILink;
  }>,
  IChartActions
] {
  return useContext(ChartContext) as any;
}

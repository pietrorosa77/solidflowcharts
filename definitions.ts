export interface IPosition {
  x: number;
  y: number;
}

export interface IChart {
  nodes: {
    [id: string]: ExtendedNode;
  };
  links: {
    [id: string]: ILink;
  };
  properties?: any;

  selected: {
    [id: string]: boolean;
  };
  paths: { [id: string]: string };
}

export interface INode {
  id: string;
  title: string;
  position: IPosition;
  size?: { w: number; h: number };
  content: string;
  properties?: { [key: string]: any };
  ports: {
    [id: string]: IPort;
  };
}

export interface ExtendedNode extends INode {
  [key: string]: any;
}

export interface IPort {
  id: string;
  bgColor: string;
  text: string;
  index: number;
  properties: {
    [key: string]: any;
  };
}

export interface ILink {
  id: string;
  from: {
    nodeId: string;
    portId: string;
  };
  to: string;
  posTo?: IPosition;
}

export interface IConfig {
  validateLink?: (chart: IChart, props: any) => boolean;
  [key: string]: any;
}

// export interface IPanZoomInfo {
//   x: number;
//   y: number;
//   scale: number;
//   minZoom: number;
//   maxZoom: number;
// }

export interface IOnDragNodeStopEvent {
  position: IPosition;
  node: INode;
  canvasSize: { w: number; h: number };
  multiSelectOffsets: {
    [key: string]: {
      offsetLeft: number;
      offsetRight: number;
      offsetTop: number;
      offsetBottom: number;
    };
  };
  finalDelta: {
    x: number;
    y: number;
  };
  multi: boolean;
}

export interface IOnEndConnection {
  link: ILink;
  portLinks: ILink[];
}

export interface IOnNodeSelectionChanged {
  nodeId: string;
  selected: boolean;
}

export interface IFloatingPosition {
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
}

export type SimpleChartAction = { type: Actions; payload: DiagramEventArgs };
export type ChartAction = SimpleChartAction | ((store: ChartStore) => any);

export type ChartDispatch = (action: ChartAction) => any;

export type ChartStore = {
  getState: () => IFlowchartState;
  dispatch: ChartDispatch;
  getEventBus: () => IChartEventBus;
};

export type ChartMiddlewhare = (
  store: ChartStore
) => (next: ChartDispatch) => (action: ChartAction) => any;

export type ChartEventBusUnsubscibeHandle = (event: CustomEvent) => void;
export type ChartEvents =
  | "evt-stateChanged"
  | "evt-nodedrag"
  | "evt-connection"
  | "evt-highlightLink"
  | "evt-togglepanzoom"
  | "evt-resetpanzoom"
  | "evt-nodessizechanged"
  | "evt-nodesettings"
  | "evt-nodeupdated"
  | "evt-toggleSidebar";

export interface IToggleSidebarEvent {
  opened: boolean;
}

export interface IChartEventBus {
  subscribe: (
    event: ChartEvents,
    callback: (data?: any) => void,
    options?: AddEventListenerOptions
  ) => ChartEventBusUnsubscibeHandle;

  unSubscribe: (
    event: ChartEvents,
    unsubscribeHandle: ChartEventBusUnsubscibeHandle,
    options?: AddEventListenerOptions
  ) => void;

  emit: (type: ChartEvents, data: any) => void;

  storeDiagramZoomScale: (panzomInfo: {
    scale: number;
    x: number;
    y: number;
  }) => void;
  getDiagramZoomScale: () => { scale: number; x: number; y: number };
  observeElementSize: (
    element: Element,
    options?: ResizeObserverOptions | undefined
  ) => void;
  unobserveElementSize: (element: Element) => void;
  stopSizeObserver: () => void;
}
export type Actions =
  | "onDragNodeStop"
  | "onPortPositioningChange"
  | "onEndConnection"
  | "onDeleteLink"
  | "onDeleteNodes"
  | "onNodeSelectionChanged"
  | "onAreaSelectionChanged"
  | "onNodeAdded"
  | "onUndo"
  | "onUpdateNode"
  | "onNodeSizeChanged"
  | "onNameChange"
  | "onRedo"
  | ChartEvents;

export interface IFlowchartState {
  chart: IChart;
  name: string;
  canUndo: boolean;
  canRedo: boolean;
  changeSummary: {
    totalActions: number;
    lastAction: Actions | undefined;
  };
}

export interface IOnAreaSelectionChanged {
  [id: string]: boolean;
}

export interface INodeSidebarButtonProps {
  onDragStart: (evt: any, node: INode) => void;
  theme: any;
}

export interface IFloatPosition {
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
}

export interface INodePanelEditor {
  onNodeChange: (updatedNode: INode) => void;
  node: INode;
  customData?: { [key: string]: any };
  // renderNode?: (node: INode) => JSX.Element;
  // renderPort?: (port: IPort) => JSX.Element;
  nodePropertiesValidator?: (newProps: { [key: string]: any }) => {
    error: string | undefined;
  };
  portPropertiesValidator?: (newProps: { [key: string]: any }) => {
    error: string | undefined;
  };
}

export type IOnNodeDragEvent = {
  shouldSkip: boolean;
  id: string;
  position: IPosition;
  delta: {
    x: number;
    y: number;
  };
  canvasSize: {
    w: number;
    h: number;
  };
  multiSelectOffsets: any;
  multi?: boolean;
};

export interface IOnConnection {
  nodeFromId: string;
  positionTo: IPosition;
  portFromId: string;
}

export interface IOnHighlightLinkEvent {
  highlight: boolean;
  key: string;
}

export type DiagramEventArgs =
  | undefined
  | IOnDragNodeStopEvent
  | IOnConnection
  | IOnEndConnection
  | IOnNodeSelectionChanged
  | IOnAreaSelectionChanged
  | INode
  | ResizeObserverEntry[]
  | string
  | string[]
  | IOnNodeDragEvent
  | IToggleSidebarEvent
  | IOnHighlightLinkEvent
  | { x: number; y: number };

export interface ISize {
  w: number;
  h: number;
}

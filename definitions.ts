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
  variables?: any;
}

export interface INode {
  id: string;
  title: string;
  position: IPosition;
  size?: { w: number; h: number };
  content: any;
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
  fontColor?: string;
  blockEdit?: boolean;
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

export interface ISize {
  w: number;
  h: number;
}

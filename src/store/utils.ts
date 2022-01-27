import { IChart, ILink, INode, IPosition } from "../../definitions";

export function getPositionWithParentBoundsSize(
  canvasSize: { w: number; h: number },
  nodeSize: { w: number; h: number },
  multiSelectOffsets:
    | {
        offsetLeft: number;
        offsetRight: number;
        offsetTop: number;
        offsetBottom: number;
      }
    | undefined,
  x: number,
  y: number
): IPosition {
  const offsetLeft = multiSelectOffsets?.offsetLeft || 0;
  const offsetRight = multiSelectOffsets?.offsetRight || 0;
  const offsetTop = multiSelectOffsets?.offsetTop || 0;
  const offsetBottom = multiSelectOffsets?.offsetBottom || 0;

  const bounds = {
    left: 0 + offsetLeft,
    right: canvasSize.w - (nodeSize.w + offsetRight),
    top: 0 + offsetTop,
    bottom: canvasSize.h - (nodeSize.h + offsetBottom),
  };

  x = Math.min(x, bounds.right);
  y = Math.min(y, bounds.bottom);

  // But above left and top limits.
  x = Math.max(x, bounds.left);
  y = Math.max(y, bounds.top);

  return { x, y };
}

export const getMultiselectionSquareRectOffsets = (scale: number) => {
  const elements = document.querySelectorAll(".drag-hat-selected");

  if (!elements.length) {
    return {};
  }

  const selectedRects = Array.from(elements).map((e) => ({
    rect: e.getBoundingClientRect(),
    id: e.id,
  }));

  if (!selectedRects || !selectedRects.length) {
    return {};
  }

  const minTop = Math.min(...selectedRects.map((r) => r.rect.top));
  const maxBottom = Math.max(...selectedRects.map((r) => r.rect.bottom));
  const minLeft = Math.min(...selectedRects.map((r) => r.rect.left));
  const maxRight = Math.max(...selectedRects.map((r) => r.rect.right));
  const selRect = {
    left: minLeft,
    top: minTop,
    bottom: maxBottom,
    right: maxRight,
  };

  const offsetsMap = selectedRects.reduce((acc, el) => {
    return {
      ...acc,
      [`${el.id}`]: {
        offsetLeft: Math.abs(el.rect.left - selRect.left) / scale,
        offsetRight: Math.abs(el.rect.right - selRect.right) / scale,
        offsetTop: Math.abs(el.rect.top - selRect.top) / scale,
        offsetBottom: Math.abs(el.rect.bottom - selRect.bottom) / scale,
      },
    };
  }, {});

  return offsetsMap;
};

export const blockEventHandler = (e: Event) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  e.cancelBubble = true;
};

export const createFontStyle = (fontFace: string) => {
  const fontStyle = document.createElement("style");
  fontStyle.appendChild(document.createTextNode(fontFace));
  document.head.appendChild(fontStyle);
};

export const pointInNode = (node: INode, point: IPosition) => {
  const nodeSize = node.size || {
    h: 0,
    w: 0,
  };
  const x1 = node.position.x;
  const y1 = node.position.y;
  const x2 = node.position.x + nodeSize.w;
  const y2 = node.position.y + nodeSize.h;

  return point.x > x1 && point.x < x2 && point.y > y1 && point.y < y2;
};

export const isValidLink = (
  nodeToId: string,
  links: ILink[],
  fromNodeId: string
) => {
  console.log("from node id", fromNodeId);
  return (
    //nodeToId !== fromNodeId &&
    links.filter((l) => l.to === nodeToId).length === 0
  );
};

export const getChartPaths = (links: { [id: string]: ILink }) =>
  Object.values(links).reduce((acc, current) => {
    const linksMapKey = `${current.from.nodeId}-${current.from.portId}`;
    return {
      ...acc,
      [`${linksMapKey}`]: current.to,
    };
  }, {} as { [id: string]: string });

export const getLinksForPort = (
  chart: IChart,
  nodeId: string,
  portId: string
) => {
  return Object.keys(chart.links)
    .filter(
      (k) =>
        chart.links[k].from.nodeId === nodeId &&
        chart.links[k].from.portId === portId
    )
    .map((linkId) => chart.links[linkId]);
};

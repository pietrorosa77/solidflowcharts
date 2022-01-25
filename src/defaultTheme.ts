export interface IDiagramTheme {
  width: string;
  height: string;

  palette: {
    canvasBackgroundColor: string;
    gridBackgroundColor: string;
    focus: string;
    hide: string;
    connection: string;
    "accent-1": string;
    nodehighlight: string;
    nodeBorder: string;
    bars: string;
    brand: string;
    options: string;
    nodeBackground: string;
    nodeBorderHover: string;
  };
}
const theme: IDiagramTheme = {
  width: "100vw",
  height: "100vh",

  palette: {
    canvasBackgroundColor: "#3a5584",
    gridBackgroundColor: "#3a5584",
    focus: "cornflowerblue",
    hide: "transparent",
    connection: "cornflowerblue",
    "accent-1": "rgba(81, 203, 238, 1)",
    nodehighlight: "#6FFFB0",
    nodeBorder: "rgb(248, 248, 248)",
    bars: "#2b2e4b",
    brand: "#4a4d70",
    nodeBorderHover: "rgba(81, 203, 238, 1)",
    options: "#7D4CDB",
    nodeBackground: "#333333",
  },
};

export const getCssVariables = (theme: IDiagramTheme) => {
  return {
    "--diagram-width": theme.width,
    "--diagram-height": theme.height,
    "--node-border": theme.palette.nodeBorder,
    "--node-borderhover": theme.palette.nodeBorderHover,
    "--canvas-bg": theme.palette.canvasBackgroundColor,
    "--grid-bg": theme.palette.gridBackgroundColor,
    "--accent-color": theme.palette["accent-1"],
    "--connection-color":theme.palette.connection,
    "--brand-color": theme.palette.brand,
    "--bars-color": theme.palette.bars,
    "--ports-bg": theme.palette.options
  };
};

export default theme;

export interface IDiagramTheme {
  width: string;
  height: string;
  fontFace: string;
  fontFamily: string;
  fontSize: string;
  nodeHeadFontSize: string;
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
    nodeFontColor: string;
  };
}
const theme: IDiagramTheme = {
  width: "100vw",
  height: "100vh",
  fontFamily: "'Sora',sans-serif",
  fontSize: "14px",
  nodeHeadFontSize: "18px",
  fontFace: `/* latin-ext */
@font-face {
  font-family: 'Sora';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/sora/v3/xMQOuFFYT72X5wkB_18qmnndmSdSnk-DKQJRBg.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Sora';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/sora/v3/xMQOuFFYT72X5wkB_18qmnndmSdSnk-NKQI.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}`,
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
    nodeFontColor: "#f8f8f8",
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
    "--connection-color": theme.palette.connection,
    "--brand-color": theme.palette.brand,
    "--bars-color": theme.palette.bars,
    "--ports-bg": theme.palette.options,
    "--diagram-font": theme.fontFamily,
    "--diagram-font-size": theme.fontSize,
    "--node-font-color": theme.palette.nodeFontColor,
    "--node-bg-color": theme.palette.nodeBackground,
    "--node-head-font-size": theme.nodeHeadFontSize,
  };
};

export default theme;

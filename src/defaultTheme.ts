export const getCssVariables = (
  width?: string,
  height?: string,
  customTheme?: ICustomTheme,
) => {
  return `:root {
    --diagram-width: ${width || "100vw"};
    --diagram-height: ${height || "100vh"};
    --canvas-bg-color: ${customTheme?.canvasBgColor || "#3a5584"};
    --grid-bg-color: ${customTheme?.gridBgColor || "#3a5584"};
    --grid-lines-color: ${
      customTheme?.gridLinesColor || "rgba(81, 203, 238, 0.1)"
    };
    --grid-lines-outline-color: ${
      customTheme?.gridLinesOutlineColor || "rgba(0, 0, 0, 0.1)"
    };
    --accent-color: ${customTheme?.accentColor || "rgba(81, 203, 238, 1)"};
    --border-color: ${customTheme?.borderColor || "rgb(248, 248, 248)"};
    --connection-color: ${customTheme?.connectionsColor || "cornflowerblue"};
    --brand-color: ${customTheme?.brandColor || "#4a4d70"};
    --bars-color: ${customTheme?.barsColor || "#2b2e4b"};
    --ports-bg-color: ${customTheme?.portsBgColor || "#7D4CDB"};
    --ports-font-color: ${customTheme?.portsFontColor || "#f8f8f8"};
    --diagram-font-family: ${customTheme?.fontFamily || "'Sora',sans-serif"};
    --diagram-font-size: ${customTheme?.fontSize || "16px"};
    --node-font-color: ${customTheme?.nodeFontColor || "#f8f8f8"};
    --node-bg-color: ${customTheme?.nodeBgColor || "#333333"};
    --node-head-font-size:  ${customTheme?.nodeHeadFontSize || "18px"};
    --bg-inactive: ${customTheme?.bgInactive || "rgb(153, 148, 148)"};
    --warning-color: ${customTheme?.warningColor || "rgb(248, 172, 59)"};
    --node-content-bgcolor: ${customTheme?.nodeContentBgColor || "#4a4d70"};
    --node-content-font-color: ${customTheme?.nodeContentFontColor || "#fff"};
    --node-head-bgcolor: ${customTheme?.nodeHeadBgColor || "#4a4d70"};
    --text-selection-color:#000;
    --text-selection-bgcolor:#fff;
    --connection-hover-color: ${
      customTheme?.connectionHoverColor || "rgba(81, 203, 238, 1)"
    };
  }
  ::-moz-selection { /* Code for Firefox */
    color: var(--text-selection-color);
    background: var(--text-selection-bgcolor);
  }

  ::selection {
    color: var(--text-selection-color);
    background: var(--text-selection-bgcolor);
  }`;
};

export interface ICustomTheme {
  canvasBgColor?: string;
  gridBgColor?: string;
  gridLinesColor?: string;
  gridLinesOutlineColor?: string;
  accentColor?: string;
  borderColor?: string;
  connectionsColor?: string;
  brandColor?: string;
  barsColor?: string;
  portsBgColor?: string;
  fontFamily?: string;
  fontSize?: string;
  nodeFontColor?: string;
  nodeBgColor?: string;
  nodeHeadFontSize?: string;
  bgInactive?: string;
  warningColor?: string;
  nodeContentBgColor?: string;
  nodeContentFontColor?: string;
  nodeHeadBgColor?: string;
  portsFontColor?: string;
  connectionHoverColor?: string;
}

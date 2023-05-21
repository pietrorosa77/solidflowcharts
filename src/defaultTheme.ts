export const defaultFontFace = `/* latin-ext */
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
}`;

export const getCssVariables = (width?: string, height?: string, customTheme?: ICustomTheme) => {
  return `:root {
    --diagram-width: ${ width || "100vw"};
    --diagram-height: ${height || "100vh"};
    --canvas-bg-color: ${customTheme?.canvasBgColor || '#3a5584'};
    --grid-bg-color: ${customTheme?.gridBgColor || '#3a5584'};
    --grid-lines-color: ${customTheme?.gridLinesColor || 'rgba(81, 203, 238, 0.1)'};
    --grid-lines-outline-color: ${customTheme?.gridLinesOutlineColor || 'rgba(0, 0, 0, 0.1)'};
    --accent-color: ${customTheme?.accentColor || 'rgba(81, 203, 238, 1)'};
    --border-color: ${customTheme?.borderColor || 'rgb(248, 248, 248)'};
    --connection-color: ${customTheme?.connectionsColor || 'cornflowerblue'};
    --brand-color: ${customTheme?.brandColor || '#4a4d70'};
    --bars-color: ${customTheme?.barsColor || '#2b2e4b'};
    --ports-bg-color: ${customTheme?.portsBgColor || '#7D4CDB'};
    --diagram-font-family: ${customTheme?.fontFamily || "'Sora',sans-serif"};
    --diagram-font-size: ${customTheme?.fontSize || '16px'};
    --node-font-color: ${customTheme?.nodeFontColor || '#f8f8f8'};
    --node-bg-color: ${customTheme?.nodeBgColor || '#333333'};
    --node-head-font-size:  ${customTheme?.nodeHeadFontSize || '18px'};
    --bg-inactive: ${customTheme?.bgInactive || 'rgb(153, 148, 148)'};
    --warning-color: ${customTheme?.warningColor || 'rgb(248, 172, 59)'};
    --node-content-bgcolor: ${customTheme?.nodeContentBgColor || '#4a4d70'};
    --node-content-font-color: ${customTheme?.nodeContentFontColor || '#fff'};
  }`
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
}

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

export const getCssVariables = () => {
  return {
    // --text: #333;
    // --negative-text: #eee;
    // --background: #fff;
    // --border-color: #ccc;
    // --primary: #37c;
    // --primary-text: #eee;
    // --success: #dfd;
    // --success-text: #060;
    // --info: #ddf;
    // --info-text: #00a;
    // --warning: #ffd;
    // --warning-text: #bb0;
    // --error: #fdd;
    // --error-text: #800;
    // --random-color1: #89d;
    // --random-color2: #9bd;
    // --random-color3: #adb;
    // --random-color4: #cc9;
    // --random-color5: #db9;
    // --random-color6: #d99;
    // --random-color7: #c9a;
    // --random-color8: #b9a;
    "--diagram-width": "100vw",
    "--diagram-height": "100vh",
    "--canvas-bg-color": "#3a5584",
    "--grid-bg-color": "#3a5584",
    "--grid-lines-color": "rgba(81, 203, 238, 0.1)",
    "--grid-lines-outline-color": "rgba(0, 0, 0, 0.1)",
    "--accent-color": "rgba(81, 203, 238, 1)",
    "--border-color": "rgb(248, 248, 248)",
    "--connection-color": "cornflowerblue",
    "--brand-color": "#4a4d70",
    "--bars-color": "#2b2e4b",
    "--ports-bg-color": "#7D4CDB",
    "--diagram-font-family": "'Sora',sans-serif",
    "--diagram-font-size": "16px",
    "--node-font-color": "#f8f8f8",
    "--node-bg-color": "#333333",
    "--node-head-font-size": "18px",
    "--bg-inactive": "rgb(153, 148, 148)",
    "--warning-color": "rgb(248, 172, 59)",
  };
};

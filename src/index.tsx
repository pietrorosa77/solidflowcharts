import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
// @ts-ignore
import("../testbot").then((state) => {
  render(
    () => <App initState={state.default} />,
    document.getElementById("root") as HTMLElement
  );
});

import type { Component } from "solid-js";
import { IChart } from "../definitions";
import theme from "./defaultTheme";
import Diagram from "./diagram/Diagram";

export const getInitialSchema = (): IChart => {
  return {
    nodes: {
      node1: {
        id: "node1",
        title:
          "Start! jijij jijijj jijijiij iijijj ijijjijj   ijijiij                  iuhuhuhuhh   uhhuuhhuhu!",
        content: `Welcome *your* user with a nice **message**!😂`,
        position: {
          x: 300,
          y: 100,
        },
        preventRemoval: true,
        ports: {
          port1: {
            id: "port1",
            bgColor: "brand",
            text: "output",
            index: 1,
            properties: {},
          },
        },
      },
      node2: {
        id: "node2",
        title: "Start!",
        content: `Welcome *your* user with a nice **message**!😂`,
        position: {
          x: 600,
          y: 300,
        },
        preventRemoval: true,
        ports: {
          port1: {
            id: "port1",
            bgColor: "brand",
            text: "output",
            index: 1,
            properties: {},
          },
        },
      },
    },
    links: {},
    selected: {},
    paths: {},
  };
};

const App: Component = () => {
  return <Diagram chart={getInitialSchema()} theme={theme} />;
};

export default App;

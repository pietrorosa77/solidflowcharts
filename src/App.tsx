import { nanoid } from "nanoid";
import type { Component } from "solid-js";
import { ExtendedNode, IChart } from "../definitions";
import { Button } from "./components/Button";
import { defaultFontFace } from "./defaultTheme";
import Diagram from "./diagram/Diagram";
import { IChartActions } from "./store/chartStore";
export const getInitialSchema = (): IChart => {
  return {
    nodes: {
      node1: {
        id: "node1",
        title:
          "Start! jijij jijijj jijijiij iijijj ijijjijj   ijijiij                  iuhuhuhuhh   uhhuuhhuhu!",
        content: {
          type: "doc",
          content: [
            {
              type: "image",
              attrs: {
                src: "https://source.unsplash.com/K9QHL52rE2k/800x400",
                alt: null,
                title: null,
              },
            },
            {
              type: "image",
              attrs: {
                src: "https://source.unsplash.com/K9QHL52rE2k/800x400",
                alt: null,
                title: null,
              },
            },
            { type: "paragraph", content: [{ type: "text", text: "ooo" }] },
          ],
        },
        position: {
          x: 300,
          y: 100,
        },
        preventRemoval: true,
        ports: {
          port4: {
            id: "port4",
            bgColor: "brand",
            text: "output 27",
            index: 4,
            properties: {},
          },
          port3: {
            id: "port3",
            bgColor: "brand",
            text: "output 27",
            index: 3,
            properties: {},
          },
          port1: {
            id: "port1",
            bgColor: "brand",
            text: "output 27",
            index: 2,
            properties: {},
          },
          port2: {
            id: "port2",
            bgColor: "option",
            text: "output 1 default",
            index: 1,
            properties: {},
          },
        },
      },
      node2: {
        id: "node2",
        title: "Start!",
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: ":smile: Welcome *your* user with a nice **message**!😂",
                },
              ],
            },
          ],
        } as any,
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
  let actions: IChartActions;
  let node: ExtendedNode;
  const onLoad = (actionsIn: IChartActions) => {
    actions = actionsIn;
  };
  const updateNodeContent = () => {
    const changed = {
      ...node,
      title: nanoid(),
      content: nanoid(),
      ports: {
        port1: {
          id: "port1",
          bgColor: "red",
          text: "output updated",
          index: 1,
          properties: {},
        },
      },
    };
    actions.onNodeChanged(node.id, changed);
  };
  return (
    <>
      {/* <button onClick={updateNodeContent}>test content</button> */}

      <Diagram
        chart={getInitialSchema()}
        fontFace={defaultFontFace}
        onDiagramDashboardToggle={() => {
          console.log("dashboard click");
        }}
        onNodeSettingsClick={(nodeDt: ExtendedNode) =>
          (node = {
            ...nodeDt,
          })
        }
        onHistoryChange={(chart) => {
          console.log("updated chart is", chart)
        }}
        onLoad={onLoad}
      />
    </>
  );
};

export default App;

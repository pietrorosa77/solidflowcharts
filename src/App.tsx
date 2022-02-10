import { ExtendedNode, IChart } from "../definitions";
import { defaultFontFace } from "./defaultTheme";
import Diagram from "./diagram/Diagram";
import { IChartActions } from "./store/chartStore";
import { availableNodes } from "../testNodes";

export const getInitialSchema = () => {
  const str = localStorage.getItem("TESTDMBT");
  return JSON.parse(str as any);
};
const App = (props: { initState: IChart }) => {
  let actions: IChartActions;
  let node: ExtendedNode;
  const test = () => {
    const nd = props.initState.nodes["node1"];
    actions.onNodeChanged("node1", { ...nd, content: "asfafasf" });
  };
  const onLoad = (actionsIn: IChartActions) => {
    actions = actionsIn;
    console.log("actions are", actions);
  };
  return (
    <>
      <button onclick={test}>test</button>
      <Diagram
        chart={props.initState}
        fontFace={defaultFontFace}
        messageSeparator="<dumbot-boubble/>"
        availableNodes={availableNodes}
        onNodeSettingsClick={(nodeDt: ExtendedNode) => {
          node = {
            ...nodeDt,
          };
          console.log("settings for", node);
        }}
        onHistoryChange={(chart) => {
          console.log("updated chart is", chart);
        }}
        onLoad={onLoad}
      />
    </>
  );
};

export default App;

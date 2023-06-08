import { ExtendedNode, IChart } from "../definitions";
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

  const onLoad = (actionsIn: IChartActions) => {
    actions = actionsIn;
    console.debug("actions are", actions);
  };
  return (
    <Diagram
      initialChart={props.initState}
      availableNodes={availableNodes}
      onNodeSettingsClick={(nodeDt: ExtendedNode) => {
        node = {
          ...nodeDt,
        };
        console.debug("settings for", node);
      }}
      onHistoryChange={(chart) => {
        console.debug("updated chart is", chart);
      }}
      onLoad={onLoad}
    />
  );
};

export default App;

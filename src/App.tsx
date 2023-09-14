import { IChart } from "../definitions";
import Diagram from "./diagram/Diagram";
import { IChartActions } from "./store/chartStore";
import { availableNodes } from "../testNodes";

export const getInitialSchema = () => {
  const str = localStorage.getItem("TESTDMBT");
  return JSON.parse(str as any);
};
const App = (props: { initState: IChart }) => {
  let actions: IChartActions;
  const onLoad = (actionsIn: IChartActions) => {
    actions = actionsIn;
    console.debug("actions are", actions);
  };
  return (
    <Diagram
      initialChart={props.initState}
      availableNodes={availableNodes}
      onHistoryChange={(chart) => {
        console.debug("updated chart is", chart);
      }}
      onLoad={onLoad}
    />
  );
};

export default App;

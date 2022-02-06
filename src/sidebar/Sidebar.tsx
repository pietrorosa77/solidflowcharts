import { Component, For } from "solid-js";
import { ExtendedNode } from "../../definitions";
import { Button } from "../components/Button";
import { useChartStore } from "../store/chartStore";
import styles from "./Sidebar.module.css";

export interface ISidebarNode {
  id: string;
  title: string;
  icon: string;
  getNode: () => ExtendedNode;
}

const Sidebar: Component<{
  nodes: ISidebarNode[];
  // eslint-disable-next-line
}> = ({ nodes }) => {
  const [state, actions] = useChartStore();
  return (
    <div
      class={styles.sidenav}
      classList={{
        [`${styles.sidenavOpened}`]: state.sidebar,
        [`${styles.sidenavClosed}`]: !state.sidebar,
      }}
    >
      <a
        href="javascript:void(0)"
        class={styles.closebtn}
        onclick={actions.onToggleSidebar}
      >
        &times;
      </a>
      <div class={styles.nodesContainer}>
        <For each={nodes}>
          {(node) => {
            return (
              <Button class={styles.sidenavButton}>
                {node.icon}
                {node.title}
              </Button>
            );
          }}
        </For>
      </div>
    </div>
  );
};

export default Sidebar;

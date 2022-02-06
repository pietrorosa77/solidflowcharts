import { Component, For } from "solid-js";
import { ExtendedNode } from "../../definitions";
import { Button } from "../components/Button";
import { useChartStore } from "../store/chartStore";
import styles from "./Sidebar.module.css";

export interface ISidebarNode {
  id: string;
  title: string;
  icon: any;
  getNode: () => ExtendedNode;
}

const onDragStart = (e: DragEvent, node: ISidebarNode) => {
  const nd = node.getNode();
  (e.currentTarget as HTMLElement).classList.add(styles.btnDragging);
  e.dataTransfer?.setData("DIAGRAM-BLOCK", JSON.stringify(nd));
};

const onDragEnd = (e: DragEvent) => {
  (e.currentTarget as HTMLElement).classList.remove(styles.btnDragging);
};

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
      <div class={styles.sidenavHead}>
        <a
          href="javascript:void(0)"
          class={styles.closebtn}
          onclick={actions.onToggleSidebar}
        >
          &times;
        </a>
      </div>
      <div class={styles.nodesContainer}>
        <For each={nodes}>
          {(node) => {
            return (
              <Button
                class={styles.sidenavButton}
                draggable={true}
                onDragStart={(e: DragEvent) => onDragStart(e, node)}
                onDragEnd={onDragEnd}
              >
                <div class={styles.btnContent}>
                  {node.icon}
                  {node.title}
                </div>
              </Button>
            );
          }}
        </For>
      </div>
    </div>
  );
};

export default Sidebar;

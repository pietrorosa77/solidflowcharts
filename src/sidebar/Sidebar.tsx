import { Component, For } from "solid-js";
import { ExtendedNode } from "../../definitions";
import { Button } from "../components/Button";
import { getIcon } from "../components/tools";
import { useChartStore } from "../store/chartStore";
import styles from "./Sidebar.module.css";

export interface ISidebarNode {
  id: string;
  title: string;
  icon: string;
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
}> = (props) => {
  const [state, actions] = useChartStore();
  const onSidebarCloseClick = (evt: Event) => {
    evt.preventDefault();
    evt.stopPropagation();
    actions.onToggleSidebar();
    return false;
  }
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
          href=""
          class={styles.closebtn}
          onClick={onSidebarCloseClick}
        >
          &times;
        </a>
      </div>
      <div class={styles.nodesContainer}>
        <For each={props.nodes}>
          {(node) => {
            return (
              <Button
                classList={{
                  [`${styles.sidenavButton}`]: true,
                }}
                draggable={true}
                onDragStart={(e: DragEvent) => onDragStart(e, node)}
                onDragEnd={onDragEnd}
              >
                <div class={styles.btnContent}>
                  {getIcon(node.icon)}
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

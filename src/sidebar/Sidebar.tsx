import { Component } from "solid-js";
import { onMount, onCleanup } from "solid-js";
import { ExtendedNode } from "../../definitions";
import styles from "./Sidebar.module.css";
import { useChartStore } from "../store/chartStore";

export interface ISidebarNode {
  id: string;
  title: string;
  icon: string;
  getNode: () => ExtendedNode;
}

const Sidebar: Component<{
  id: string;
  nodes: ISidebarNode[];
  onClose?: () => void;
}> = ({ id, nodes, onClose }) => {
  const [state, actions] = useChartStore();
  return <></>;
};

export default Sidebar;

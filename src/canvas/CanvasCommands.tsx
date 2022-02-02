import { Component, JSX, onMount } from "solid-js";
import { Button } from "../components/Button";
import { AiFillEye } from "solid-icons/ai";
import { BiSolidHelpCircle } from "solid-icons/bi";
import { FaSolidExpandArrowsAlt } from "solid-icons/fa";
import { AiOutlineSelect } from "solid-icons/ai";
import { IoAppsSharp } from "solid-icons/io";
import { ImRedo, ImUndo } from "solid-icons/im";
import { FaSolidTrash } from "solid-icons/fa";

import styles from "./Canvas.module.css";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../components/Modal";
import { getCssVariables } from "../defaultTheme";
import { useChartStore } from "../store/chartStore";

const CanvasCommands: Component<{
  onResetAll: () => void;
  onEnableSelection: () => void;
  onEnablePanZoom: () => void;
  onDiagramDashboardToggle?: () => void;
}> = ({
  onResetAll,
  onEnableSelection,
  onEnablePanZoom,
  onDiagramDashboardToggle,
}) => {
  const [state, actions] = useChartStore();

  onMount(() => {});
  const cssVariables: JSX.CSSProperties = {
    ...getCssVariables(),
  };

  const deleteEnabled = () => {
    return (
      Object.keys(state.chart.selected).filter((k) => state.chart.selected[k])
        .length > 0
    );
  };
  const onTrashNodes = () => {
    const ids = Object.keys(state.chart.selected)
      .filter((k) => state.chart.selected[k])
      .map((k) => k);
    actions.onDeleteNodes(ids);
  };

  const onUndo = () => {
    if (actions.canUndo()) {
      actions.onUndo();
    }
  };

  const onRedo = () => {
    if (actions.canRedo()) {
      actions.onRedo();
    }
  };
  return (
    <>
      <div class={styles.CanvasCommands}>
        {onDiagramDashboardToggle && (
          <Button
            variant="icon"
            class={styles.CanvasCommand}
            onClick={onDiagramDashboardToggle}
          >
            <IoAppsSharp size={30} />
          </Button>
        )}
        <Button
          variant="icon"
          class={styles.CanvasCommand}
          classList={{
            [`${styles.CanvasCommandsDisabled}`]: state.selection,
            [`${styles.CanvasCommandsEnabled}`]: !state.selection,
          }}
          onClick={onEnablePanZoom}
        >
          <FaSolidExpandArrowsAlt size={30} />
        </Button>
        <Button
          variant="icon"
          class={styles.CanvasCommand}
          classList={{
            [`${styles.CanvasCommandsDisabled}`]: !state.selection,
            [`${styles.CanvasCommandsEnabled}`]: state.selection,
          }}
          onClick={onEnableSelection}
        >
          <AiOutlineSelect size={30} />
        </Button>
        <Button
          variant="icon"
          class={styles.CanvasCommand}
          onClick={onResetAll}
        >
          <AiFillEye size={30} />
        </Button>
        <Button
          variant="icon"
          class={styles.CanvasCommand}
          classList={{
            [`${styles.CanvasCommandsDisabled}`]: !actions.canUndo(),
          }}
          onClick={onUndo}
        >
          <ImUndo size={30} />
        </Button>
        <Button
          variant="icon"
          class={styles.CanvasCommand}
          classList={{
            [`${styles.CanvasCommandsDisabled}`]: !actions.canRedo(),
          }}
          onClick={onRedo}
        >
          <ImRedo size={30} />
        </Button>
        <Button
          variant="icon"
          class={styles.CanvasCommand}
          classList={{
            [`${styles.CanvasCommandsDisabled}`]: !deleteEnabled(),
          }}
          onClick={onTrashNodes}
        >
          <FaSolidTrash size={30} />
        </Button>
        <Modal closeOnClickOutside closeOnEsc style={cssVariables}>
          {({ open, toggle }) => (
            <>
              <Button
                aria-disabled={open()}
                variant="icon"
                class={styles.CanvasCommand}
                onClick={toggle}
              >
                <BiSolidHelpCircle size={30} />
              </Button>
              <ModalContent>
                <ModalHeader>
                  Canvas Commands Help
                  <Button
                    variant="icon"
                    onclick={toggle}
                    style={{ float: "right" }}
                  >
                    ✕
                  </Button>
                </ModalHeader>
                <ModalBody>
                  <ul>
                    {onDiagramDashboardToggle && (
                      <li>
                        <IoAppsSharp size={30} style={{ display: "inline" }} />
                        <strong> Node Library:</strong>
                        {` Collapse/expande node library sidebar`}
                      </li>
                    )}
                    <li>
                      <FaSolidExpandArrowsAlt
                        size={30}
                        style={{ display: "inline" }}
                      />
                      <strong> Pan and zoom mode:</strong>
                      {` Drag canvas with mouse or arrow keys. Zoom using mouse wheel or + - keys`}
                    </li>
                    <li>
                      <AiFillEye size={30} style={{ display: "inline" }} />
                      <strong> Reset canvas:</strong>
                      {` Restore zoom and canvas position`}
                    </li>
                    <li>
                      <AiOutlineSelect
                        size={30}
                        style={{ display: "inline" }}
                      />
                      <strong> Selection mode:</strong>
                      {` Left click and mouse move for multi node selection`}
                    </li>
                    <li>
                      <FaSolidTrash size={30} style={{ display: "inline" }} />
                      <strong> Delete nodes:</strong>
                      {` Delete selected nodes`}
                    </li>
                  </ul>
                </ModalBody>
                <ModalFooter>
                  <Button onclick={toggle}>OK</Button>
                </ModalFooter>
              </ModalContent>
            </>
          )}
        </Modal>
      </div>
    </>
  );
};

export default CanvasCommands;

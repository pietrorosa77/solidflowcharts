import { Component, onMount } from "solid-js";
import { Button } from "../components/Button";
import { AiFillEye } from "solid-icons/ai";
import { BiSolidHelpCircle } from "solid-icons/bi";
import { FaSolidArrowsUpDownLeftRight } from "solid-icons/fa";
import { AiOutlineSelect } from "solid-icons/ai";
import { IoAppsSharp } from "solid-icons/io";
import { ImRedo, ImUndo } from "solid-icons/im";
import { FaSolidTrash, FaSolidBezierCurve } from "solid-icons/fa";

import styles from "./Canvas.module.css";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../components/Modal";

import { useChartStore } from "../store/chartStore";

const CanvasCommands: Component<{
  onResetAll: () => void;
  onEnableSelection: () => void;
  onEnablePanZoom: () => void;
}> = (props) => {
  const [state, actions] = useChartStore();

  onMount(() => {});

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

  const onUseBezierPathClick = () => {
    const isUsingBezier = !!state.chart.properties?.useBezierPath;
    actions.onUpdateChartProps({ useBezierPath: !isUsingBezier });
  };

  const onUndo = () => {
    if (state.canUndo) {
      actions.onUndo();
    }
  };

  const onRedo = () => {
    if (state.canRedo) {
      actions.onRedo();
    }
  };

  const onEnablePanZoom = () => {
    props.onEnablePanZoom();
  };

  const onEnableSelection = () => {
    props.onEnableSelection();
  };

  const onResetAll = () => {
    props.onResetAll();
  };
  return (
    <>
      <div class={styles.CanvasCommands}>
        <Button
          variant="icon"
          classList={{
            [`${styles.CanvasCommand}`]: true,
            [`${styles.CanvasCommandsDisabled}`]: !state.sidebar,
            [`${styles.CanvasCommandsEnabled}`]: state.sidebar,
          }}
          onClick={actions.onToggleSidebar}
        >
          <IoAppsSharp size={30} />
        </Button>
        <Button
          variant="icon"
          classList={{
            [`${styles.CanvasCommand}`]: true,
            [`${styles.CanvasCommandsDisabled}`]: state.selection,
            [`${styles.CanvasCommandsEnabled}`]: !state.selection,
          }}
          onClick={onEnablePanZoom}
        >
          <FaSolidArrowsUpDownLeftRight size={30} />
        </Button>
        <Button
          variant="icon"
          classList={{
            [`${styles.CanvasCommand}`]: true,
            [`${styles.CanvasCommandsDisabled}`]: !state.selection,
            [`${styles.CanvasCommandsEnabled}`]: state.selection,
          }}
          onClick={onEnableSelection}
        >
          <AiOutlineSelect size={30} />
        </Button>
        <Button
          variant="icon"
          classList={{
            [`${styles.CanvasCommand}`]: true,
          }}
          onClick={onResetAll}
        >
          <AiFillEye size={30} />
        </Button>
        <Button
          variant="icon"
          classList={{
            [`${styles.CanvasCommand}`]: true,
            [`${styles.CanvasCommandsDisabled}`]:
              !state.chart.properties?.useBezierPath,
            [`${styles.CanvasCommandsEnabled}`]:
              !!state.chart.properties?.useBezierPath,
          }}
          onClick={onUseBezierPathClick}
        >
          <FaSolidBezierCurve size={30} />
        </Button>
        <Button
          variant="icon"
          classList={{
            [`${styles.CanvasCommand}`]: true,
            [`${styles.CanvasCommandsDisabled}`]: !state.canUndo,
          }}
          onClick={onUndo}
        >
          <ImUndo size={30} />
        </Button>
        <Button
          variant="icon"
          classList={{
            [`${styles.CanvasCommand}`]: true,
            [`${styles.CanvasCommandsDisabled}`]: !state.canRedo,
          }}
          onClick={onRedo}
        >
          <ImRedo size={30} />
        </Button>
        <Button
          variant="icon"
          classList={{
            [`${styles.CanvasCommand}`]: true,
            [`${styles.CanvasCommandsDisabled}`]: !deleteEnabled(),
          }}
          onClick={onTrashNodes}
        >
          <FaSolidTrash size={30} />
        </Button>
        <Modal
          closeOnClickOutside
          closeOnEsc
          classList={{ [`${styles.CanvasModal}`]: true }}
        >
          {(modalProps: any) => (
            <>
              <Button
                aria-disabled={modalProps.open()}
                variant="icon"
                classList={{
                  [`${styles.CanvasCommand}`]: true,
                }}
                onClick={modalProps.toggle}
              >
                <BiSolidHelpCircle size={30} />
              </Button>
              <ModalContent>
                <ModalHeader>
                  Canvas Commands Help
                  <Button
                    variant="icon"
                    onclick={modalProps.toggle}
                    style={{ float: "right" }}
                  >
                    ✕
                  </Button>
                </ModalHeader>
                <ModalBody>
                  <ul
                    classList={{
                      [`${styles.ModalHelp}`]: true,
                    }}
                  >
                    <li>
                      <IoAppsSharp size={30} style={{ display: "inline" }} />
                      <strong> Node Library:</strong>
                      {` Collapse/expande node library sidebar`}
                    </li>
                    <li>
                      <FaSolidArrowsUpDownLeftRight
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
                    <li>
                      <FaSolidBezierCurve
                        size={30}
                        style={{ display: "inline" }}
                      />
                      <strong> Bezier/SmoothStep connections:</strong>
                      {` Use Bezier or Smooth Step connection line (Smooth Step is default)`}
                    </li>
                  </ul>
                </ModalBody>
                <ModalFooter>
                  <Button onclick={modalProps.toggle}>OK</Button>
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

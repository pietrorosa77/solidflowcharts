import { Component, Show, createEffect, onCleanup } from "solid-js";
import { Button } from "../components/Button";
import {
  JSONEditor,
} from "vanilla-jsoneditor";
import styles from "./EditorNodeSettings.module.css";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../components/Modal";

import { useChartStore } from "../store/chartStore";

import { ISidebarNode } from "../sidebar/Sidebar";
import { ExtendedNode } from "../../definitions";
import { getNodeToEdit, updateNodeSettings } from "../store/utils";

const contentStyle = { width: "100%", cursor: "unset", outline: "none" };
const EditorNodeSettings: Component<{
  nodes: ISidebarNode[];
  onSettingsChanged: (oldNode: ExtendedNode, newNode: ExtendedNode) => void;
}> = (props) => {
  let editor: JSONEditor;
  const [state, actions] = useChartStore();
  const destroyEditor = () => {
    if (editor) {
      editor.destroy().then((value) => {
        console.log("json editor destroyed", value);
      });
      editor = undefined as any;
    }
  };

  createEffect(() => {
    if (state.editNodeSettings && !editor) {
      const node: ExtendedNode = state.chart.nodes[state.editNodeSettings];
      const target = (window as any).DMBRoot.getElementById(
        `${state.editNodeSettings}_editing_settings`,
      );
      target.style.height = '100%';
      const toEdit = getNodeToEdit(node);

      const content: any = {
        text: undefined,
        json: {
          ...toEdit,
        },
      };

      editor = new JSONEditor({
        target,
        props: {
          content,
        },
      });
    }
  });

  onCleanup(() => {
    destroyEditor();
  });

  const onConfirm = async () => {
    const oldNode = state.chart.nodes[state.editNodeSettings as string];
    const updatedNode: ExtendedNode = updateNodeSettings(oldNode, editor);
    actions.onToggleEditNodeSettings(undefined);
    actions.onNodeChanged(updatedNode.id, updatedNode);
    props.onSettingsChanged(oldNode, updatedNode);
    destroyEditor();
  };

  const onClose = () => {
    actions.onToggleEditNodeSettings(undefined);
    destroyEditor();
  };

  return (
    <Show when={!!state.editNodeSettings}>
      <Modal
        open={true}
        closeOnEsc={false}
        onClose={onClose}
        width="100vw"
        classList={{
          [`${styles.EditorNodeSettingsModal}`]: true,
        }}
      >
        {(modalProps: any) => (
          <ModalContent>
            <ModalHeader>
              Edit node settings
              <Button
                variant="icon"
                onclick={modalProps.toggle}
                style={{ float: "right" }}
              >
                ✕
              </Button>
            </ModalHeader>
            <ModalBody>
              <div
                class="node-settings-editor"
                id={`${state.editNodeSettings}_editing_settings`}
                style={contentStyle}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onclick={modalProps.toggle}>
                Cancel
              </Button>
              <Button variant="primary" onclick={onConfirm}>
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    </Show>
  );
};

export default EditorNodeSettings;

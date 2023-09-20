import { Component, Show, createEffect, onCleanup, createSignal } from "solid-js";
import { Button } from "../components/Button";
//@ts-ignore
import { JSONEditor } from '@json-editor/json-editor/dist/jsoneditor.js';
import styles from "./EditorNodeSettings.module.css";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../components/Modal";

import { useChartStore } from "../store/chartStore";
import "bootstrap/dist/css/bootstrap.css";
import { ISidebarNode } from "../sidebar/Sidebar";
import { ExtendedNode, IPort } from "../../definitions";

JSONEditor.defaults.options.iconlib = "bootstrap";
const contentStyle = { width: "100%", cursor: "unset", outline: "none" };
const EditorNodeSettings: Component<{ nodes: ISidebarNode[]; }> = (props) => {
  let editor: any;
  const [state, actions] = useChartStore();
  const [_ready, setReady] = createSignal(false);
  const destroyEditor = () => {
    if (editor) {
      editor.destroy();
      editor = undefined as any;
    }
  };

  createEffect(() => {
    if (state.editNodeSettings && !editor) {
      const node: ExtendedNode =state.chart.nodes[state.editNodeSettings];
      const holder = (window as any).DMBRoot.getElementById(`${state.editNodeSettings}_editing_settings`);
      const sidebarNode = props.nodes.find(n => n.type === node.type);

      editor = new JSONEditor(holder, {
        schema: sidebarNode ? sidebarNode.schema : null,
        disable_collapse: false,
        disable_edit_json: false,
        disable_properties: true,
        no_additional_properties: true,
        remove_empty_properties: false,
        remove_button_labels: false,
        theme: 'bootstrap5',
        object_layout: 'normal',
      });
      
      editor.on('ready', () => {
        // Now the api methods will be available
        editor.setValue({
          ...node,
          ports: getPortsArray(node.ports)
        });
        setReady(true)
      });
    }
  });

  onCleanup(() => {
    destroyEditor();
  });

  const geteditedPorts = (portsArray: IPort[]) => {
    return portsArray.reduce((acc, curr, index) => {
      return {
        ...acc,
        [`${curr.id}`]: {
          ...curr,
          index: index + 1
        }
      }
    }, {})
  }

  const getPortsArray = (
    portDictionary: { [key: string]: IPort }
  ): IPort[] =>
    Object.keys(portDictionary)
      .map((key) => ({
        ...portDictionary[key],
        id: key
      }));

  const onConfirm = async () => {
    const value = editor.getValue();
    const oldNode = state.chart.nodes[state.editNodeSettings as string];
    const updatedNode: ExtendedNode = {
      ...oldNode,
      output: value.output,
      properties: value.properties || { displayAs: 'message' },
      ports: value.ports && value.ports.length ? geteditedPorts(value.ports) : oldNode.ports 

    };
    actions.onToggleEditNodeSettings(undefined);
   
    actions.onNodeChanged(updatedNode.id, updatedNode);
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

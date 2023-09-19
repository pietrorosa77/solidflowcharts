import { Component, Show, createEffect, onCleanup, createSignal } from "solid-js";
import EditorJS from "@editorjs/editorjs";
import { Button } from "../components/Button";

import styles from "./EditorHtml.module.css";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "../components/Modal";

import { useChartStore } from "../store/chartStore";
import { onReady, tools } from "./EditorJsExtensions";
import { getVariables } from "../store/utils";
const contentStyle = { width: "100%", cursor: "unset", outline: "none" };
const EditorHtml: Component = () => {
  let editor: EditorJS;
  const [state, actions] = useChartStore();
  const [ready, setReady] = createSignal(false);
  const [title, setTitle] = createSignal('');
  const destroyEditor = () => {
    if (editor) {
      editor.destroy();
      editor = undefined as any;
    }
  };
  createEffect(() => {
    if (state.editNodeContent && !editor) {
      editor = new EditorJS({
        placeholder: "Please, add some content to this node!!",
        holder: `${state.editNodeContent}_editing`,
        tools,
        onReady: () => {
          if(state.editNodeContent) {
            setTitle(state.chart.nodes[state.editNodeContent].title);
            onReady(`${state.editNodeContent}_editing`, getVariables(state.chart));
          }

          setReady(true)
        },
        data: state.chart.nodes[state.editNodeContent].content,
      });
    }
  });

  onCleanup(() => {
    destroyEditor();
  });

  const onConfirm = async () => {
    if(!title()) {
      return;
    }
    const data = await editor?.save();
    const updatedNode = {
      ...state.chart.nodes[state.editNodeContent as string],
      content: data,
      title: title()
    };
    destroyEditor();
    actions.onToggleEditNodeContent(undefined);
    actions.onNodeChanged(updatedNode.id, updatedNode);
  };

  const onClose = () => {
    destroyEditor();
    actions.onToggleEditNodeContent(undefined);
  };

  return (
    <Show when={!!state.editNodeContent}>
      <Modal
        open={true}
        closeOnEsc={false}
        onClose={onClose}
        width="500px"
        classList={{
          [`${styles.EditorHtmlModal}`]: true,
          "flowchart-node-content": true,
        }}
      >
        {(modalProps: any) => (
          <ModalContent>
            <ModalHeader>
             {ready() ? <input classList={ {
              [`${styles.invalidTitle}`]: !title(),
              [`${styles.titleEdit}`]: true
             }} type="text" value={title()} onChange={(e) => setTitle(e.target.value)}/> : `Initializing node content editor....`}
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
                class="node-content-editor"
                id={`${state.editNodeContent}_editing`}
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

export default EditorHtml;

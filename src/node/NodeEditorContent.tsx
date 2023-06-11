import { createEffect, onCleanup, onMount } from "solid-js";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import "./NodeEditorContent.css";
import { onReady, tools } from "../components/EditorJsExtensions";

const contentStyle = { width: "100%", cursor: "unset" };
export const NodeEditorContent = (props: {
  content: OutputData;
  id: string;
}) => {
  let editor: EditorJS;
  onMount(() => {
    editor = new EditorJS({
      placeholder: "Please, add some content to this node!!",
      holder: props.id,
      readOnly: true,
      tools,
      onReady
    });
  });

  onCleanup(() => {
    console.log("cleaning the mess");
    if (editor && editor.destroy) {
      editor.destroy();
    }
  });

  // eslint-disable-next-line
  createEffect(async () => {
    if (editor && Object.keys(props.content).length > 0) {
      await editor.isReady;
      editor.render(props.content);
    }
  });

  return (
    <div
      id={props.id}
      class="node-content-editor-readonly"
      style={contentStyle}
    />
  );
};

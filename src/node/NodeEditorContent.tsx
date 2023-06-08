import { onMount } from "solid-js";
import EditorJS from "@editorjs/editorjs";
import "./NodeEditorContent.css";

const contentStyle = { width: "100%", cursor: "unset" };
export const NodeEditorContent = (props: {
  content: any;
  id: string;
  editorTools: any;
}) => {
  let contentRef: HTMLDivElement | undefined;
  onMount(() => {
    if (!contentRef) {
      return;
    }
    new EditorJS({
      placeholder: "Please, add some content to this node!!",
      holder: props.id,
      readOnly: true,
      tools: props.editorTools,
      data: props.content,
      //   onReady: () => {
      //     debugger
      //  }
    });
  });

  return <div id={props.id} ref={contentRef} style={contentStyle} />;
};

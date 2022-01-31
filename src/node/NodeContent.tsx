import { createEffect } from "solid-js";
import { createTiptapEditor } from "solid-tiptap";
import StarterKit from "@tiptap/starter-kit";
import { Editor } from "@tiptap/core";
import Image from "@tiptap/extension-image";

export const NodeContentReadonly = (props: { content: any }) => {
  let ref!: HTMLDivElement;
  let editor = createTiptapEditor({
    autofocus: false,
    editable: false,
    get element() {
      return ref;
    },
    get extensions() {
      return [
        StarterKit,
        Image.configure({
          HTMLAttributes: {
            class: "dumbot-image-class",
          },
        }),
      ];
    },
    content: props.content,
  });

  createEffect(() => {
    if (!editor || !editor()) {
      return;
    }
    (editor() as Editor).commands.setContent(props.content);
  });

  return (
    <div style={{ width: "100%", cursor: "unset" }}>
      <div ref={ref} />
    </div>
  );
};

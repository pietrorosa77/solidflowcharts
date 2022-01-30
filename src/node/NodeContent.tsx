import { createEffect, JSX, Show } from "solid-js";
import {
  createEditorTransaction,
  createTiptapEditor,
  useEditorJSON,
} from "solid-tiptap";
import StarterKit from "@tiptap/starter-kit";
import { Editor } from "@tiptap/core";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import Image from "@tiptap/extension-image";
import { Toggle, Toolbar } from "solid-headless";
import { nanoid } from "nanoid";
import { BsImage } from "solid-icons/bs";
import { useChartStore } from "../store/chartStore";

function ParagraphIcon(props: JSX.IntrinsicElements["svg"]): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      stroke="none"
      {...props}
    >
      <path d="M9 16h2v4h2V6h2v14h2V6h3V4H9c-3.309 0-6 2.691-6 6s2.691 6 6 6zM9 6h2v8H9c-2.206 0-4-1.794-4-4s1.794-4 4-4z" />
    </svg>
  );
}

function CodeIcon(props: JSX.IntrinsicElements["svg"]): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      stroke="none"
      {...props}
    >
      <path d="M8.293 6.293 2.586 12l5.707 5.707 1.414-1.414L5.414 12l4.293-4.293zm7.414 11.414L21.414 12l-5.707-5.707-1.414 1.414L18.586 12l-4.293 4.293z" />
    </svg>
  );
}

function CodeBlockIcon(props: JSX.IntrinsicElements["svg"]): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      stroke="none"
      {...props}
    >
      <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V7h16l.002 12H4z" />
      <path d="M9.293 9.293 5.586 13l3.707 3.707 1.414-1.414L8.414 13l2.293-2.293zm5.414 0-1.414 1.414L15.586 13l-2.293 2.293 1.414 1.414L18.414 13z" />
    </svg>
  );
}

function OrderedListIcon(props: JSX.IntrinsicElements["svg"]): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      stroke="none"
      {...props}
    >
      <path
        fill-rule="evenodd"
        d="M2.003 2.5a.5.5 0 00-.723-.447l-1.003.5a.5.5 0 00.446.895l.28-.14V6H.5a.5.5 0 000 1h2.006a.5.5 0 100-1h-.503V2.5zM5 3.25a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 3.25zm0 5a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 8.25zm0 5a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75zM.924 10.32l.003-.004a.851.851 0 01.144-.153A.66.66 0 011.5 10c.195 0 .306.068.374.146a.57.57 0 01.128.376c0 .453-.269.682-.8 1.078l-.035.025C.692 11.98 0 12.495 0 13.5a.5.5 0 00.5.5h2.003a.5.5 0 000-1H1.146c.132-.197.351-.372.654-.597l.047-.035c.47-.35 1.156-.858 1.156-1.845 0-.365-.118-.744-.377-1.038-.268-.303-.658-.484-1.126-.484-.48 0-.84.202-1.068.392a1.858 1.858 0 00-.348.384l-.007.011-.002.004-.001.002-.001.001a.5.5 0 00.851.525zM.5 10.055l-.427-.26.427.26z"
      />
    </svg>
  );
}

function BulletListIcon(props: JSX.IntrinsicElements["svg"]): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      stroke="none"
      {...props}
    >
      <path
        fill-rule="evenodd"
        d="M2 4a1 1 0 100-2 1 1 0 000 2zm3.75-1.5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zM3 8a1 1 0 11-2 0 1 1 0 012 0zm-1 6a1 1 0 100-2 1 1 0 000 2z"
      />
    </svg>
  );
}

function BlockquoteIcon(props: JSX.IntrinsicElements["svg"]): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      {...props}
    >
      <path d="M20.309 17.708C22.196 15.66 22.006 13.03 22 13V5a1 1 0 0 0-1-1h-6c-1.103 0-2 .897-2 2v7a1 1 0 0 0 1 1h3.078a2.89 2.89 0 0 1-.429 1.396c-.508.801-1.465 1.348-2.846 1.624l-.803.16V20h1c2.783 0 4.906-.771 6.309-2.292zm-11.007 0C11.19 15.66 10.999 13.03 10.993 13V5a1 1 0 0 0-1-1h-6c-1.103 0-2 .897-2 2v7a1 1 0 0 0 1 1h3.078a2.89 2.89 0 0 1-.429 1.396c-.508.801-1.465 1.348-2.846 1.624l-.803.16V20h1c2.783 0 4.906-.771 6.309-2.292z" />
    </svg>
  );
}

function Separator() {
  return (
    <div class="flex items-center" aria-hidden="true">
      <div class="h-full border-l border-gray-300" />
    </div>
  );
}

interface ControlProps {
  class: string;
  editor: Editor;
  title: string;
  key: string;
  onChange: () => void;
  isActive?: (editor: Editor) => boolean;
  children: JSX.Element;
}

function Control(props: ControlProps): JSX.Element {
  const flag = createEditorTransaction(
    () => props.editor,
    (instance) => {
      if (props.isActive) {
        return props.isActive(instance);
      }
      return instance.isActive(props.key);
    }
  );

  return (
    <Toggle
      class={`${props.class} w-6 h-6 flex items-center justify-center rounded focus:outline-none focus-visible:ring focus-visible:ring-purple-400 focus-visible:ring-opacity-75`}
      classList={{
        "text-color-600 bg-white bg-opacity-25": flag(),
      }}
      title={props.title}
      onChange={props.onChange}
    >
      {props.children}
    </Toggle>
  );
}

interface ToolbarProps {
  editor: Editor;
}

function ToolbarContents(props: ToolbarProps): JSX.Element {
  return (
    <div class="p-2 flex space-x-1">
      <div class="flex space-x-1">
        <Control
          key="paragraph"
          class="font-bold"
          editor={props.editor}
          onChange={() => props.editor.chain().focus().setParagraph().run()}
          title="Paragraph"
        >
          <ParagraphIcon class="w-full h-full m-1" />
        </Control>
        <Control
          key="heading-1"
          class="font-bold"
          editor={props.editor}
          onChange={() =>
            props.editor.chain().focus().setHeading({ level: 1 }).run()
          }
          isActive={(editor) => editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          H1
        </Control>
        <Control
          key="heading-2"
          class="font-bold"
          editor={props.editor}
          onChange={() =>
            props.editor.chain().focus().setHeading({ level: 2 }).run()
          }
          isActive={(editor) => editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </Control>
      </div>
      <Separator />
      <div class="flex space-x-1">
        <Control
          key="bold"
          class="font-bold"
          editor={props.editor}
          onChange={() => props.editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          B
        </Control>
        <Control
          key="italic"
          class="italic"
          editor={props.editor}
          onChange={() => props.editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          I
        </Control>
        <Control
          key="strike"
          class="line-through"
          editor={props.editor}
          onChange={() => props.editor.chain().focus().toggleStrike().run()}
          title="Strike Through"
        >
          S
        </Control>
        <Control
          key="code"
          class=""
          editor={props.editor}
          onChange={() => props.editor.chain().focus().toggleCode().run()}
          title="Code"
        >
          <CodeIcon class="w-full h-full m-1" />
        </Control>
      </div>
      <Separator />
      <div class="flex space-x-1">
        <Control
          key="bulletList"
          class=""
          editor={props.editor}
          onChange={() => props.editor.chain().focus().toggleBulletList().run()}
          title="Bullet List"
        >
          <BulletListIcon class="w-full h-full m-1" />
        </Control>
        <Control
          key="orderedList"
          class=""
          editor={props.editor}
          onChange={() =>
            props.editor.chain().focus().toggleOrderedList().run()
          }
          title="Ordered List"
        >
          <OrderedListIcon class="w-full h-full m-1" />
        </Control>
        <Control
          key="blockquote"
          class=""
          editor={props.editor}
          onChange={() => props.editor.chain().focus().toggleBlockquote().run()}
          title="Blockquote"
        >
          <BlockquoteIcon class="w-full h-full m-1" />
        </Control>
        <Control
          key="codeBlock"
          class=""
          editor={props.editor}
          onChange={() => props.editor.chain().focus().toggleCodeBlock().run()}
          title="Code Block"
        >
          <CodeBlockIcon class="w-full h-full m-1" />
        </Control>
        <Control
          key="hrrule"
          class=""
          editor={props.editor}
          onChange={() =>
            props.editor.chain().focus().setHorizontalRule().run()
          }
          title="Divider"
        >
          ..
        </Control>
        <Control
          key="image"
          class=""
          editor={props.editor}
          onChange={() => {
            const url = window.prompt("URL");

            if (url) {
              props.editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          title="Image"
        >
          <BsImage class="w-full h-full m-1" size={12} />
        </Control>
      </div>
    </div>
  );
}

export const NodeContent = (props: {
  content: any;
  contentChanged: (content: any) => void;
}) => {
  let ref!: HTMLDivElement;
  let menuRef!: HTMLDivElement;
  console.log("RENDERING NODEEEE CONTENTTTT");
  const editorId = nanoid();
  const editor = createTiptapEditor({
    autofocus: false,
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
        BubbleMenu.configure({
          element: menuRef,
          tippyOptions: {
            maxWidth: 600,
          },
        }),
      ];
    },
    content: props.content,
  });

  const json = useEditorJSON(() => editor());

  createEffect(() => {
    const data = json();

    if (data) {
      console.log("data is", data);
      //props.contentChanged(data);
      console.log("content is", props.content);
    }
  });

  const onPointerDown = (e: PointerEvent) => {
    (e as any)["diagramDetails"] = "editnodecontent";
  };
  return (
    <div
      style={{ width: "100%", cursor: "unset" }}
      onPointerDown={onPointerDown}
    >
      <Toolbar
        ref={menuRef}
        class="dynamic-shadow bg-gradient-to-bl from-purple-500 to-violet-600 text-white rounded-lg"
        horizontal
        style={{ "max-width": "100%" }}
      >
        <Show when={editor()}>
          {(instance) => <ToolbarContents editor={instance} />}
        </Show>
      </Toolbar>
      <div ref={ref} id={editorId} />
      {/* <Show when={editor()}>
          {(instance) => <EditorMenu editor={instance} />}
        </Show> */}
    </div>
  );
};

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

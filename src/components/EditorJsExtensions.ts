//@ts-nocheck
import Checklist from "@editorjs/checklist";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import List from "@editorjs/list";
import SimpleImage from "@editorjs/simple-image";
import Embed from "@editorjs/embed";
import Image from "editorjs-inline-image";
import nestedList from "@editorjs/nested-list";
import undo from "editorjs-undo";
import Table from "@editorjs/table";
import Strikethrough from "@sotaproject/strikethrough";
import CodeTool from "@editorjs/code";
import MermaidTool from "editorjs-mermaid";
import AttachesTool from "@editorjs/attaches";
import Marker from "@editorjs/marker";
import Color from "editorjs-text-color-plugin";
import Underline from "@editorjs/underline";
import InlineCode from "@editorjs/inline-code";

class AttachesExtend extends AttachesTool {
  constructor(params) {
    super(params);
  }

  showFileData() {
    super.showFileData();
    const downloadLink: HTMLAnchorElement = this.nodes.wrapper.querySelector(
      `.${this.CSS.downloadButton}`
    );
    downloadLink.download = this.data.title;
    downloadLink.addEventListener("pointerdown", (e) => {
      (e as any)["diagramDetails"] = "prevent node drag";
    });
  }
}

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const tools: any = {
  Header,
  SimpleImage,
  undo,
  Marker,
  Color,
  Underline,
  InlineCode,
  Mention,
  Image: {
    class: Image,
    inlineToolbar: true,
    config: {
      embed: {
        display: true,
      },
      unsplash: {
        appName: "Dumbot",
        clientId: "Cgl-gFPWhrotsJzORtqgDAIvMHMc1O7tihMNjw4OsrQ",
      },
    },
  },
  List,
  Checklist,
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        codepen: true,
      },
    },
  },
  Quote,
  nestedList,
  Strikethrough,
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
      withHeadings: true,
    },
  },
  CodeTool,
  MermaidTool,
  attaches: {
    class: AttachesExtend,
    config: {
      uploader: {
        /**
         * Upload file to the server and return an uploaded image data
         * @param {File} file - file selected from the device or pasted by drag-n-drop
         * @return {Promise.<{success, file: {url}}>}
         */
        uploadByFile: async (file: File) => {
          const url = await toBase64(file);
          const { type, name, size } = file;
          return {
            success: 1,
            file: {
              url,
              type,
              size,
              name,
              title: file.name,
            },
          };
        },
      },
    },
  },
};

export const onReady = () => {
  MermaidTool.config({ theme: "neutral" });
};

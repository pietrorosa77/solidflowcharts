import remarkemoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeVideo from "rehype-video";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import { createEffect, createSignal } from "solid-js";
import { defaultSchema } from "./allowedContenstSchema";
import rehypePrism from "@mapbox/rehype-prism";
import styles from "./Node.module.css";

export const markdownToHtml = async (md: string) => {
  const data = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkemoji)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrism)
    .use(rehypeSanitize, {
      ...defaultSchema,
      attributes: {
        ...defaultSchema.attributes,
        div: [
          ...(defaultSchema.attributes?.div || []),
          ["className", "math", "math-display"],
        ],
        span: [
          ...(defaultSchema.attributes?.span || []),
          [
            "className",
            "math",
            "math-inline",
            "token",
            "keyword",
            "module",
            "imports",
            "string",
            "tag",
            "style",
            "script",
            "attr-value",
            "attr-name",
            "italic",
            "entity",
            "punctuation",
            "bold",
            "statement",
            "important",
            "variable",
            "placeholder",
            "regex",
            "deleted",
            "atrule",
            "inserted",
            "selector",
            "url",
            "number",
            "boolean",
            "operator",
            "cdata",
            "doctype",
            "prolog",
            "comment",
            "namespace",
          ],
        ],
        pre: [
          "className",
          "language-js",
          "language-css",
          "language-md",
          "language-markup",
        ],
        code: [
          ...(defaultSchema.attributes.code || []),
          // List of all allowed languages:
          [
            "className",
            "language-js",
            "language-css",
            "language-md",
            "language-markup",
          ],
        ],
      },
    })
    .use(rehypeKatex)
    .use(rehypeVideo, { test: /\/(.*)(.mp4|.mov|webm)$/ })
    .use(rehypeStringify)
    .process(md);

  return data.value;
};

export const NodeContentReadonly = (props: {
  content: any;
  separator: string;
}) => {
  const [nodeContent, setNodeContent] = createSignal<string>();
  const getNodeContent = async (md: string) => {
    try {
      const parts = md.split(props.separator);
      const promises = parts.map((p) => markdownToHtml(p));
      const partsParsed = await Promise.all(promises);
      const nodeHtmBloksHtml = partsParsed.map(
        (p) => `<div class="${styles.NodeContentPart}">${p}</div>`
      );
      return nodeHtmBloksHtml.join("");
    } catch (error) {
      console.error(error);
      return "<strong>Error converting html</strong>";
    }
  };

  createEffect(() => {
    getNodeContent(props.content).then((newContent) => {
      setNodeContent(newContent);
    });
    // eslint-disable-next-line
  }, [props.content]);

  return (
    <div
      // eslint-disable-next-line
      innerHTML={nodeContent ? nodeContent() : "loading markdown..."}
      style={{ width: "100%", cursor: "unset" }}
    ></div>
  );
};

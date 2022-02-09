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
import { createResource } from "solid-js";
import { defaultSchema } from "./allowedContenstSchema";
import rehypeHighlight from "rehype-highlight";

export const markdownToHtml = async (md: string) => {
  const data = await unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(remarkemoji)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight, { subset: false })
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
            "className",
            "hljs-addition",
            "hljs-attr",
            "hljs-attribute",
            "hljs-built_in",
            "hljs-bullet",
            "hljs-char",
            "hljs-code",
            "hljs-comment",
            "hljs-deletion",
            "hljs-doctag",
            "hljs-emphasis",
            "hljs-formula",
            "hljs-keyword",
            "hljs-link",
            "hljs-literal",
            "hljs-meta",
            "hljs-name",
            "hljs-number",
            "hljs-operator",
            "hljs-params",
            "hljs-property",
            "hljs-punctuation",
            "hljs-quote",
            "hljs-regexp",
            "hljs-section",
            "hljs-selector-attr",
            "hljs-selector-class",
            "hljs-selector-id",
            "hljs-selector-pseudo",
            "hljs-selector-tag",
            "hljs-string",
            "hljs-strong",
            "hljs-subst",
            "hljs-symbol",
            "hljs-tag",
            "hljs-template-tag",
            "hljs-template-variable",
            "hljs-title",
            "hljs-type",
            "hljs-variable",
          ],
        ],
        code: [
          ...(defaultSchema.attributes.code || []),
          // List of all allowed languages:
          ["className", "language-js", "language-css", "language-md"],
        ],
      },
    })
    .use(rehypeKatex)
    .use(rehypeVideo, { test: /\/(.*)(.mp4|.mov|webm)$/ })
    .use(rehypeStringify)
    .process(md);

  return data.value;
};

export const NodeContentReadonly = (props: { content: any }) => {
  const getNodeContent = async (md: string) => {
    try {
      const nodeHtml = await markdownToHtml(md);
      return nodeHtml;
    } catch {
      return "<strong>Error converting html</strong>";
    }
  };

  // eslint-disable-next-line
  const [html] = createResource(props.content, getNodeContent);

  return (
    <div
      // eslint-disable-next-line
      innerHTML={html.loading ? "Loading..." : html()}
      style={{ width: "100%", cursor: "unset" }}
    ></div>
  );
};

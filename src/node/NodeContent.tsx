import { createEffect, createSignal } from "solid-js";
import styles from "./Node.module.css";

export const NodeContentReadonly = (props: {
  content: any;
  separator: string;
  getHtmlContent: (content: string) => Promise<string>;
}) => {
  const [nodeContent, setNodeContent] = createSignal<string>();
  const getNodeContent = async (md: string) => {
    try {
      const parts = md.split(props.separator);
      const promises = parts.map((p) => props.getHtmlContent(p));
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

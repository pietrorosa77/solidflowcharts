import { createSignal, onMount, Show } from "solid-js";
import styles from "./Node.module.css";

const getNodeContent = async (
  content: any,
  transpiler: (input: any) => Promise<string[]>
) => {
  try {
    const partsParsed = await transpiler(content);
    const nodeHtmBloksHtml = partsParsed.map(
      (p) =>
        `<div class="${styles.NodeContentPart}"><div class="dumbot-content-body">${p}</div></div>`
    );
    return nodeHtmBloksHtml.join("");
  } catch (error) {
    console.error(error);
    return "<strong>Error converting html</strong>";
  }
};
export const NodeContentReadonly = (props: {
  content: any;
  getHtmlContent: (content: any) => Promise<string[]>;
}) => {
  const [nodeContent, setNodeContent] = createSignal<string | undefined>(
    undefined
  );

  onMount(async () => {
    const html = await getNodeContent(props.content, props.getHtmlContent);
    setNodeContent(html);
  });

  return (
    <Show when={nodeContent()} fallback={<div>loading....</div>}>
      <div
        // eslint-disable-next-line
        innerHTML={nodeContent()} // sanitize the content is responsibility of the transpiler
        style={{ width: "100%", cursor: "unset" }}
      />
    </Show>
  );
};

import { createSignal, onMount, Show } from "solid-js";
import styles from "./Node.module.css";

const getNodeContent = async (
  md: string,
  separator: string,
  transpiler: (input: string) => Promise<string>
) => {
  try {
    const parts = md.split(separator);
    const promises = parts.map((p) => transpiler(p));
    const partsParsed = await Promise.all(promises);
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
  separator: string;
  getHtmlContent: (content: string) => Promise<string>;
}) => {
  const [nodeContent, setNodeContent] = createSignal<string | undefined>(
    undefined
  );

  onMount(async () => {
    const html = await getNodeContent(
      props.content,
      props.separator,
      props.getHtmlContent
    );
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

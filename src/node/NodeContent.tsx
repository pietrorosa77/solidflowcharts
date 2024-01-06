import { Show, createEffect, createSignal } from "solid-js";
import styles from "./Node.module.css";
import { Loader } from "../components/Loader";

export const NodeContentReadonly = (props: { content: any }) => {
  const [nodeContent, setNodeContent] = createSignal<string>();
  const getNodeContent = async (md: string) => {
    try {
      const parts = Array.isArray(md)  ? md :  md.split("***");
      // await wait();
      const nodeHtmBloksHtml = parts.map(
        (p) =>
          `<div class="${styles.NodeContentPart}"><div class="dumbot-content-body">${p}</div></div>`,
      );
      return nodeHtmBloksHtml.join("");
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  createEffect(() => {
    getNodeContent(props.content).then((newContent) => {
      setNodeContent(newContent);
    });
    // eslint-disable-next-line
  }, [props.content]);

  return (
    <>
      <Show when={nodeContent()}>
        <div
          // eslint-disable-next-line
          innerHTML={nodeContent()}
          style={{ width: "100%", cursor: "unset" }}
        />
      </Show>
      <Show when={!nodeContent()}>
        <Loader />
      </Show>
    </>
  );
};

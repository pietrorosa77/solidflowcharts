import {
  Accessor,
  Component,
  JSX,
  splitProps,
  createEffect,
  createSignal,
  createMemo,
  mergeProps,
  Switch,
  Match,
} from "solid-js";
import { Portal } from "solid-js/web";

import "./modal.css";
import { getElements, WrappedElement } from "./tools";

type WrappedModalContentProps = {
  open: Accessor<boolean>;
  /**
   * toggle
   *
   * if called with boolean argument, it will set the open state
   * according to the argument, otherwise toggle it
   */
  toggle: (open?: boolean | unknown) => void;
};

export type ModalProps = Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  open?: boolean;
  noPortal?: boolean;
  onClose?: () => void;
  width?: string;
  children: WrappedElement<WrappedModalContentProps> | JSX.Element;
};

let modalCount = 0;

export const Modal = (props: ModalProps): JSX.Element => {
  const [local, containerProps] = splitProps(props, [
    "open",
    "noPortal",
    "children",
  ]);
  // eslint-disable-next-line
  const [open, setOpen] = createSignal(local.open);

  createEffect(() => {
    const popupStatus = open();
    if (popupStatus === false) {
      props.onClose?.();
    }
    console.log("popup is", open());
  });

  const toggle = (open?: boolean) => {
    setOpen(typeof open === "boolean" ? open : (o) => !o);
  };
  const modalContent = createMemo(
    () =>
      getElements(
        local.children,
        (node) => node.className.indexOf("sb-modal-content") !== -1,
        [{ open, toggle }],
      ) ?? [],
  );
  const otherChildren = createMemo(() =>
    getElements(
      local.children,
      (node) => node.className.indexOf("sb-modal-content") === -1,
      [{ open, toggle }],
    ),
  );

  let modalRef!: HTMLDivElement;
  createEffect(() => open() && (modalRef?.focus(), modalRef?.scrollIntoView()));

  modalCount++;

  createEffect(() => {
    if (!modalRef) {
      return;
    }
    const header = modalRef.querySelector(".sb-modal-header");
    if (header) {
      modalRef.setAttribute(
        "aria-labelledby",
        header.id || (() => (header.id = `sb-modal-header-${modalCount}`))(),
      );
    }
    const body = modalRef.querySelector(".sb-modal-body");
    if (body) {
      modalRef.setAttribute(
        "aria-describedby",
        body.id || (() => (body.id = `sb-modal-body-${modalCount}`))(),
      );
    }
  });

  const divProps = mergeProps(containerProps, {
    role: "dialog",
    tabIndex: -1,
    // eslint-disable-next-line
    style: { "--sb-modal-width": props.width || "unset" },
    // eslint-disable-next-line
    class: props.class ? `sb-modal ${props.class}` : "sb-modal",
    // eslint-disable-next-line
    children: modalContent(),
    // eslint-disable-next-line
    onClick: createMemo(() =>
      props.closeOnClickOutside
        ? // eslint-disable-next-line
          (ev: MouseEvent) => {
            const target = ev.target as HTMLElement;
            if (!modalContent().some((content) => content?.contains(target))) {
              toggle(false);
            }
          }
        : undefined,
    )(),
    // eslint-disable-next-line
    onkeyup: createMemo(() =>
      props.closeOnEsc !== false
        ? (ev: KeyboardEvent) => {
            if (ev.key === "Escape" && !ev.defaultPrevented) {
              toggle(false);
            }
          }
        : undefined,
    )(),
  });

  return (
    <Switch>
      <Match when={!open()}>{otherChildren()}</Match>
      <Match when={open() && local.noPortal}>
        <>
          {otherChildren()}
          <div ref={modalRef} {...(divProps as any)} />
        </>
      </Match>
      <Match when={open() && !local.noPortal}>
        <>
          {otherChildren()}
          <Portal
            mount={(window as any).DMBRoot.body || (window as any).DMBRoot}
          >
            <div ref={modalRef} {...(divProps as any)} />
          </Portal>
        </>
      </Match>
    </Switch>
  );
};

export type ModalContentProps = JSX.HTMLAttributes<HTMLDivElement>;

export const ModalContent: Component<ModalContentProps> = (props) => (
  <div
    {...props}
    class={props.class ? `sb-modal-content ${props.class}` : "sb-modal-content"}
  />
);

export type ModalHeaderProps = JSX.HTMLAttributes<HTMLElement>;

export const ModalHeader: Component<ModalHeaderProps> = (props) => (
  <header
    {...props}
    class={props.class ? `sb-modal-header ${props.class}` : "sb-modal-header"}
  />
);

export type ModalBodyProps = JSX.HTMLAttributes<HTMLElement>;

export const ModalBody: Component<ModalBodyProps> = (props) => (
  <main
    {...props}
    class={props.class ? `sb-modal-body ${props.class}` : "sb-modal-body"}
  />
);

export type ModalFooterProps = JSX.HTMLAttributes<HTMLElement>;

export const ModalFooter: Component<ModalFooterProps> = (props) => (
  <footer
    {...props}
    class={props.class ? `sb-modal-footer ${props.class}` : "sb-modal-footer"}
  />
);

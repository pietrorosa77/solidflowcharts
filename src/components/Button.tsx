import { Component, JSX, mergeProps, splitProps } from "solid-js";

import "./button.css";

export type ButtonProps = JSX.HTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "link" | "icon";
};

export const Button: Component<ButtonProps> = (props) => {
  const [local, buttonProps] = splitProps(props, ["variant", "classList"]);

  return (
    <button
      {...buttonProps}
      // eslint-disable-next-line
      classList={mergeProps(local.classList ?? {}, {
        "sb-button": true,
        [local.variant ?? "primary"]: true,
      })}
    />
  );
};

import { Link } from "@remix-run/react";
import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { Button as BaseButton } from "react-aria-components";

/**
 * Tailwind Classes lookup directory
 */
const baseClasses = [
  "transition-all border rounded-lg",
  "disabled:cursor-not-allowed",
  "flex items-center",
];

const colorClasses = {
  blue: {
    filled: [
      "border border-blue-400 bg-blue-100 [--tw-bg-opacity:0.7] text-blue-700",
      "hover:drop-shadow-btn hover:[--tw-bg-opacity:1]",
      "[&_svg]:fill-blue-700",
      "disabled:hover:drop-shadow-none",
    ],
    outlined: [
      "border border-blue-700 text-blue-700",
      "hover:drop-shadow-btn hover:bg-blue-100",
      "[&_svg]:fill-blue-700",
      "disabled:hover:drop-shadow-none",
    ],
    text: [
      "text-blue-700",
      "border-none",
      "disabled:hover:drop-shadow-none hover:bg-blue-100",
      "[&_svg]:fill-blue-700",
    ],
  },
  gray: {
    filled: [
      "border border-borderColor bg-gray-200 [--tw-bg-opacity:0.7]",
      "hover:drop-shadow-btn hover:[--tw-bg-opacity:1]",
      "disabled:hover:drop-shadow-none",
    ],
    outlined: [
      "border border-borderColor",
      "hover:drop-shadow-btn hover:bg-neutral-100",
      "disabled:hover:drop-shadow-none",
    ],
    text: ["focus-visible:to-blue-400", "border-none", "disabled:hover:drop-shadow-none"],
  },
} as const;

const sizeClasses = {
  large: "px-4 py-2 leading-28 text-16",
  small: "px-2 py-1 font-regular leading-24 ",
};

/**
 * Prop types
 */
type TagProps =
  | ComponentPropsWithoutRef<typeof BaseButton>
  | ComponentPropsWithoutRef<typeof Link>
  | ComponentPropsWithoutRef<"button">
  | ComponentPropsWithoutRef<"a">;
type Color = keyof typeof colorClasses;
type Variant = keyof (typeof colorClasses)[Color];
type Size = keyof typeof sizeClasses;
type BaseProps = {
  as?: "button" | "a" | typeof Link | typeof BaseButton;
  color?: Color;
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  disabled?: boolean;
};
type Props = TagProps & BaseProps;

/**
 * Component definition (with default variants)
 */
const Button = forwardRef<HTMLAnchorElement | HTMLButtonElement, Props>(
  (
    {
      as,
      type,
      color = "gray",
      variant = "filled",
      size = "small",
      children,
      className = "",
      isLoading = false,
      disabled,
      ...props
    },
    forwardRef,
  ) => {
    const Tag = as || "button";

    return (
      <Tag
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as any)}
        ref={forwardRef}
        type={type || "button"}
        disabled={isLoading || disabled}
        className={clsx([baseClasses, colorClasses[color][variant], sizeClasses[size], className])}
        {...(Tag === Link ? { prefetch: false } : {})}
      >
        {children}
      </Tag>
    );
  },
);

Button.displayName = "DebuggedButton";

export default Button;

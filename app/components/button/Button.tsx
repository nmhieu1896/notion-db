import { Link } from "@remix-run/react";
import clsx from "clsx";
import { ComponentPropsWithoutRef, forwardRef } from "react";
import { Button as BaseButton } from "react-aria-components";

/**
 * Tailwind Classes lookup directory
 */
const baseClasses = [
  "transition-all border w-full",
  "disabled:cursor-not-allowed",
  "focus-visible:outline-none focus-visible:ring",
  "grid grid-flow-col auto-cols-max items-center justify-center",
];

const colorClasses = {
  primary: {
    filled: [
      "focus-visible:to-blue-400",
      "text-secondary-100 bg-primary border-primary",
      "hover:drop-shadow-btn",
      "disabled:hover:drop-shadow-none",
      "disabled:text-text-30 disabled:bg-primary disabled:bg-btn disabled:border-transparent",
    ],
    outlined: [
      "focus-visible:to-blue-400",
      "text-primary border-primary",
      "hover:text-secondary-100 hover:bg-primary hover:border-primary",
      "hover:drop-shadow-btn",
      "disabled:hover:drop-shadow-none",
      "disabled:text-text-30 disabled:bg-primary disabled:bg-btn disabled:border-transparent",
    ],
    text: [
      "focus-visible:to-blue-400",
      "text-primary border-none",
      "hover:bg-primary-600/[.08]",
      "disabled:text-primary-500/80 disabled:bg-transparent",
    ],
  },
  error: {
    filled: ["bg-error border-error"],
    outlined: ["text-error border-error", "hover:bg-error hover:text-secondary-100"],
    text: ["text-error border-none"],
  },
  default: {
    filled: [
      "focus-visible:ring-orange-600",
      "text-secondary-400 bg-grey-300 border-grey-300",
      "hover:text-secondary-400 hover:bg-grey-300 hover:border-grey-300",
      "disabled:text-grey-500/80 disabled:bg-grey-500/[.24] disabled:border-grey-500/[.24]",
      "shadow-btn-default-filled",
    ],
    outlined: [
      "focus-visible:ring-orange-600",
      "text-white border-text-50",
      "hover:text-white hover:border-grey-500/[.32]",
      "disabled:text-grey-500/80 disabled:border-grey-500/[.24]",
    ],
    text: [
      "focus-visible:ring-orange-600",
      "text-white border-none",
      "hover:bg-white/[.08]",
      "disabled:text-grey-500/80 disabled:bg-transparent",
    ],
  },
  "bo-primary": {
    filled: [
      "focus-visible:shadow-bo-primary-btn focus-visible:ring-0",
      "text-bo-white bg-bo-primary border-bo-primary",
      "hover:shadow-bo-primary-btn",
      "disabled:text-bo-gray disabled:bg-bo-gray-300 disabled:border-transparent disabled:hover:shadow-none",
    ],
    outlined: [
      "focus-visible:shadow-bo-primary-btn focus-visible:ring-0",
      "text-bo-primary border-bo-primary",
      "hover:text-bo-primary hover:bg-bo-primary-50 hover:border-bo-primary hover:shadow-bo-primary-btn",
      "disabled:text-bo-primary-200 disabled:border-bo-primary-200 disabled:bg-transparent disabled:hover:shadow-none",
    ],
    text: [
      "focus-visible:shadow-bo-primary-btn focus-visible:ring-0",
      "text-bo-primary border-none",
      "hover:bg-bo-primary-100",
      "disabled:opacity-50 disabled:bg-transparent disabled:hover:shadow-none",
    ],
  },
  "bo-error": {
    filled: [
      "focus-visible:shadow-bo-error-btn focus-visible:ring-0",
      "bg-bo-error border-bo-error text-bo-white",
      "hover:shadow-bo-error-btn",
      "disabled:opacity-50 disabled:hover:shadow-none",
    ],
    outlined: [
      "focus-visible:shadow-bo-error-btn focus-visible:ring-0",
      "text-bo-error border-bo-error",
      "hover:bg-bo-error-50 hover:text-bo-error hover:shadow-bo-error-btn",
      "disabled:opacity-50 disabled:hover:shadow-none",
    ],
    text: [
      "focus-visible:shadow-bo-error-btn focus-visible:ring-0",
      "text-bo-error border-none",
      "hover:shadow-bo-error-btn hover:bg-bo-error-100",
      "disabled:opacity-50 disabled:hover:shadow-none",
    ],
  },
  "bo-default": {
    filled: [
      "focus-visible:shadow-bo-btn focus-visible:ring-0",
      "text-bo-gray-700 bg-bo-white border-bo-gray-200",
      "hover:text-bo-gray-800 hover:shadow-bo-btn",
      "disabled:opacity-50 disabled:bg-transparent disabled:hover:shadow-none",
    ],
    outlined: [
      "focus-visible:shadow-bo-btn focus-visible:ring-0",
      "text-bo-gray-700  border-text-50",
      "hover:text-bo-gray-800 hover:border-gray-500/[.32] hover:shadow-bo-btn",
      "disabled:opacity-50 disabled:bg-transparent disabled:hover:shadow-none",
    ],
    text: [
      "focus-visible:shadow-bo-btn focus-visible:ring-0",
      "text-bo-gray-700 border-none",
      "hover:bg-bo-gray-100",
      "disabled:opacity-50 disabled:bg-transparent disabled:hover:shadow-none",
    ],
  },
} as const;

const shapeClasses = {
  square: "rounded-none",
  rounded: "rounded-lg",
  pill: "rounded-full",
} as const;

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
type Shape = keyof typeof shapeClasses;
type BaseProps = {
  as?: "button" | "a" | typeof Link | typeof BaseButton;
  color?: Color;
  variant?: Variant;
  shape?: Shape;
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
      color = "primary",
      variant = "filled",
      shape = "rounded",
      children,
      className = "",
      isLoading = false,
      disabled,
      ...props
    },
    forwardRef
  ) => {
    const Tag = as || "button";

    return (
      <Tag
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as any)}
        ref={forwardRef}
        type={type || "button"}
        disabled={isLoading || disabled}
        className={clsx([
          baseClasses,
          colorClasses[color][variant],
          shapeClasses[shape],
          className,
        ])}
        {...(Tag === Link ? { prefetch: false } : {})}
      >
        {children}
      </Tag>
    );
  }
);

Button.displayName = "DebuggedButton";

export default Button;

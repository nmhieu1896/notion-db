import clsx from "clsx";
import { forwardRef, InputHTMLAttributes } from "react";

export const BaseInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function NestedBaseInput({ className, value, ...props }, ref) {
    return (
      <input
        ref={(myRef) => {
          // For controlled set
          if (value && myRef) myRef.value = value.toString();
          if (typeof ref === "function") ref(myRef);
          else if (ref) ref.current = myRef;
        }}
        className={clsx(className, "rounded-lg border border-borderColor px-2 py-1")}
        {...props}
      />
    );
  },
);

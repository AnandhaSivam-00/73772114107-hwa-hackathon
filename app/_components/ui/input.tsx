import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full rounded-xl border border-input bg-white px-4 text-[15px] text-forest shadow-[0_1px_2px_rgb(40_54_24/0.04)] transition-[color,box-shadow,border-color] outline-none",
        "placeholder:text-forest-soft/45",
        "focus-visible:border-olive focus-visible:ring-2 focus-visible:ring-olive/35",
        "aria-invalid:border-terracotta aria-invalid:ring-2 aria-invalid:ring-terracotta/25",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
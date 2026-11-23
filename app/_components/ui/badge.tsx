import * as React from "react";
import { Slot } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-tangerine text-white",
        honey: "bg-honey/30 text-forest",
        olive: "bg-olive/12 text-olive",
        outline: "border border-sand bg-white text-forest-soft",
        forest: "bg-forest text-cream",
        cream: "bg-cream-deep text-forest-soft",
        destructive: "bg-terracotta/10 text-terracotta",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"
  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}
export { Badge, badgeVariants }
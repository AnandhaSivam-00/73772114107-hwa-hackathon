import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"


const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-[15px] font-bold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-olive focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 cursor-pointer",
    {
        variants: {
            variant: {
                default:
                    "bg-tangerine text-white shadow-soft hover:bg-tangerine-deep hover:shadow-glow",
                secondary:
                    "bg-white text-forest border border-sand shadow-soft hover:bg-cream hover:-translate-y-px",
                outline:
                    "border-[1.5px] border-olive bg-transparent text-forest hover:bg-cream",
                caramel:
                    "border-[1.5px] border-caramel bg-transparent text-caramel hover:bg-caramel/10",
                ghost: "text-forest hover:bg-forest/5",
                link: "text-caramel underline-offset-4 hover:underline rounded-md",
                forest: "bg-forest text-cream hover:bg-forest/90",
                destructive:
                    "bg-terracotta text-white hover:bg-terracotta/90 shadow-soft",
            },
            size: {
                default: "h-11 px-7",
                sm: "h-9 px-4 text-sm",
                lg: "h-12 px-8 text-base",
                icon: "size-10",
                iconSm: "size-8",
            },
        },
        defaultVariants: { variant: "default", size: "default" },
    }
)

function Button({
    className,
    variant = "default",
    size = "default",
    asChild = false,
    ...props
}: React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean
    }) {
    const Comp = asChild ? Slot.Root : "button"

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

export { Button, buttonVariants }

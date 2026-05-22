import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const styles = cva(
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-r from-primary to-sky-500 text-white shadow-[0_12px_26px_-14px_rgba(2,132,199,0.8)] hover:shadow-[0_16px_32px_-14px_rgba(2,132,199,0.9)]",
        secondary: "border border-border bg-card/80 backdrop-blur hover:bg-muted/70",
        ghost: "hover:bg-muted/70"
      }
    },
    defaultVariants: { variant: "primary" }
  }
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof styles> & { asChild?: boolean };

export function Button({ className, variant, asChild, ...props }: Props) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(styles({ variant }), className)} {...props} />;
}

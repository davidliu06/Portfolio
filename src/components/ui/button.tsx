"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMagnetic } from "@/hooks/useMagnetic";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-glow hover:brightness-110",
        secondary: "bg-secondary text-secondary-foreground hover:brightness-110",
        outline: "border bg-background/70 hover:bg-muted",
        ghost: "hover:bg-muted",
        accent: "bg-accent text-accent-foreground shadow-orange hover:brightness-105"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "ref">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, onPointerMove, onPointerLeave, ...props }, ref) => {
    const magnetic = useMagnetic({ strength: 0.25, radius: 60 });
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={{ x: magnetic.x, y: magnetic.y }}
        suppressHydrationWarning
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onPointerMove={(event) => {
          magnetic.handlePointerMove(event);
          onPointerMove?.(event);
        }}
        onPointerLeave={(event) => {
          magnetic.handlePointerLeave();
          onPointerLeave?.(event);
        }}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

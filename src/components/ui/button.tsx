import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Button component variants aligned with the portfolio design system.
 *
 * Variants:
 * - `primary`: Main CTA with glow effect and gradient hover
 * - `secondary`: Transparent/glass button for secondary actions
 * - `outline`: Border button that fills on hover (404 page style)
 * - `ghost`: Minimal button for tertiary actions
 * - `link`: Text button with underline hover
 *
 * Sizes:
 * - `sm`: Header CTA (px-6 py-2.5)
 * - `default`: Standard buttons (px-8 py-4)
 * - `lg`: Hero/Contact CTA (px-10 py-5)
 * - `icon`: Icon-only button
 */
const buttonVariants = cva(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                // Primary CTA - with glow and gradient overlay on hover
                primary: [
                    "rounded-full bg-primary text-white shadow-glow",
                    "hover:shadow-glow-lg hover:-translate-y-0.5 hover:scale-[1.02]",
                    "active:scale-[0.98]",
                    // Gradient overlay pseudo-element handled via inner span in component
                ].join(" "),

                // Secondary/Ghost - glass effect for secondary actions
                secondary: [
                    "rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-sm",
                    "hover:border-white/20 hover:bg-white/10 hover:-translate-y-0.5 hover:scale-[1.02]",
                    "active:scale-[0.98]",
                ].join(" "),

                // Outline - border that fills on hover (used in 404 page)
                outline: [
                    "rounded-xl border-2 border-primary bg-transparent text-primary",
                    "hover:bg-primary hover:text-white hover:shadow-glow-sm hover:-translate-y-0.5 hover:scale-[1.02]",
                    "active:scale-[0.98]",
                ].join(" "),

                // Ghost - minimal for tertiary actions (pricing non-premium)
                ghost: [
                    "rounded-xl border-2 border-white/10 bg-transparent text-white",
                    "hover:border-white/20 hover:bg-white/5",
                    "active:scale-[0.98]",
                ].join(" "),

                // Link - text button with underline
                link: [
                    "text-primary underline-offset-4",
                    "hover:underline",
                ].join(" "),
            },
            size: {
                // Small - Header CTA
                sm: "px-6 py-2.5 text-sm",
                // Default - Standard buttons
                default: "px-8 py-4 text-base",
                // Large - Hero/Contact main CTA
                lg: "px-10 py-5 text-lg font-bold",
                // Icon only
                icon: "h-10 w-10 p-0",
            },
            // Full width option for pricing cards
            fullWidth: {
                true: "w-full",
                false: "",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "default",
            fullWidth: false,
        },
    },
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    /** Show gradient overlay on hover (only for primary variant) */
    withGradient?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, fullWidth, asChild = false, withGradient = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        // withGradient is not compatible with asChild (Slot expects a single child)
        const shouldShowGradient = variant === "primary" && withGradient && !asChild;

        // For primary variant with gradient, wrap children in span and add gradient overlay
        const content = shouldShowGradient ? (
            <>
                <span className="relative z-10 flex items-center gap-2">{children}</span>
                <div className="absolute inset-0 bg-linear-to-r from-primary to-primary-light opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </>
        ) : (
            children
        );

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, fullWidth, className }))}
                ref={ref}
                {...props}
            >
                {content}
            </Comp>
        );
    },
);
Button.displayName = "Button";

export { Button, buttonVariants };

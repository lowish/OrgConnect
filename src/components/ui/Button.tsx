  import type { ComponentPropsWithoutRef, ReactNode } from "react";

  type Variant = "primary" | "secondary" | "ghost";
  type Size = "sm" | "md" | "lg";

  const base =
    "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium " +
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cardinal-600 " +
    "focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 disabled:pointer-events-none disabled:opacity-50 " +
    "active:scale-[0.98] dark:focus-visible:ring-offset-stone-950";

  const variants: Record<Variant, string> = {
    primary:
      "bg-stone-900 text-stone-50 shadow hover:bg-stone-900/90 " +
      "dark:bg-stone-50 dark:text-stone-900 dark:hover:bg-stone-50/90",
    secondary:
      "border border-stone-200 bg-stone-50 text-stone-900 shadow-sm hover:bg-stone-100 " +
      "dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800",
    ghost:
      "text-stone-700 hover:bg-stone-100 hover:text-stone-900 " +
      "dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-100",
  };

  const sizes: Record<Size, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 py-2",
    lg: "h-10 px-6 text-sm",
  };

  interface CommonProps {
    variant?: Variant;
    size?: Size;
    children: ReactNode;
    className?: string;
  }

  type AnchorProps = CommonProps & ComponentPropsWithoutRef<"a"> & { href: string };
  type NativeButtonProps = CommonProps & ComponentPropsWithoutRef<"button"> & { href?: undefined };

  /** Renders an <a> when `href` is given, otherwise a <button>. */
  export function Button(props: AnchorProps | NativeButtonProps) {
    const { variant = "primary", size = "md", className = "", ...rest } = props;
    const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

    if (rest.href !== undefined) {
      return <a {...(rest as ComponentPropsWithoutRef<"a">)} className={classes} />;
    }
    return <button {...(rest as ComponentPropsWithoutRef<"button">)} className={classes} />;
  }

  import type { ComponentPropsWithoutRef, ReactNode } from "react";

  type Variant = "primary" | "secondary" | "ghost";
  type Size = "sm" | "md" | "lg";

  const base =
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium " +
    "transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 " +
    "focus-visible:outline-cardinal-600 active:scale-[0.98]";

  const variants: Record<Variant, string> = {
    primary:
      "bg-cardinal-600 text-white shadow-sm shadow-cardinal-600/25 " +
      "hover:bg-cardinal-700 hover:shadow-md hover:shadow-cardinal-600/25",
    secondary:
      "border border-stone-300 bg-white text-stone-900 hover:border-stone-400 hover:bg-stone-50 " +
      "dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 " +
      "dark:hover:border-stone-600 dark:hover:bg-stone-800",
    ghost:
      "text-stone-600 hover:bg-stone-100 hover:text-stone-900 " +
      "dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100",
  };

  const sizes: Record<Size, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
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

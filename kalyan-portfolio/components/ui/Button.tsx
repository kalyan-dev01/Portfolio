import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";

interface BaseProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}

interface ButtonAsButton extends BaseProps {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
}

interface ButtonAsLink extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
}

type Props = ButtonAsButton | ButtonAsLink;

const variants = {
  primary: "bg-accent text-white hover:bg-accent-strong",
  secondary: "bg-transparent text-text border border-border hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-muted hover:text-text",
};

export function Button(props: Props) {
  const { children, variant = "primary", className } = props;
  const classes = cn(
    "focus-ring inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-200",
    variants[variant],
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} target={props.target} rel={props.rel} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button type={buttonProps.type ?? "button"} onClick={buttonProps.onClick} className={classes}>
      {children}
    </button>
  );
}

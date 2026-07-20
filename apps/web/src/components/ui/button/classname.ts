import type {
  ButtonClassNameOptions,
  ButtonSize,
  ButtonVariant,
} from "./types";
import { cn } from "@/lib/cn";

const baseButtonClass =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:opacity-90",
  ghost: "bg-transparent hover:bg-muted hover:text-foreground",
  outline: "border border-input bg-background hover:bg-muted",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-8",
};

export function buttonClassName(options?: ButtonClassNameOptions) {
  const variant = options?.variant ?? "default";
  const size = options?.size ?? "default";

  return cn(
    baseButtonClass,
    variantClasses[variant],
    sizeClasses[size],
    options?.className,
  );
}

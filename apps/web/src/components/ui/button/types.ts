import type * as React from "react";

export type ButtonVariant = "default" | "ghost" | "outline";
export type ButtonSize = "default" | "sm" | "lg";

export interface ButtonClassNameOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

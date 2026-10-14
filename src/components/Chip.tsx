import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "./Chip.module.css";

type ChipProps = {
  children: ReactNode;
  pressed?: boolean;
  tone?: "blue" | "default";
  to?: string;
  onClick?: () => void;
};

export function Chip({
  children,
  pressed = false,
  tone = "default",
  to,
  onClick,
}: ChipProps) {
  const className = [
    styles.chip,
    tone === "blue" ? styles.blue : "",
    pressed ? styles.pressed : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={className}
      aria-pressed={pressed}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

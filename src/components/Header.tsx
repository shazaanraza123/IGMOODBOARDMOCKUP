import { forwardRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import styles from "./Header.module.css";

type HeaderProps = {
  title: string;
  titleId: string;
  subtitle?: string;
  wordmark?: boolean;
  backTo?: string;
  end?: ReactNode;
};

export function Header({
  title,
  titleId,
  subtitle,
  wordmark,
  backTo,
  end,
}: HeaderProps) {
  if (wordmark) {
    return (
      <header className={styles.wordmarkBar}>
        <h1 id={titleId} className={styles.wordmark}>
          {title}
        </h1>
        <div className={styles.end}>{end}</div>
      </header>
    );
  }

  return (
    <header className={styles.bar}>
      <div className={styles.side}>
        {backTo ? (
          <Link to={backTo} className={styles.iconButton} aria-label="Back">
            <Icon name="back" />
          </Link>
        ) : null}
      </div>
      <div className={styles.titles}>
        <h1 id={titleId} className={styles.title}>
          {title}
        </h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      <div className={styles.side}>{end}</div>
    </header>
  );
}

type IconButtonProps = {
  label: string;
  to?: string;
  onClick?: () => void;
  children: ReactNode;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ label, to, onClick, children }, ref) {
    if (to) {
      return (
        <Link to={to} className={styles.iconButton} aria-label={label}>
          {children}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        className={styles.iconButton}
        aria-label={label}
        onClick={onClick}
      >
        {children}
      </button>
    );
  },
);

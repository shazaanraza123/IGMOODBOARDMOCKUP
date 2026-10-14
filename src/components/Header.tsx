import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import styles from "./Header.module.css";

type HeaderProps = {
  title: string;
  titleId: string;
  wordmark?: boolean;
  backTo?: string;
  end?: ReactNode;
};

export function Header({ title, titleId, wordmark, backTo, end }: HeaderProps) {
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
      </div>
      <div className={styles.side}>{end}</div>
    </header>
  );
}

type IconButtonProps = {
  label: string;
  to?: string;
  children: ReactNode;
};

export function IconButton({ label, to, children }: IconButtonProps) {
  if (to) {
    return (
      <Link to={to} className={styles.iconButton} aria-label={label}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={styles.iconButton} aria-label={label}>
      {children}
    </button>
  );
}

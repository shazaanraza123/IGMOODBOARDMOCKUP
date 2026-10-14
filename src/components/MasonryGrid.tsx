import type { ReactNode } from "react";
import styles from "./MasonryGrid.module.css";

type MasonryGridProps = {
  children: ReactNode;
};

export function MasonryGrid({ children }: MasonryGridProps) {
  return <div className={styles.masonry}>{children}</div>;
}

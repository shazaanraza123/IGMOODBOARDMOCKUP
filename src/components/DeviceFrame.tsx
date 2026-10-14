import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { STAGE_BOARD_ID } from "../data/boardIds";
import styles from "./DeviceFrame.module.css";

type DeviceFrameProps = {
  children: ReactNode;
};

export function DeviceFrame({ children }: DeviceFrameProps) {
  return (
    <div className={styles.page}>
      <div className={styles.frame} data-testid="device-frame">
        {children}
      </div>
      <p className={styles.caption}>
        Instagram Moodboard · independent concept · tap through Flow A or Flow B
      </p>
      <nav className={styles.flows} aria-label="Demo flows">
        <Link className={styles.flow} to="/">
          Start Flow A
        </Link>
        <Link className={styles.flow} to={`/board/${STAGE_BOARD_ID}`}>
          Start Flow B
        </Link>
      </nav>
    </div>
  );
}

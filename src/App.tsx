import { useEffect, useRef, useState } from "react";
import { DeviceFrame } from "./components/DeviceFrame";
import { TabBar } from "./components/TabBar";
import { AppRoutes } from "./routes";
import styles from "./App.module.css";

const UNAVAILABLE = "Not part of this concept";

export function App() {
  const notice = useNotice();

  return (
    <DeviceFrame>
      <div className={styles.shell}>
        <div className={styles.status} aria-hidden="true" />
        <main className={styles.main}>
          <AppRoutes />
        </main>
        <TabBar onUnavailable={() => notice.show(UNAVAILABLE)} />
        {notice.message ? (
          <p
            className={styles.toast}
            role="status"
            tabIndex={0}
            onMouseEnter={notice.pause}
            onMouseLeave={notice.resume}
            onFocus={notice.pause}
            onBlur={notice.resume}
          >
            {notice.message}
          </p>
        ) : null}
      </div>
    </DeviceFrame>
  );
}

function useNotice() {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const show = (next: string) => {
    clearTimer();
    setMessage(next);
    timer.current = window.setTimeout(() => {
      setMessage(null);
      timer.current = null;
    }, 4000);
  };

  const pause = () => {
    clearTimer();
  };

  const resume = () => {
    if (message === null) return;
    clearTimer();
    timer.current = window.setTimeout(() => {
      setMessage(null);
      timer.current = null;
    }, 4000);
  };

  useEffect(() => clearTimer, []);

  return { message, show, pause, resume };
}

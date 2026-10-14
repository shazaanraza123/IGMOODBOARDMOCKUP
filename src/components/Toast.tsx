import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PostImage } from "./PostImage";
import { ToastContext, useToast, type ToastMessage } from "./toastState";
import styles from "./Toast.module.css";

const DISMISS_MS = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<(ToastMessage & { id: number }) | null>(
    null,
  );
  const timer = useRef<number | null>(null);
  const remaining = useRef(DISMISS_MS);
  const endsAt = useRef(0);
  const id = useRef(0);

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const arm = (delay: number) => {
    clearTimer();
    remaining.current = delay;
    endsAt.current = Date.now() + delay;
    timer.current = window.setTimeout(() => {
      timer.current = null;
      setToast(null);
    }, delay);
  };

  const show = (message: ToastMessage) => {
    id.current += 1;
    setToast({ ...message, id: id.current });
    arm(DISMISS_MS);
  };

  const dismiss = () => {
    clearTimer();
    setToast(null);
  };

  const pause = () => {
    if (timer.current === null) return;
    remaining.current = Math.max(0, endsAt.current - Date.now());
    clearTimer();
  };

  const resume = () => {
    if (!toast || timer.current !== null) return;
    arm(remaining.current > 0 ? remaining.current : DISMISS_MS);
  };

  useEffect(() => clearTimer, []);

  return (
    <ToastContext.Provider value={{ toast, show, dismiss, pause, resume }}>
      {children}
    </ToastContext.Provider>
  );
}

export function ToastViewport() {
  const { toast, pause, resume } = useToast();
  const reduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {toast ? (
        <motion.div
          key={toast.id}
          className={styles.toast}
          role="status"
          tabIndex={0}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: reduced ? 0.01 : 0.22 }}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocus={pause}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) resume();
          }}
        >
          {toast.image ? (
            <div className={styles.thumb}>
              <PostImage
                image={toast.image.src}
                imageAlt={toast.image.alt}
                tint={toast.image.tint}
                width={44}
                height={44}
              />
            </div>
          ) : null}
          <div className={styles.copy}>
            <p className={styles.title}>{toast.title}</p>
            {toast.body ? <p className={styles.body}>{toast.body}</p> : null}
          </div>
          {toast.action ? (
            <button
              type="button"
              className={styles.action}
              onClick={toast.action.onClick}
            >
              {toast.action.label}
            </button>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

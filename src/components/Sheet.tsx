import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useChrome } from "./chrome";
import styles from "./Sheet.module.css";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type SheetProps = {
  open: boolean;
  title: string;
  titleId: string;
  onClose: () => void;
  returnFocusRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
};

export function Sheet({
  open,
  title,
  titleId,
  onClose,
  returnFocusRef,
  children,
}: SheetProps) {
  const { portal, setSheetOpen } = useChrome();
  const reduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const drag = useRef(0);
  const returnTo = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    setSheetOpen(true);
    return () => setSheetOpen(false);
  }, [open, setSheetOpen]);

  useEffect(() => {
    if (!open) return;
    const node = dialogRef.current;
    returnTo.current = returnFocusRef?.current ?? null;
    node?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !node) return;
      const items = [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (item) => item.tabIndex !== -1 || item === node,
      );
      const focusable = items.filter((item) => item !== node);
      if (focusable.length === 0) {
        event.preventDefault();
        node.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === node)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [open, returnFocusRef]);

  if (!portal) return null;

  return createPortal(
    <AnimatePresence
      onExitComplete={() => {
        returnTo.current?.focus();
      }}
    >
      {open ? (
        <div className={styles.host}>
          <motion.button
            type="button"
            className={styles.overlay}
            aria-label="Close"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.01 : 0.2 }}
          />
          <motion.div
            ref={dialogRef}
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={reduced ? { opacity: 0 } : { y: "100%" }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: "100%" }}
            transition={
              reduced
                ? { duration: 0.01 }
                : { type: "spring", stiffness: 400, damping: 40 }
            }
          >
            <div
              className={styles.grabberRow}
              onPointerDown={(event) => {
                const start = event.clientY;
                drag.current = 0;
                const target = event.currentTarget.parentElement;
                const move = (pointer: PointerEvent) => {
                  drag.current = Math.max(0, pointer.clientY - start);
                  if (!reduced && target) {
                    target.style.transform = `translateY(${drag.current}px)`;
                  }
                };
                const up = () => {
                  window.removeEventListener("pointermove", move);
                  window.removeEventListener("pointerup", up);
                  if (target) target.style.transform = "";
                  if (drag.current > 80) onCloseRef.current();
                };
                window.addEventListener("pointermove", move);
                window.addEventListener("pointerup", up);
              }}
            >
              <span className={styles.grabber} aria-hidden="true" />
            </div>
            <h2 id={titleId} className={styles.title}>
              {title}
            </h2>
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    portal,
  );
}

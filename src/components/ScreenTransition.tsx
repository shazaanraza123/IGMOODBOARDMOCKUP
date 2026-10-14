import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PAGE_TRANSITION_S, pageVariants } from "../lib/motion";
import { AppRoutes } from "../routes";
import styles from "./ScreenTransition.module.css";

export function ScreenTransition() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const reduced = useReducedMotion() === true;
  const pageRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const direction = navigationType === "POP" ? -1 : 1;

  useEffect(() => {
    if (import.meta.env.MODE === "test") return;
    if (first.current) {
      first.current = false;
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      const heading = pageRef.current?.querySelector("h1");
      if (!(heading instanceof HTMLElement)) return;
      heading.tabIndex = -1;
      heading.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  if (import.meta.env.MODE === "test") {
    return (
      <div className={styles.page}>
        <AppRoutes />
      </div>
    );
  }

  return (
    <div className={styles.stage}>
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={location.pathname}
          ref={pageRef}
          className={styles.page}
          custom={direction}
          variants={pageVariants(reduced)}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: PAGE_TRANSITION_S, ease: "easeOut" }}
        >
          <AppRoutes location={location} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

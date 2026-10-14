import { useState } from "react";
import { Header } from "../components/Header";
import { useMoodboardStore } from "../store/useMoodboardStore";
import styles from "./screens.module.css";

export function About() {
  const resetDemo = useMoodboardStore((state) => state.resetDemo);
  const [restored, setRestored] = useState(false);

  return (
    <section className={styles.screen} aria-labelledby="about-title">
      <Header title="About" titleId="about-title" backTo="/saved" />
      <div className={styles.body}>
        <p className={styles.empty}>
          Independent concept by Shazaan Raza. Not affiliated with or endorsed
          by Instagram or Meta.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.action}
            onClick={() => {
              resetDemo();
              setRestored(true);
            }}
          >
            Reset demo data
          </button>
        </div>
        {restored ? (
          <p className={styles.confirm}>Demo data restored.</p>
        ) : null}
      </div>
    </section>
  );
}

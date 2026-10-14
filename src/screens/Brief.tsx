import { Header } from "../components/Header";
import styles from "./screens.module.css";

export function Brief() {
  return (
    <section className={styles.screen} aria-labelledby="brief-title">
      <Header title="Brief" titleId="brief-title" backTo="/saved" />
      <div className={styles.body}>
        <p className={styles.empty}>Save a direction and it shows up here.</p>
      </div>
    </section>
  );
}

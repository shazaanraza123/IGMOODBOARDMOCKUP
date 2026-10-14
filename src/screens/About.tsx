import { Header } from "../components/Header";
import styles from "./screens.module.css";

export function About() {
  return (
    <section className={styles.screen} aria-labelledby="about-title">
      <Header title="About" titleId="about-title" backTo="/saved" />
      <div className={styles.body}>
        <p className={styles.empty}>
          Independent concept by Shazaan Raza. Not affiliated with or endorsed
          by Instagram or Meta.
        </p>
      </div>
    </section>
  );
}

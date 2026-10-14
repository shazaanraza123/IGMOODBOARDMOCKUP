import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import styles from "./screens.module.css";

export function FindSimilar() {
  const { id } = useParams();

  return (
    <section className={styles.screen} aria-labelledby="similar-title">
      <Header
        title="Find similar"
        titleId="similar-title"
        backTo={`/board/${id ?? ""}`}
      />
      <div className={styles.body}>
        <p className={styles.empty}>Pick at least one thing you like.</p>
      </div>
    </section>
  );
}

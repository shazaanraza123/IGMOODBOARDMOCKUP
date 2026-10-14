import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import styles from "./screens.module.css";

export function Ideas() {
  const { id } = useParams();

  return (
    <section className={styles.screen} aria-labelledby="ideas-title">
      <Header
        title="Develop an idea"
        titleId="ideas-title"
        backTo={`/board/${id ?? ""}`}
      />
      <div className={styles.body}>
        <p className={styles.empty}>Uses only the posts in this board.</p>
      </div>
    </section>
  );
}

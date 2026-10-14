import { Link, useParams } from "react-router-dom";
import { boardTitle } from "../data/boardIds";
import { Header } from "../components/Header";
import styles from "./screens.module.css";

export function Board() {
  const { id } = useParams();
  const boardId = id ?? "";

  return (
    <section className={styles.screen} aria-labelledby="board-title">
      <Header
        title={boardTitle(boardId)}
        titleId="board-title"
        backTo="/saved"
      />
      <div className={styles.body}>
        <p className={styles.empty}>
          Nothing here yet. Tap the bookmark on any post to add it.
        </p>
        <nav className={styles.actions} aria-label="Board actions">
          <Link className={styles.action} to={`/board/${boardId}/similar`}>
            Find similar
          </Link>
          <Link className={styles.action} to={`/board/${boardId}/ideas`}>
            Develop an idea
          </Link>
          <Link className={styles.action} to="/brief">
            Brief
          </Link>
        </nav>
      </div>
    </section>
  );
}

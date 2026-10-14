import { Link, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { boardTitle } from "../data/boardIds";
import { useMoodboardStore } from "../store/useMoodboardStore";
import styles from "./screens.module.css";

export function Board() {
  const { id } = useParams();
  const boardId = id ?? "";
  const board = useMoodboardStore((state) =>
    state.boards.find((entry) => entry.id === boardId),
  );
  const title = board?.name ?? boardTitle(boardId);
  const subtitle = board
    ? `${board.items.length} saved · ${board.isPrivate ? "Private" : "Public"}`
    : undefined;

  return (
    <section className={styles.screen} aria-labelledby="board-title">
      <Header
        title={title}
        titleId="board-title"
        subtitle={subtitle}
        backTo="/saved"
      />
      <div className={styles.body}>
        {!board || board.items.length === 0 ? (
          <p className={styles.empty}>
            Nothing here yet. Tap the bookmark on any post to add it.
          </p>
        ) : null}
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

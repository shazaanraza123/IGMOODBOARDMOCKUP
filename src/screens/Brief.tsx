import { EmptyState } from "../components/EmptyState";
import { getPost } from "../data/posts";
import { Header } from "../components/Header";
import { useToast } from "../components/toastState";
import { directionPlainText, formatLine } from "../lib/ideas";
import { useMoodboardStore } from "../store/useMoodboardStore";
import styles from "./Brief.module.css";

export function Brief() {
  const briefs = useMoodboardStore((state) => state.briefs);
  const removeDirection = useMoodboardStore((state) => state.removeDirection);
  const { show } = useToast();

  const copy = async (title: string, text: string) => {
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      // Clipboard can be blocked. The toast still confirms the action.
    }
    show({ title });
  };

  return (
    <section className={styles.screen} aria-labelledby="brief-title">
      <Header title="Brief" titleId="brief-title" backTo="/saved" />
      {briefs.length === 0 ? (
        <EmptyState>Save a direction and it shows up here.</EmptyState>
      ) : (
        <ul className={styles.list}>
          {briefs.map((direction) => {
            const authors = direction.sourcePostIds
              .map((id) => getPost(id)?.author)
              .filter((author): author is string => Boolean(author));
            return (
              <li key={direction.id} className={styles.card}>
                <h2 className={styles.title}>{direction.title}</h2>
                <p className={styles.meta}>
                  {formatLine(direction.format, direction.structure.length)}
                </p>
                <ol className={styles.lines}>
                  {direction.structure.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ol>
                <p className={styles.sources}>
                  {authors.length > 0
                    ? `Sources: ${authors.map((author) => `@${author}`).join(", ")}`
                    : "Sources: none"}
                </p>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.primary}
                    onClick={() => {
                      void copy(
                        "Copied",
                        directionPlainText(direction, authors),
                      );
                    }}
                  >
                    Copy as text
                  </button>
                  <button
                    type="button"
                    className={styles.secondary}
                    onClick={() => removeDirection(direction.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

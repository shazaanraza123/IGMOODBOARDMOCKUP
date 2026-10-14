import { useEffect, useState } from "react";
import { Icon } from "./Icon";
import { getPost } from "../data/posts";
import { creditLine, formatLine } from "../lib/ideas";
import type { IdeaDirection } from "../types";
import styles from "./DirectionCard.module.css";

type DirectionCardProps = {
  direction: IdeaDirection;
  index: number;
  expanded: boolean;
  editing: boolean;
  saved: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDone: (next: { title: string; structure: string[] }) => void;
  onSave: () => void;
};

export function DirectionCard({
  direction,
  index,
  expanded,
  editing,
  saved,
  onToggle,
  onEdit,
  onDone,
  onSave,
}: DirectionCardProps) {
  const [title, setTitle] = useState(direction.title);
  const [lines, setLines] = useState(direction.structure);
  const label = `DIRECTION ${String(index + 1).padStart(2, "0")}`;
  const authors = direction.sourcePostIds
    .map((id) => getPost(id)?.author)
    .filter((author): author is string => Boolean(author));

  useEffect(() => {
    setTitle(direction.title);
    setLines(direction.structure);
  }, [direction, editing]);

  if (!expanded) {
    return (
      <li className={styles.card}>
        <button
          type="button"
          className={styles.collapsed}
          aria-expanded={false}
          onClick={onToggle}
        >
          <span>
            <span className={styles.kicker}>{label}</span>
            <span className={styles.collapsedTitle}>{direction.title}</span>
          </span>
          <Icon name="chevronRight" size={18} />
        </button>
      </li>
    );
  }

  const finish = () => {
    const nextTitle = title.trim() || direction.title;
    const nextLines = lines.map((line) => line.trim()).filter(Boolean);
    onDone({
      title: nextTitle,
      structure: nextLines.length > 0 ? nextLines : direction.structure,
    });
  };

  return (
    <li className={styles.card}>
      <div className={styles.top}>
        <p className={styles.kicker}>{label}</p>
        <button
          type="button"
          className={styles.chevron}
          aria-expanded
          aria-label={`Collapse ${direction.title}`}
          onClick={onToggle}
        >
          <Icon name="chevronRight" size={18} />
        </button>
      </div>
      {editing ? (
        <input
          className={styles.input}
          aria-label="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      ) : (
        <h2 className={styles.title}>{direction.title}</h2>
      )}
      <p className={styles.meta}>
        {formatLine(direction.format, direction.structure.length)}
      </p>
      {editing ? (
        <ol className={styles.lines}>
          {lines.map((line, lineIndex) => (
            <li key={lineIndex}>
              <input
                className={styles.input}
                aria-label={`Line ${lineIndex + 1}`}
                value={line}
                onChange={(event) => {
                  const next = [...lines];
                  next[lineIndex] = event.target.value;
                  setLines(next);
                }}
              />
            </li>
          ))}
        </ol>
      ) : (
        <ol className={styles.lines}>
          {direction.structure.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      )}
      <hr className={styles.divider} />
      <p className={styles.credits}>{creditLine(authors)}</p>
      <div className={styles.actions}>
        {editing ? (
          <button type="button" className={styles.primary} onClick={finish}>
            Done
          </button>
        ) : (
          <>
            <button
              type="button"
              className={styles.primary}
              disabled={saved}
              onClick={onSave}
            >
              {saved ? "Saved ✓" : "Save to brief"}
            </button>
            <button type="button" className={styles.secondary} onClick={onEdit}>
              Edit
            </button>
          </>
        )}
      </div>
    </li>
  );
}

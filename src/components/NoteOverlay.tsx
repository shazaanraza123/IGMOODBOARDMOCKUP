import styles from "./NoteOverlay.module.css";

type NoteOverlayProps = {
  text: string;
};

export function NoteOverlay({ text }: NoteOverlayProps) {
  return (
    <p className={styles.note}>
      <span className={styles.clamp}>{text}</span>
    </p>
  );
}

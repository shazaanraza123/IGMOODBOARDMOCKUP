import { Header, IconButton } from "../components/Header";
import { Icon } from "../components/Icon";
import styles from "./screens.module.css";

export function Saved() {
  return (
    <section className={styles.screen} aria-labelledby="saved-title">
      <Header
        title="Saved"
        titleId="saved-title"
        backTo="/"
        end={
          <>
            <IconButton label="New moodboard">
              <Icon name="plus" />
            </IconButton>
            <IconButton label="About" to="/about">
              <Icon name="info" />
            </IconButton>
          </>
        }
      />
      <div className={styles.body}>
        <p className={styles.empty}>Moodboards will show up here.</p>
      </div>
    </section>
  );
}

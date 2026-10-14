import { Header, IconButton } from "../components/Header";
import { Icon } from "../components/Icon";
import styles from "./screens.module.css";

export function Feed() {
  return (
    <section className={styles.screen} aria-labelledby="feed-title">
      <Header
        title="Instagram"
        titleId="feed-title"
        wordmark
        end={
          <IconButton label="Activity">
            <Icon name="heart" />
          </IconButton>
        }
      />
      <div className={styles.body}>
        <p className={styles.empty}>Posts will show up here.</p>
      </div>
    </section>
  );
}

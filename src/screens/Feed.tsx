import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { Header, IconButton } from "../components/Header";
import { Icon } from "../components/Icon";
import { PostCard } from "../components/PostCard";
import { feedPosts } from "../data/posts";
import { useMoodboardStore } from "../store/useMoodboardStore";
import { SaveSheet } from "../sheets/SaveSheet";
import type { Post } from "../types";
import styles from "./screens.module.css";

export function Feed() {
  const posts = feedPosts();
  const savedCount = useMoodboardStore((state) => state.savedIds.length);
  const nudgeDismissed = useMoodboardStore((state) => state.nudgeDismissed);
  const dismissNudge = useMoodboardStore((state) => state.dismissNudge);
  const focusRef = useRef<HTMLElement | null>(null);
  const [sheetPost, setSheetPost] = useState<Post | null>(null);
  const showNudge = savedCount >= 10 && !nudgeDismissed;

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
      {showNudge ? (
        <div className={styles.nudge}>
          <p className={styles.nudgeCopy}>
            You've saved 10 posts — organize them into a moodboard?
          </p>
          <div className={styles.nudgeActions}>
            <Link className={styles.nudgeGo} to="/saved">
              Organize
            </Link>
            <button
              type="button"
              className={styles.nudgeLater}
              onClick={dismissNudge}
            >
              Not now
            </button>
          </div>
        </div>
      ) : null}
      {posts.length === 0 ? (
        <div className={styles.body}>
          <EmptyState>Posts will show up here.</EmptyState>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onOpenSave={(bookmark) => {
              focusRef.current = bookmark;
              setSheetPost(post);
            }}
          />
        ))
      )}
      <SaveSheet
        post={sheetPost}
        returnFocusRef={focusRef}
        onClose={() => setSheetPost(null)}
      />
    </section>
  );
}

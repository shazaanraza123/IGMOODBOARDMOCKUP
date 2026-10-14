import { useRef, useState } from "react";
import { Header, IconButton } from "../components/Header";
import { Icon } from "../components/Icon";
import { PostCard } from "../components/PostCard";
import { feedPosts } from "../data/posts";
import { SaveSheet } from "../sheets/SaveSheet";
import type { Post } from "../types";
import styles from "./screens.module.css";

export function Feed() {
  const posts = feedPosts();
  const focusRef = useRef<HTMLElement | null>(null);
  const [sheetPost, setSheetPost] = useState<Post | null>(null);

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
      {posts.length === 0 ? (
        <div className={styles.body}>
          <p className={styles.empty}>Posts will show up here.</p>
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

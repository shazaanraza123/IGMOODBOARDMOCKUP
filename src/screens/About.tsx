import { useState } from "react";
import { Header } from "../components/Header";
import { useMoodboardStore } from "../store/useMoodboardStore";
import styles from "./About.module.css";

const REPO_URL = "https://github.com/shazaanraza123/IGMOODBOARDMOCKUP";

export function About() {
  const resetDemo = useMoodboardStore((state) => state.resetDemo);
  const [restored, setRestored] = useState(false);

  return (
    <section className={styles.screen} aria-labelledby="about-title">
      <Header title="About" titleId="about-title" backTo="/saved" />
      <div className={styles.body}>
        <p className={styles.lead}>
          Instagram's Saved tab is where inspiration gets lost. Moodboard turns
          Saved into a workspace for finding more of what you like, and for
          making something of your own.
        </p>

        <h2 className={styles.section}>Two flows</h2>
        <h3 className={styles.sub}>Flow A</h3>
        <p className={styles.copy}>
          I like this. Help me find more of it. Save a post, keep a note, and
          pick the details you want more of.
        </p>
        <h3 className={styles.sub}>Flow B</h3>
        <p className={styles.copy}>
          This inspires me. Help me make something of my own. Group a creator
          board, then write directions from only those posts.
        </p>

        <h2 className={styles.section}>Three result labels</h2>
        <p className={styles.copy}>
          Exact match is rare on purpose. It shows only when a product is
          tagged, it has every detail you picked, and it is the same kind of
          post.
        </p>
        <p className={styles.copy}>
          Similar product is tagged, but it misses something you asked for.
          Inspiration has no product tag. It is a reference, not a shop result.
        </p>

        <h2 className={styles.section}>Notes stay on the save</h2>
        <p className={styles.copy}>
          A note belongs to that post on that board. Saving never forces you to
          pick a moodboard, and taking a post off a board does not unsave it.
        </p>

        <h2 className={styles.section}>No new tab</h2>
        <p className={styles.copy}>
          Moodboards live in Saved, beside All posts and Collections. The tab
          bar stays the one you already know.
        </p>

        <h2 className={styles.section}>Help, when you want it</h2>
        <p className={styles.copy}>
          Find similar and Develop an idea are optional. You can organize a
          board and never generate a thing.
        </p>

        <p className={styles.disclaimer}>
          Independent concept by Shazaan Raza. Not affiliated with or endorsed
          by Instagram or Meta.
        </p>

        <button
          type="button"
          className={styles.reset}
          onClick={() => {
            resetDemo();
            setRestored(true);
          }}
        >
          Reset demo data
        </button>
        {restored ? (
          <p className={styles.confirm}>Demo data restored.</p>
        ) : null}

        <a className={styles.repo} href={REPO_URL}>
          GitHub repo
        </a>
      </div>
    </section>
  );
}

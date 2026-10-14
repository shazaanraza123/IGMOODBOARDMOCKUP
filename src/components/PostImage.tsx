import { useEffect, useState } from "react";
import styles from "./PostImage.module.css";

type PostImageProps = {
  image: string;
  imageAlt: string;
  tint: string;
  width: number;
  height: number;
};

export function PostImage({
  image,
  imageAlt,
  tint,
  width,
  height,
}: PostImageProps) {
  const [failed, setFailed] = useState(image === "");

  useEffect(() => {
    setFailed(image === "");
  }, [image]);

  const showImage = image !== "" && !failed;

  return (
    <div
      className={styles.frame}
      style={{ background: tint, aspectRatio: `${width} / ${height}` }}
      role={showImage ? undefined : "img"}
      aria-label={showImage ? undefined : imageAlt}
    >
      {showImage ? (
        <img
          src={image}
          alt={imageAlt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className={styles.label} aria-hidden="true">
          PHOTO · {imageAlt}
        </span>
      )}
    </div>
  );
}

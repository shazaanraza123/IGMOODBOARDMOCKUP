import type { ReactNode } from "react";
import type { IconName } from "./iconNames";

type IconProps = {
  name: IconName;
  size?: number;
  filled?: boolean;
};

export function Icon({ name, size = 24, filled = false }: IconProps) {
  const solid = filled || name === "bookmarkFilled";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={solid ? "currentColor" : "none"}
      stroke={solid ? "none" : "currentColor"}
      strokeWidth={solid ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {glyph(name)}
    </svg>
  );
}

function glyph(name: IconName): ReactNode {
  switch (name) {
    case "home":
      return (
        <path d="M4.2 10.7 12 4l7.8 6.7V20a1 1 0 0 1-1 1h-4.6v-6.2H9.8V21H5.2a1 1 0 0 1-1-1z" />
      );
    case "reels":
      return (
        <>
          <rect x="3.5" y="5" width="17" height="14" rx="3" />
          <path d="M10 9.2v5.6l5.2-2.8z" />
        </>
      );
    case "messages":
      return <path d="M6.2 17.2 4.5 20.5l3.8-1.3A8.5 8.5 0 1 0 6.2 17.2z" />;
    case "search":
      return (
        <>
          <circle cx="11" cy="11" r="6.25" />
          <path d="m15.8 15.8 4 4" />
        </>
      );
    case "profile":
      return (
        <>
          <circle cx="12" cy="12" r="8.25" />
          <circle cx="12" cy="10" r="2.6" />
          <path d="M7.1 17.6a5.2 5.2 0 0 1 9.8 0" />
        </>
      );
    case "heart":
      return (
        <path d="M12 19.2c-4.6-2.8-6.8-5.6-6.8-8.2A3.4 3.4 0 0 1 8.8 7.4c1.3 0 2.3.6 3.2 1.7.9-1.1 1.9-1.7 3.2-1.7a3.4 3.4 0 0 1 3.6 3.6c0 2.6-2.2 5.4-6.8 8.2z" />
      );
    case "comment":
      return <path d="M6 17 4.2 20.6l4-1.4A8.6 8.6 0 1 0 6 17z" />;
    case "share":
      return (
        <>
          <path d="M21 4 3.5 10.8l7.2 2.5L13.2 20.5 21 4z" />
          <path d="m10.6 13.4 10.4-9.4" />
        </>
      );
    case "bookmark":
    case "bookmarkFilled":
      return (
        <path d="M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.4L6 20V5.5a1 1 0 0 1 1-1z" />
      );
    case "back":
      return <path d="M14.5 5.5 8 12l6.5 6.5" />;
    case "plus":
      return <path d="M12 5.5v13M5.5 12h13" />;
    case "more":
      return (
        <>
          <circle cx="6" cy="12" r="1.15" fill="currentColor" stroke="none" />
          <circle cx="12" cy="12" r="1.15" fill="currentColor" stroke="none" />
          <circle cx="18" cy="12" r="1.15" fill="currentColor" stroke="none" />
        </>
      );
    case "check":
      return <path d="M5 12.5 9.2 16.8 19 7.2" />;
    case "sparkle":
      return (
        <path d="M12 3.2 13.7 9l5.8 1.3-5.8 1.4L12 17.5l-1.7-5.8L4.5 10.3 10.3 9z" />
      );
    case "info":
      return (
        <>
          <circle cx="12" cy="12" r="8.25" />
          <path d="M12 11v5.2" />
          <circle cx="12" cy="8" r="0.9" fill="currentColor" stroke="none" />
        </>
      );
    case "chevronRight":
      return <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />;
    case "note":
      return (
        <>
          <path d="M7 4h7.2L18 7.8V19a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
          <path d="M14 4.2V8h3.8" />
          <path d="M9 12.2h6M9 15.5h4" />
        </>
      );
    case "close":
      return <path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" />;
  }
}

export const iconNames = [
  "home",
  "reels",
  "messages",
  "search",
  "profile",
  "heart",
  "comment",
  "share",
  "bookmark",
  "bookmarkFilled",
  "back",
  "plus",
  "more",
  "check",
  "sparkle",
  "info",
  "chevronRight",
  "note",
  "close",
] as const;

export type IconName = (typeof iconNames)[number];

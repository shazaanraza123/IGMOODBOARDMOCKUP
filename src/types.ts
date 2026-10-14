export type Attribute =
  | "tall-shaft"
  | "ankle"
  | "distressed-leather"
  | "smooth-leather"
  | "suede"
  | "square-toe"
  | "round-toe"
  | "pointed-toe"
  | "metal-hardware"
  | "buckle"
  | "black"
  | "brown"
  | "cream"
  | "low-heel"
  | "block-heel"
  | "platform"
  | "stage-lighting"
  | "archival-photo"
  | "carousel-layout"
  | "minimal-set"
  | "crowd-shot"
  | "behind-the-scenes"
  | "typography"
  | "monochrome";

export type ResultKind = "exact-product" | "similar-product" | "inspiration";

export type FocusBox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export interface Post {
  id: string;
  author: string;
  authorName?: string;
  caption: string;
  image: string;
  imageAlt: string;
  tint: string;
  attributes: Attribute[];
  category: "footwear" | "stage" | "fashion" | "packaging";
  productTag?: { name: string; brand: string; url?: string };
  likes: number;
  comments: number;
  focus?: FocusBox;
}

export interface BoardItem {
  postId: string;
  addedAt: number;
  note?: string;
  shortlisted?: boolean;
}

export interface Board {
  id: string;
  name: string;
  kind: "shopping" | "creator" | "general";
  isPrivate: boolean;
  items: BoardItem[];
  createdAt: number;
  updatedAt: number;
}

export interface IdeaDirection {
  id: string;
  format: "carousel" | "reel" | "campaign";
  title: string;
  summary: string;
  structure: string[];
  sourcePostIds: string[];
  savedToBrief: boolean;
}

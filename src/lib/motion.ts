export const PAGE_TRANSITION_S = 0.22;

type Fade = { opacity: number };
type Slide = { x: string };

export type PageVariants = {
  initial: Fade | ((direction: number) => Slide);
  animate: Fade | Slide;
  exit: Fade | ((direction: number) => Slide);
};

export function pageVariants(reduced: boolean): PageVariants {
  if (reduced) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }

  return {
    initial: (direction: number) => ({
      x: direction >= 0 ? "100%" : "-100%",
    }),
    animate: { x: "0%" },
    exit: (direction: number) => ({
      x: direction >= 0 ? "-100%" : "100%",
    }),
  };
}

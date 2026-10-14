import { describe, expect, it } from "vitest";
import { PAGE_TRANSITION_S, pageVariants } from "../lib/motion";

describe("page motion", () => {
  it("slides in the direction of the navigation", () => {
    const variants = pageVariants(false);
    expect(PAGE_TRANSITION_S).toBe(0.22);
    expect(typeof variants.initial).toBe("function");
    expect(typeof variants.exit).toBe("function");
    if (typeof variants.initial !== "function") return;
    if (typeof variants.exit !== "function") return;
    expect(variants.initial(1)).toEqual({ x: "100%" });
    expect(variants.initial(-1)).toEqual({ x: "-100%" });
    expect(variants.exit(1)).toEqual({ x: "-100%" });
    expect(variants.exit(-1)).toEqual({ x: "100%" });
    expect(variants.animate).toEqual({ x: "0%" });
  });

  it("fades instead of sliding when motion is reduced", () => {
    expect(pageVariants(true)).toEqual({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    });
  });
});

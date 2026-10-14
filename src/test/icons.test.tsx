import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "../components/Icon";
import { iconNames } from "../components/iconNames";

describe("Icon", () => {
  it("draws every icon in the set", () => {
    for (const name of iconNames) {
      const view = render(<Icon name={name} />);
      expect(view.container.querySelector("svg")).not.toBeNull();
      view.unmount();
    }
  });

  it("fills the bookmark when asked", () => {
    const view = render(<Icon name="bookmarkFilled" />);
    const svg = view.container.querySelector("svg");
    expect(svg?.getAttribute("fill")).toBe("currentColor");
  });
});

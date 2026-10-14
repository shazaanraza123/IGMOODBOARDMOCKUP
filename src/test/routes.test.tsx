import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { App } from "../App";
import { routerFuture } from "../routerFuture";
import { useMoodboardStore } from "../store/useMoodboardStore";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]} future={routerFuture}>
      <App />
    </MemoryRouter>,
  );
}

describe("routes", () => {
  it("opens every screen", () => {
    const cases: Array<[string, string]> = [
      ["/", "Instagram"],
      ["/saved", "Saved"],
      ["/board/b-boots", "Boot research"],
      ["/board/b-stage", "Stage design refs"],
      ["/board/b-stage/similar", "Find similar"],
      ["/board/b-stage/ideas", "Develop an idea"],
      ["/brief", "Brief"],
      ["/about", "About"],
    ];

    for (const [path, title] of cases) {
      const view = renderAt(path);
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
      expect(
        screen.getByRole("navigation", { name: "Primary" }),
      ).toBeInTheDocument();
      view.unmount();
    }
  });

  it("can be walked from the frame links and the tab bar", async () => {
    const user = userEvent.setup();
    renderAt("/");

    expect(screen.getByTestId("device-frame")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Instagram Moodboard · independent concept · tap through Flow A or Flow B",
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Start Flow B" }));
    expect(
      screen.getByRole("heading", { name: "Stage design refs" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Find similar" }));
    expect(
      screen.getByRole("heading", { name: "Find similar" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Back" }));
    await user.click(screen.getByRole("link", { name: "Develop an idea" }));
    expect(
      screen.getByRole("heading", { name: "Develop an idea" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Back" }));
    await user.click(screen.getByRole("link", { name: "Brief" }));
    expect(screen.getByRole("heading", { name: "Brief" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Profile" }));
    expect(screen.getByRole("heading", { name: "Saved" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "About" }));
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Independent concept by Shazaan Raza. Not affiliated with or endorsed by Instagram or Meta.",
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Start Flow A" }));
    expect(
      screen.getByRole("heading", { name: "Instagram" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("tells you Reels, Messages, and Search are outside the concept", async () => {
    const user = userEvent.setup();
    renderAt("/");

    await user.click(screen.getByRole("button", { name: "Reels" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Not part of this concept",
    );

    await user.click(screen.getByRole("button", { name: "Messages" }));
    expect(
      screen.getByRole("heading", { name: "Instagram" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Not part of this concept",
    );
  });

  it("shows the seeded count on a board and can reset the demo", async () => {
    const user = userEvent.setup();
    const missing = renderAt("/board/missing");
    expect(
      screen.getByRole("heading", { name: "Moodboard" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Nothing here yet/)).toBeInTheDocument();
    missing.unmount();

    useMoodboardStore.getState().deleteBoard("b-stage");
    const about = renderAt("/about");
    await user.click(screen.getByRole("button", { name: "Reset demo data" }));
    expect(screen.getByText("Demo data restored.")).toBeInTheDocument();
    expect(
      useMoodboardStore
        .getState()
        .boards.some((entry) => entry.id === "b-stage"),
    ).toBe(true);
    about.unmount();

    renderAt("/board/b-stage");
    expect(
      screen.getByRole("heading", { name: "Stage design refs" }),
    ).toBeInTheDocument();
    expect(screen.getByText("12 saved · Private")).toBeInTheDocument();
    expect(screen.queryByText(/Nothing here yet/)).not.toBeInTheDocument();
  });

  it("keeps the flow links outside the phone frame", () => {
    renderAt("/");
    const frame = screen.getByTestId("device-frame");
    expect(frame).not.toHaveTextContent("Start Flow A");
    expect(frame).not.toHaveTextContent("Start Flow B");
  });
});

describe("device frame", () => {
  it("shows the phone frame above 600px", () => {
    const css = readFileSync(
      resolve(process.cwd(), "src/components/DeviceFrame.module.css"),
      "utf8",
    );
    expect(css).toMatch(/min-width:\s*601px/);
    expect(css).toContain("width: 390px");
    expect(css).toContain("height: 844px");
    expect(css).toContain("border-radius: 48px");
    expect(css.toLowerCase()).toContain("#2a2a2a");
    expect(css.toLowerCase()).toContain("#0b0b0b");
  });
});

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
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

beforeEach(async () => {
  localStorage.clear();
  useMoodboardStore.getState().resetDemo();
  await useMoodboardStore.persist.rehydrate();
});

describe("creator flow", () => {
  it("filters Stage design refs and saves the first carousel direction", async () => {
    const user = userEvent.setup();
    renderAt("/board/b-stage");
    expect(screen.getByText("Suggested groups")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Stage lighting · 8" }),
    ).toHaveAttribute("aria-pressed", "false");

    await user.click(
      screen.getByRole("button", { name: "Stage lighting · 8" }),
    );
    expect(
      screen.queryByRole("img", {
        name: "An empty stage with type proofs piled under a work light",
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "A dark stage with a single hard side light on an empty platform",
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Stage lighting · 8" }),
    );
    await user.click(screen.getByRole("link", { name: "Develop an idea" }));
    expect(
      screen.getByRole("heading", { name: "Develop an idea" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Carousel" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByText("Three directions will appear here."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Only uses posts on this board."),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Generate 3 directions" }),
    );
    expect(
      await screen.findByRole(
        "heading",
        { name: "The evolution of a stage" },
        { timeout: 3000 },
      ),
    ).toBeInTheDocument();

    const cards = screen
      .getAllByRole("listitem")
      .filter((item) => /DIRECTION \d/.test(item.textContent ?? ""));
    expect(
      within(cards[0]!).getByRole("heading", {
        name: "The evolution of a stage",
      }),
    ).toBeInTheDocument();
    expect(cards[0]).toHaveTextContent("Carousel · 7 slides");
    expect(cards[0]).toHaveTextContent("Opening comparison, then vs now");
    expect(cards[0]).toHaveTextContent(/Credits 5 sources:/);
    expect(
      within(cards[1]!).getByRole("button", {
        name: /Setup day, behind the scenes/,
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Edit" }));
    const title = screen.getByRole("textbox", { name: "Title" });
    await user.clear(title);
    await user.type(title, "Stage eras");
    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(
      screen.getByRole("heading", { name: "Stage eras" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Save to brief" }));
    expect(screen.getByRole("button", { name: "Saved ✓" })).toBeDisabled();
    expect(useMoodboardStore.getState().briefs[0]?.title).toBe("Stage eras");
    expect(localStorage.getItem("moodboard-v1")).toContain("Stage eras");

    await user.click(screen.getByRole("link", { name: "Back" }));
    await user.click(screen.getByRole("button", { name: "More" }));
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("link", { name: "Brief" }));
    expect(
      screen.getByRole("heading", { name: "Stage eras" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Carousel · 7 slides/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Copy as text" }));
    expect(screen.getByRole("status")).toHaveTextContent("Copied");

    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(
      screen.getByText(
        "Save a direction and it shows up here, from Develop an idea on any creator board.",
      ),
    ).toBeInTheDocument();
    expect(useMoodboardStore.getState().briefs).toEqual([]);
  });

  it("marks selected references and closes from Done", async () => {
    const user = userEvent.setup();
    renderAt("/board/b-stage/ideas");
    await user.click(
      screen.getByRole("button", { name: "Based on 5 references" }),
    );
    const dialog = screen.getByRole("dialog", { name: "References" });
    expect(within(dialog).getByText("5 of 12 selected")).toBeInTheDocument();
    const unselected = within(dialog).getAllByRole("button", {
      pressed: false,
    });
    expect(unselected.length).toBeGreaterThan(0);
    await user.click(unselected[0]!);
    expect(within(dialog).getByText("6 of 12 selected")).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Done" }));
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "References" }),
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: "Based on 6 references" }),
    ).toBeInTheDocument();
  });
});

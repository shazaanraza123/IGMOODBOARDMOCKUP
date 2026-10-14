import { render, screen, within } from "@testing-library/react";
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

function boot(id: string) {
  return useMoodboardStore.getState().boards.find((board) => board.id === id);
}

beforeEach(async () => {
  localStorage.clear();
  useMoodboardStore.getState().resetDemo();
  await useMoodboardStore.persist.rehydrate();
});

describe("find similar screen", () => {
  it("puts the closest boots first and saves one onto Boot research", async () => {
    const user = userEvent.setup();
    renderAt("/board/b-boots/similar");

    expect(
      screen.getByRole("heading", { name: "Find similar" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tall shaft" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByRole("button", { name: "Distressed leather" }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Tall shaft" }));
    await user.click(
      screen.getByRole("button", { name: "Distressed leather" }),
    );
    expect(
      screen.getByText("Pick at least one thing you like."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tall shaft" }));
    await user.click(
      screen.getByRole("button", { name: "Distressed leather" }),
    );

    const cards = () => screen.getAllByRole("listitem");
    expect(within(cards()[0]!).getByRole("button")).toHaveAccessibleName(
      /Rowan Bootmakers/,
    );
    expect(cards()[0]).toHaveTextContent("Exact match");
    expect(cards()[0]).toHaveTextContent("via tagged post");
    expect(cards()[1]).toHaveTextContent("Exact match");
    expect(cards()[2]).toHaveTextContent("Similar product");
    expect(cards()[2]).not.toHaveTextContent("Exact match");
    expect(cards()[3]).toHaveTextContent("Inspiration");
    expect(cards()[3]).toHaveTextContent("flea.found");
    expect(cards()[3]).not.toHaveTextContent("Exact match");
    expect(
      screen.getByText('"Exact match" only shows when a product is tagged.'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Inspiration" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByRole("listitem")).toHaveTextContent("flea.found");
    expect(screen.getByRole("listitem")).not.toHaveTextContent("Exact match");

    await user.click(screen.getByRole("tab", { name: "All" }));
    await user.click(screen.getByRole("button", { name: /Rowan Bootmakers/ }));
    await user.click(
      screen.getByRole("button", { name: "Save to this board" }),
    );
    expect(screen.getByRole("button", { name: "Saved" })).toBeDisabled();
    expect(
      boot("b-boots")?.items.some((item) => item.postId === "p-rowan"),
    ).toBe(true);

    await user.click(screen.getByRole("button", { name: "Shortlist" }));
    expect(
      boot("b-boots")?.items.find((item) => item.postId === "p-rowan")
        ?.shortlisted,
    ).toBe(true);
    expect(
      screen.queryByRole("button", { name: /Rowan Bootmakers/ }),
    ).not.toBeInTheDocument();
  });
});

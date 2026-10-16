import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "../App";
import { posts } from "../data/posts";
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
      screen.getAllByRole("heading", { name: "Find similar" }),
    ).toHaveLength(1);
    expect(
      screen.getByRole("group", { name: "Focus region" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Drag the frame over the part you mean."),
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
    expect(cards()[2]).toHaveTextContent("Similar products");
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

  it("leads stage results with stage posts that are not already on the board", () => {
    renderAt("/board/b-stage/similar");
    const cards = screen.getAllByRole("listitem");
    expect(cards[0]).toHaveTextContent("rig.notes");
    expect(
      cards
        .slice(0, 8)
        .map((card) => card.textContent)
        .join(" "),
    ).not.toMatch(/cloth\.notes|form\.archive|paper\.goods|packing\.room/);
    expect(
      screen.queryByText("Few close matches yet. Showing related posts."),
    ).not.toBeInTheDocument();
  });

  it("says there are few close matches when under three share the category", () => {
    const off = new Set(["p-stage-13", "p-stage-14"]);
    const items = posts
      .filter((post) => post.category === "stage" && !off.has(post.id))
      .map((post, index) => ({ postId: post.id, addedAt: index }));
    useMoodboardStore.setState({
      boards: useMoodboardStore
        .getState()
        .boards.map((board) =>
          board.id === "b-stage" ? { ...board, items } : board,
        ),
    });
    renderAt("/board/b-stage/similar?post=p-stage-01");
    expect(
      screen.getByText("Few close matches yet. Showing related posts."),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBeGreaterThan(2);
  });
});

import { render, screen, waitFor } from "@testing-library/react";
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

describe("saved search", () => {
  it("finds a post by its note text", async () => {
    const user = userEvent.setup();
    renderAt("/saved");

    expect(screen.getByRole("tab", { name: "Moodboards" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByRole("link", { name: /Boot research/ }),
    ).toBeInTheDocument();

    await user.type(
      screen.getByRole("textbox", { name: "Search boards, posts and notes" }),
      "shaft height",
    );

    expect(screen.getByRole("heading", { name: "Posts" })).toBeInTheDocument();
    expect(
      screen.getByText("The shaft height is the thing. Want more like this."),
    ).toBeInTheDocument();
    expect(screen.getByText("cobbler.notes")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Boards" }),
    ).not.toBeInTheDocument();

    await user.clear(
      screen.getByRole("textbox", { name: "Search boards, posts and notes" }),
    );
    await user.type(
      screen.getByRole("textbox", { name: "Search boards, posts and notes" }),
      "zzzz-not-a-style",
    );
    expect(
      screen.getByText(
        'Nothing matches "zzzz-not-a-style". Try a style, like square toe.',
      ),
    ).toBeInTheDocument();
  });

  it("shows the old collections grid and can make a moodboard", async () => {
    const user = userEvent.setup();
    renderAt("/saved");

    await user.click(screen.getByRole("tab", { name: "Collections" }));
    expect(
      screen.getByText("This is how Saved works today."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Moodboards" }));
    await user.click(screen.getByRole("button", { name: "New moodboard" }));
    await user.type(screen.getByLabelText("Moodboard name"), "Night desk");
    await user.click(screen.getByRole("button", { name: "Create" }));

    const created = useMoodboardStore
      .getState()
      .boards.find((board) => board.name === "Night desk");
    expect(created).toMatchObject({
      kind: "general",
      isPrivate: true,
      items: [],
    });
    expect(screen.getByText("Night desk")).toBeInTheDocument();
  });
});

describe("board", () => {
  it("filters notes and can shortlist, move, and remove a post", async () => {
    const user = userEvent.setup();
    renderAt("/board/b-boots");

    await user.click(screen.getByRole("button", { name: "Notes (3)" }));
    expect(
      screen.getByText(/The shaft height is the thing/),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /worn leather and metal hardware/ }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Notes (3)" }));
    const hero = screen.getByRole("button", {
      name: /worn leather and metal hardware/,
    });
    await user.click(hero);
    expect(
      screen.getByRole("dialog", { name: "archive.objects" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Shortlist" }));
    expect(
      screen.getByRole("button", { name: "Remove from shortlist" }),
    ).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Move to…" }));
    await user.click(screen.getByRole("button", { name: "Summer fits" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      useMoodboardStore
        .getState()
        .boards.find((board) => board.id === "b-summer")
        ?.items.some((item) => item.postId === "p-hero"),
    ).toBe(true);
    expect(
      useMoodboardStore
        .getState()
        .boards.find((board) => board.id === "b-boots")
        ?.items.some((item) => item.postId === "p-hero"),
    ).toBe(false);

    await user.click(screen.getByRole("button", { name: /scuffed leather/ }));
    const note = screen.getByLabelText("Note");
    await user.clear(note);
    await user.type(note, "Keep the proportion.");
    expect(
      useMoodboardStore
        .getState()
        .boards.find((board) => board.id === "b-boots")
        ?.items.find((item) => item.postId === "p-boot-shaft")?.note,
    ).toBe("Keep the proportion.");

    await user.click(screen.getByRole("button", { name: "Remove from board" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", { name: /scuffed leather/ }),
    ).not.toBeInTheDocument();
    expect(useMoodboardStore.getState().savedIds).toContain("p-boot-shaft");
  });

  it("copies a link and can make a board public", async () => {
    const user = userEvent.setup();
    renderAt("/board/b-boots");

    await user.click(screen.getByRole("button", { name: "More" }));
    await user.click(screen.getByRole("button", { name: "Share link" }));
    expect(screen.getByRole("status")).toHaveTextContent("Link copied");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "More" }));
    await user.click(screen.getByRole("button", { name: "Make public" }));
    expect(screen.getByText("18 saved · Public")).toBeInTheDocument();
  });

  it("asks before deleting a moodboard", async () => {
    const user = userEvent.setup();
    renderAt("/saved");

    await user.click(
      screen.getByRole("button", { name: "Options for Packaging ideas" }),
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByText("Delete Packaging ideas?")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByRole("button", { name: "Rename" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "Options for Packaging ideas" }),
      ).not.toBeInTheDocument();
    });
    expect(
      useMoodboardStore
        .getState()
        .boards.some((board) => board.id === "b-packaging"),
    ).toBe(false);
    expect(useMoodboardStore.getState().savedIds.length).toBeGreaterThan(0);
  });
});

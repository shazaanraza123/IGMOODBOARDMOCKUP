import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../App";
import { routerFuture } from "../routerFuture";
import { MOODBOARD_STORAGE_KEY } from "../store/storage";
import { useMoodboardStore } from "../store/useMoodboardStore";

const NOTE = "The shaft is the whole reason.";

function renderFeed() {
  return render(
    <MemoryRouter initialEntries={["/"]} future={routerFuture}>
      <App />
    </MemoryRouter>,
  );
}

function heroSave() {
  const button = screen.getAllByRole("button", { name: "Save" })[0];
  if (!button) throw new Error("Missing save button");
  return button;
}

beforeEach(async () => {
  localStorage.clear();
  useMoodboardStore.getState().resetDemo();
  await useMoodboardStore.persist.rehydrate();
});

describe("save flow", () => {
  it("saves the hero post onto a new board with a note", async () => {
    const user = userEvent.setup();
    renderFeed();

    expect(
      screen.getByText(
        "Found these at a flea market. No idea of the brand, anyone know?",
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(7);
    expect(heroSave()).toHaveAttribute("aria-pressed", "true");

    await user.click(heroSave());
    expect(heroSave()).toHaveAttribute("aria-pressed", "false");

    await user.click(heroSave());
    expect(screen.getByRole("status")).toHaveTextContent("Saved");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Add it to a moodboard?",
    );

    await user.click(screen.getByRole("button", { name: "Choose" }));
    expect(
      screen.getByRole("dialog", { name: "Save to moodboard" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("navigation", { name: "Primary" }),
    ).not.toBeInTheDocument();

    const bootResearch = screen.getByRole("button", { name: /Boot research/ });
    expect(bootResearch).toHaveAttribute("aria-pressed", "true");
    await user.click(bootResearch);
    expect(bootResearch).toHaveAttribute("aria-pressed", "false");

    await user.click(screen.getByRole("button", { name: "New moodboard" }));
    await user.type(
      screen.getByPlaceholderText("Moodboard name"),
      "Night saves",
    );
    await user.click(screen.getByRole("button", { name: "Create" }));
    const created = screen.getByRole("button", { name: /Night saves/ });
    expect(created).toHaveAttribute("aria-pressed", "true");

    const note = screen.getByLabelText("Add a note (optional)");
    await user.type(note, NOTE);
    expect(screen.getByText(`${NOTE.length}/140`)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Save to moodboard" }),
      ).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Saved to Night saves",
      );
    });
    expect(heroSave()).toHaveFocus();

    const night = () =>
      useMoodboardStore
        .getState()
        .boards.find((board) => board.name === "Night saves");
    expect(night()).toMatchObject({ kind: "general", isPrivate: true });
    expect(night()?.items).toEqual([
      expect.objectContaining({ postId: "p-hero", note: NOTE }),
    ]);
    expect(
      useMoodboardStore
        .getState()
        .boards.find((board) => board.id === "b-boots")
        ?.items.some((item) => item.postId === "p-hero"),
    ).toBe(false);
    expect(useMoodboardStore.getState().savedIds).toContain("p-hero");

    const snapshot = localStorage.getItem(MOODBOARD_STORAGE_KEY);
    expect(snapshot).toContain("Night saves");
    expect(snapshot).toContain(NOTE);
    useMoodboardStore.setState({ boards: [], savedIds: [], briefs: [] });
    localStorage.setItem(MOODBOARD_STORAGE_KEY, snapshot ?? "");
    await useMoodboardStore.persist.rehydrate();

    const restored = useMoodboardStore
      .getState()
      .boards.find((board) => board.name === "Night saves");
    expect(restored?.items).toEqual([
      expect.objectContaining({ postId: "p-hero", note: NOTE }),
    ]);
    expect(useMoodboardStore.getState().savedIds).toContain("p-hero");
  });

  it("opens the sheet on a long press without unsaving", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    try {
      renderFeed();
      const save = heroSave();
      expect(save).toHaveAttribute("aria-pressed", "true");
      fireEvent.pointerDown(save, { button: 0, pointerId: 1 });
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });
      expect(
        screen.getByRole("dialog", { name: "Save to moodboard" }),
      ).toBeInTheDocument();
      expect(save).toHaveAttribute("aria-pressed", "true");
      fireEvent.click(save);
      expect(save).toHaveAttribute("aria-pressed", "true");
    } finally {
      vi.useRealTimers();
    }
  });

  it("closes the save sheet with Escape", async () => {
    const user = userEvent.setup();
    renderFeed();
    await user.click(heroSave());
    await user.click(heroSave());
    await user.click(screen.getByRole("button", { name: "Choose" }));
    expect(
      screen.getByRole("dialog", { name: "Save to moodboard" }),
    ).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Save to moodboard" }),
      ).not.toBeInTheDocument();
    });
    expect(heroSave()).toHaveFocus();
  });
});

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PostImage } from "../components/PostImage";

describe("PostImage", () => {
  it("shows a tinted placeholder when there is no file", () => {
    render(
      <PostImage
        image=""
        imageAlt="Black tall boots"
        tint="#3a312b"
        width={200}
        height={200}
      />,
    );
    expect(screen.getByRole("img", { name: "Black tall boots" })).toHaveStyle({
      background: "#3a312b",
    });
    expect(screen.getByText("PHOTO · Black tall boots")).toBeInTheDocument();
    expect(document.querySelector("img")).toBeNull();
  });

  it("falls back when the image fails to load", () => {
    render(
      <PostImage
        image="/images/p-hero.jpg"
        imageAlt="Black tall-shaft boots"
        tint="#3a312b"
        width={300}
        height={300}
      />,
    );
    const image = screen.getByRole("img", { name: "Black tall-shaft boots" });
    expect(image).toHaveAttribute("src", "/images/p-hero.jpg");
    expect(image).toHaveAttribute("width", "300");
    expect(image).toHaveAttribute("height", "300");
    fireEvent.error(image);
    expect(
      screen.getByText("PHOTO · Black tall-shaft boots"),
    ).toBeInTheDocument();
  });
});

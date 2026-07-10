import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/main.jsx";

describe("App", () => {
  it("uses the visible brand text as its accessible name", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: /BSC Blackheath Sports Club/i })).toHaveAttribute("href", "#main-content");
  });

  it("opens and closes the mobile navigation", async () => {
    const { container } = render(<App />);
    const toggle = container.querySelector(".nav-toggle");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-label", "Close navigation");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByRole("link", { name: "Membership" }));
    expect(toggle).toHaveAttribute("aria-label", "Open navigation");
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("does not expose the media section until a video exists", () => {
    render(<App />);
    expect(screen.queryByRole("heading", { name: /Photos now, video-ready/i })).not.toBeInTheDocument();
  });
});

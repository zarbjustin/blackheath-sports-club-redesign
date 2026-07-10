import React from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Enquiry } from "../src/main.jsx";

function renderEnquiry() {
  return render(
    <LazyMotion features={domAnimation}>
      <Enquiry />
    </LazyMotion>,
  );
}

async function completeRequiredFields(user) {
  await user.type(screen.getByLabelText(/Name/), "Alex Morgan");
  await user.type(screen.getByLabelText(/Email/), "alex@example.com");
  await user.type(screen.getByLabelText(/Message/), "Please send venue availability.");
  await user.click(screen.getByRole("checkbox", { name: /happy for the club/i }));
}

afterEach(() => vi.unstubAllGlobals());

describe("Enquiry", () => {
  it("requires the anti-spam check before sending", async () => {
    const user = userEvent.setup();
    renderEnquiry();
    await completeRequiredFields(user);

    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("complete the anti-spam check");
  });

  it("submits a bounded payload and shows success", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    vi.stubGlobal("fetch", fetchMock);
    renderEnquiry();
    await completeRequiredFields(user);
    await user.click(screen.getByTestId("captcha"));

    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    expect(await screen.findByRole("status")).toHaveTextContent("your enquiry is on its way");
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload).toMatchObject({
      email: "alex@example.com",
      "h-captcha-response": "test-captcha-token",
      botcheck: false,
    });
  });

  it("keeps a useful fallback when the provider rejects a request", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ success: false, message: "Please try later." }),
    }));
    renderEnquiry();
    await completeRequiredFields(user);
    await user.click(screen.getByTestId("captcha"));
    await user.click(screen.getByRole("button", { name: "Send enquiry" }));

    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Please try later."));
    expect(screen.getByRole("link", { name: /bhsportsclub/i })).toHaveAttribute("href", "mailto:bhsportsclub@outlook.com");
  });
});

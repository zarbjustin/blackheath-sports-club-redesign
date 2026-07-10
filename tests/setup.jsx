import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(cleanup);

vi.mock("virtual:pwa-register", () => ({ registerSW: vi.fn() }));

vi.mock("@hcaptcha/react-hcaptcha", async () => {
  const React = await import("react");
  return {
    default: React.forwardRef(function CaptchaMock({ onVerify }, ref) {
      React.useImperativeHandle(ref, () => ({ resetCaptcha: vi.fn() }));
      return (
        <button type="button" data-testid="captcha" onClick={() => onVerify("test-captcha-token")}>
          Complete anti-spam check
        </button>
      );
    }),
  };
});

window.matchMedia = vi.fn().mockImplementation((query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback;
  }
  observe(target) {
    this.callback([{ isIntersecting: true, target }]);
  }
  unobserve() {}
  disconnect() {}
}

window.IntersectionObserver = IntersectionObserverMock;
globalThis.IntersectionObserver = IntersectionObserverMock;

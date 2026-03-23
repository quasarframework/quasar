import { describe, expect, test, vi } from "vitest";

import { QBtn, ClosePopup, AddressbarColor, colors } from "quasar";

vi.mock("../../../../ui/src/components/btn/QBtn.js", () => ({
  default: { component: true }
}));

vi.mock("../../../../ui/src/directives/close-popup/ClosePopup.js", () => ({
  default: { directive: true }
}));

vi.mock("../../../../ui/src/plugins/addressbar/AddressbarColor.js", () => ({
  default: { plugin: true }
}));

vi.mock("../../../../ui/src/utils/colors/colors.js", () => ({
  default: { utility: true }
}));

describe("JS Transformations", () => {
  test("a component", () => {
    expect(QBtn).toStrictEqual({ component: true });
  });

  test("a directive", () => {
    expect(ClosePopup).toStrictEqual({ directive: true });
  });

  test("a plugin", () => {
    expect(AddressbarColor).toStrictEqual({ plugin: true });
  });

  test("a utility", () => {
    expect(colors).toStrictEqual({ utility: true });
  });
});

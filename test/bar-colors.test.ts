import { resolveBarColor } from "../src/utils/bar-colors";

describe("resolveBarColor", () => {
  const green = "\x1b[38;2;166;227;161m";
  const yellow = "\x1b[38;2;249;226;175m";
  const red = "\x1b[38;2;243;139;168m";

  it("returns nothing when disabled", () => {
    expect(resolveBarColor(95, undefined, "truecolor")).toBeUndefined();
    expect(resolveBarColor(95, false, "truecolor")).toBeUndefined();
  });

  it("uses green/yellow/red at 0/80/90 by default", () => {
    expect(resolveBarColor(0, true, "truecolor")).toBe(green);
    expect(resolveBarColor(79, true, "truecolor")).toBe(green);
    expect(resolveBarColor(80, true, "truecolor")).toBe(yellow);
    expect(resolveBarColor(89, true, "truecolor")).toBe(yellow);
    expect(resolveBarColor(90, true, "truecolor")).toBe(red);
    expect(resolveBarColor(100, true, "truecolor")).toBe(red);
  });

  it("honors custom stops regardless of order", () => {
    const stops = [
      { from: 50, color: "#ff0000" },
      { from: 0, color: "#0000ff" },
    ];
    expect(resolveBarColor(10, stops, "truecolor")).toBe("\x1b[38;2;0;0;255m");
    expect(resolveBarColor(50, stops, "truecolor")).toBe("\x1b[38;2;255;0;0m");
  });

  it("ignores invalid stops and falls back to the theme color", () => {
    const stops = [{ from: 0, color: "green" }];
    expect(resolveBarColor(10, stops, "truecolor")).toBeUndefined();
  });

  it("returns nothing without color support", () => {
    expect(resolveBarColor(10, true, "none")).toBeUndefined();
  });
});

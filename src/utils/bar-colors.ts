import { hexToAnsi, hexTo256Ansi, hexToBasicAnsi } from "./colors";
import { getColorSupport } from "./color-support";

export interface BarColorStop {
  /** Lowest percentage (inclusive) this color applies to. */
  from: number;
  /** Hex color, e.g. "#a6e3a1". */
  color: string;
}

export type BarColorsConfig = boolean | BarColorStop[];

export const DEFAULT_BAR_COLORS: BarColorStop[] = [
  { from: 0, color: "#a6e3a1" },
  { from: 80, color: "#f9e2af" },
  { from: 90, color: "#f38ba8" },
];

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

export function resolveBarColor(
  pct: number,
  barColors: BarColorsConfig | undefined,
  colorMode: string | undefined,
): string | undefined {
  if (!barColors) return undefined;
  const stops = barColors === true ? DEFAULT_BAR_COLORS : barColors;
  if (!Array.isArray(stops)) return undefined;

  let match: BarColorStop | undefined;
  for (const stop of stops) {
    if (
      typeof stop?.from !== "number" ||
      typeof stop.color !== "string" ||
      !HEX_COLOR.test(stop.color) ||
      stop.from > pct
    ) {
      continue;
    }
    if (!match || stop.from >= match.from) match = stop;
  }
  if (!match) return undefined;

  const support =
    !colorMode || colorMode === "auto" ? getColorSupport() : colorMode;
  if (support === "none") return undefined;
  if (support === "ansi") return hexToBasicAnsi(match.color, false);
  if (support === "ansi256") return hexTo256Ansi(match.color, false);
  return hexToAnsi(match.color, false);
}

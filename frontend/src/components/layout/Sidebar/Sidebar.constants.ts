export const SIDEBAR_MIN_WIDTH = 80;
export const SIDEBAR_MAX_WIDTH = 196;
export const SIDEBAR_COLLAPSED_LIMIT = 124;
export const SIDEBAR_KEYBOARD_STEP = 12;

export function clampSidebarWidth(
  width: number,
): number {
  return Math.min(
    SIDEBAR_MAX_WIDTH,
    Math.max(SIDEBAR_MIN_WIDTH, width),
  );
}
export const STAGE_BOARD_ID = "b-stage";

export const BOARD_TITLES: Record<string, string> = {
  "b-boots": "Boot research",
  "b-stage": "Stage design refs",
  "b-summer": "Summer fits",
  "b-packaging": "Packaging ideas",
};

export function boardTitle(id: string | undefined): string {
  if (!id) return "Moodboard";
  return BOARD_TITLES[id] ?? "Moodboard";
}

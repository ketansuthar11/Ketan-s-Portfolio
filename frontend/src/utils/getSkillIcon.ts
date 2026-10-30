const BASE_URL = "https://thesvg.org/icons";

export async function getSkillIcon(
  skillName: string
): Promise<string> {
  const normalized = skillName.trim().toLowerCase();

  const candidates = [
    normalized.split(".")[0].replace(/[^a-z0-9]/g, ""),
    normalized.replace(/\./g, "").replace(/[^a-z0-9]/g, ""),
    normalized
      .replace(/\+/g, "plus")
      .replace(/#/g, "sharp")
      .replace(/[^a-z0-9]/g, ""),
  ];

  for (const slug of [...new Set(candidates)]) {
    const url = `${BASE_URL}/${slug}/default.svg`;

    try {
      const response = await fetch(url, { method: "HEAD" });

      if (response.ok) return url;
    } catch {
      // Try next URL
    }
  }

  return "";
}
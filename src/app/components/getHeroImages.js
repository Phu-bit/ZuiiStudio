import fs from "fs";
import path from "path";

export async function getHeroImages() {
  const dir = path.join(process.cwd(), "public", "hero");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(png|jpe?g|webp|svg)$/i.test(f))
      .map((f) => `/hero/${f}`);
  } catch {
    return [];
  }
}

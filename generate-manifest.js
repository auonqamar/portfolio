// Builds manifest.json: a list of every image in the repo.
// Run locally with:  node generate-manifest.js
const fs = require("fs");
const path = require("path");

const EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);
const SKIP = new Set([".git", ".github", "node_modules"]);

function walk(dir, base = "") {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      return SKIP.has(entry.name) ? [] : walk(path.join(dir, entry.name), rel);
    }
    return EXT.has(path.extname(entry.name).toLowerCase()) ? [rel] : [];
  });
}

const files = walk(".").sort((a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
);

fs.writeFileSync("manifest.json", JSON.stringify({ files }, null, 2) + "\n");
console.log(`manifest.json written with ${files.length} images`);

import { readFile, writeFile } from "node:fs/promises";

const inventory = JSON.parse(await readFile(new URL("./website-inventory.json", import.meta.url), "utf8"));
const routes = [
  ["websites/", "Websites"],
  ["works/magnify/", "Magnify"],
  ...inventory.map((site) => [`websites/${site.slug}/`, site.name]),
];
const results = await Promise.all(routes.map(async ([path, name]) => {
  const url = `https://jakeworsham.syncgr.com/${path}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/)?.[1].replaceAll("&amp;", "&");
  return { url, status: response.status, title, passed: response.ok && title === `${name} · Jake Worsham` };
}));
await writeFile(new URL("../evidence/additions-live-routes.json", import.meta.url), JSON.stringify(results, null, 2) + "\n");
console.log(`${results.filter((result) => result.passed).length}/${results.length} published routes match their page titles`);
if (results.some((result) => !result.passed)) {
  console.error(results.filter((result) => !result.passed));
  process.exitCode = 1;
}

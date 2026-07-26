import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname);
const output = resolve(root, "dist");
const client = resolve(output, "client");

await rm(output, { recursive: true, force: true });
await mkdir(resolve(client, "ru"), { recursive: true });
await mkdir(resolve(client, "assets"), { recursive: true });
await mkdir(resolve(output, "server"), { recursive: true });
await mkdir(resolve(output, ".openai"), { recursive: true });

await cp(resolve(root, "index.html"), resolve(client, "index.html"));
await cp(resolve(root, "styles.css"), resolve(client, "styles.css"));
await cp(resolve(root, "ru", "index.html"), resolve(client, "ru", "index.html"));
await cp(resolve(root, "assets", "revol-apps.png"), resolve(client, "assets", "revol-apps.png"));
await cp(resolve(root, ".openai", "hosting.json"), resolve(output, ".openai", "hosting.json"));

const worker = `export default {
  async fetch(request, env) {
    if (!env.ASSETS) {
      return new Response("Static assets are unavailable.", { status: 503 });
    }

    const url = new URL(request.url);
    if (url.pathname === "/ru") {
      url.pathname = "/ru/";
      return Response.redirect(url, 308);
    }

    return env.ASSETS.fetch(new Request(url, request));
  }
};
`;

await writeFile(resolve(output, "server", "index.js"), worker, "utf8");

const pages = [
  ["index.html", "./styles.css", "./assets/revol-apps.png", "./ru/"],
  ["ru/index.html", "../styles.css", "../assets/revol-apps.png", "../"]
];

for (const [page, stylesheet, image, languageLink] of pages) {
  const html = await readFile(resolve(root, page), "utf8");
  for (const reference of [stylesheet, image, languageLink]) {
    if (!html.includes(reference)) {
      throw new Error(`${page} is missing ${reference}`);
    }
  }
}

console.log("Waterly static site built successfully.");

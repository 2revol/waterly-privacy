import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname);
const output = resolve(root, "dist");
const client = resolve(output, "client");

await rm(output, { recursive: true, force: true });
await mkdir(resolve(client, "ru"), { recursive: true });
await mkdir(resolve(client, "zh-cn"), { recursive: true });
await mkdir(resolve(client, "assets"), { recursive: true });
await mkdir(resolve(output, "server"), { recursive: true });
await mkdir(resolve(output, ".openai"), { recursive: true });

await cp(resolve(root, "index.html"), resolve(client, "index.html"));
await cp(resolve(root, "styles.css"), resolve(client, "styles.css"));
await cp(resolve(root, "ru", "index.html"), resolve(client, "ru", "index.html"));
await cp(resolve(root, "zh-cn", "index.html"), resolve(client, "zh-cn", "index.html"));
for (const asset of [
  "developer-logo.png",
  "waterly-app.png",
  "waterly-name.png",
  "waterly-onboarding.png"
]) {
  await cp(resolve(root, "assets", asset), resolve(client, "assets", asset));
}
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
  [
    "index.html",
    "./styles.css",
    "./assets/developer-logo.png",
    "./assets/waterly-name.png",
    "./assets/waterly-app.png",
    "./assets/waterly-onboarding.png",
    "./ru/",
    "./zh-cn/"
  ],
  [
    "ru/index.html",
    "../styles.css",
    "../assets/developer-logo.png",
    "../assets/waterly-name.png",
    "../assets/waterly-app.png",
    "../assets/waterly-onboarding.png",
    "../",
    "../zh-cn/"
  ],
  [
    "zh-cn/index.html",
    "../styles.css",
    "../assets/developer-logo.png",
    "../assets/waterly-name.png",
    "../assets/waterly-app.png",
    "../assets/waterly-onboarding.png",
    "../",
    "../ru/"
  ]
];

for (const [page, ...references] of pages) {
  const html = await readFile(resolve(root, page), "utf8");
  for (const reference of references) {
    if (!html.includes(reference)) {
      throw new Error(`${page} is missing ${reference}`);
    }
  }

  const policySectionCount = [...html.matchAll(/<section id="section-\d+">/g)].length;
  if (policySectionCount !== 15) {
    throw new Error(`${page} contains ${policySectionCount} policy sections instead of 15`);
  }
}

console.log("Waterly static site built successfully.");

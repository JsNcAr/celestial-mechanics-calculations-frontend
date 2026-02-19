/**
 * Copies static assets into dist/ so it is a fully self-contained directory
 * that can be served directly by any static file server.
 *
 * Run automatically by `npm run build` after `tsc`.
 */
import { cpSync, mkdirSync } from "node:fs";

mkdirSync("dist", { recursive: true });

// Pico CSS — classless variant
cpSync(
  "node_modules/@picocss/pico/css/pico.min.css",
  "dist/pico.min.css",
);

// Application stylesheet
cpSync("src/style.css", "dist/style.css");

// Entry-point HTML (paths inside already reference dist-relative assets)
cpSync("index.html", "dist/index.html");

console.log("Assets copied to dist/");

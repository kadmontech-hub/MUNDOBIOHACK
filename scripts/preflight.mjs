import { readFile, readdir, stat } from "node:fs/promises";
import { join, relative, extname, basename } from "node:path";
import process from "node:process";

const root = process.cwd();
const ignoredFiles = new Set(["index-v13-backup.html"]);
const checkedExtensions = new Set([".html", ".css", ".js", ".json", ".xml", ".txt"]);
const errors = [];

async function walk(directory) {
  const entries = await readdir(directory);
  const files = [];
  for (const entry of entries) {
    if (entry === ".git" || entry === "node_modules" || entry === ".vercel") continue;
    const fullPath = join(directory, entry);
    const info = await stat(fullPath);
    if (info.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

const files = (await walk(root)).filter((file) => {
  if (ignoredFiles.has(basename(file))) return false;
  return checkedExtensions.has(extname(file));
});

for (const file of files) {
  const rel = relative(root, file);
  const text = await readFile(file, "utf8");

  if (text.includes("{{")) errors.push(`${rel}: contiene una variable sin resolver`);
  if (/href\s*=\s*["']\s*#\s*["']/i.test(text)) errors.push(`${rel}: contiene href="#"`);
  if (/href\s*=\s*["']\s*["']/i.test(text)) errors.push(`${rel}: contiene un href vacío`);
  if (/javascript\s*:/i.test(text)) errors.push(`${rel}: contiene una URL javascript:`);
  if (/\balert\s*\(/i.test(text)) errors.push(`${rel}: contiene alert()`);
  const httpMatches = [...text.matchAll(/http:\/\/[^\s"'<>]+/gi)].map((match) => match[0]);
  const unsafeHttp = httpMatches.filter((url) => url !== "http://www.sitemaps.org/schemas/sitemap/0.9");
  if (unsafeHttp.length) errors.push(`${rel}: contiene una URL HTTP no segura`);

  if (extname(file) === ".html") {
    const publicText = text.toLowerCase();
    for (const word of ["mockup", "provisional"]) {
      if (publicText.includes(word)) errors.push(`${rel}: contiene el texto interno "${word}"`);
    }

    const ids = [...text.matchAll(/\sid=["']([^"']+)["']/gi)].map((match) => match[1]);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length) errors.push(`${rel}: IDs duplicados: ${[...new Set(duplicates)].join(", ")}`);

    const idSet = new Set(ids);
    const internalLinks = [...text.matchAll(/href=["']#([^"']+)["']/gi)].map((match) => match[1]);
    for (const target of internalLinks) {
      if (!idSet.has(target)) errors.push(`${rel}: enlace interno sin destino #${target}`);
    }

    const images = [...text.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
    for (const image of images) {
      if (!/\salt=["'][^"']*["']/i.test(image)) errors.push(`${rel}: imagen sin atributo alt`);
    }

    const buttons = [...text.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)];
    for (const [, attrs, content] of buttons) {
      const hasLabel = /aria-label=["'][^"']+["']/i.test(attrs);
      const visibleText = content.replace(/<[^>]+>/g, "").trim();
      if (!hasLabel && !visibleText) errors.push(`${rel}: botón sin nombre accesible`);
    }
  }
}

if (errors.length) {
  console.error("PRELIGHT BLOQUEADO");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`PREFLIGHT OK: ${files.length} archivos verificados.`);

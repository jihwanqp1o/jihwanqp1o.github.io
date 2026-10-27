// 노션 "포트폴리오 프로젝트" DB에서 노출 체크된 항목을 읽어 index.html의 프로젝트 섹션을 갱신합니다.
// 실행: NOTION_TOKEN=... node scripts/build-portfolio.mjs
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const DATABASE_ID = "cc84b497364143a99eabee9cc53a1fed";
const NOTION_VERSION = "2022-06-28";
const INDEX_PATH = fileURLToPath(new URL("../index.html", import.meta.url));
const START = "<!-- PROJECTS:START -->";
const END = "<!-- PROJECTS:END -->";

const THUMB = { Game: "game", Web: "web", App: "app", Activity: "etc" };
const STATUS_CLASS = { 완성: "done", "진행 중": "wip", 프로토타입: "proto", 중단: "stop" };

export function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Notion 페이지 객체 한 개를 평평한 객체로 바꿉니다.
export function flattenPage(page) {
  const out = {};
  for (const [name, prop] of Object.entries(page.properties)) {
    switch (prop.type) {
      case "title":
        out[name] = prop.title.map((t) => t.plain_text).join("");
        break;
      case "rich_text":
        out[name] = prop.rich_text.map((t) => t.plain_text).join("");
        break;
      case "select":
        out[name] = prop.select?.name ?? "";
        break;
      case "multi_select":
        out[name] = prop.multi_select.map((o) => o.name);
        break;
      case "url":
        out[name] = prop.url ?? "";
        break;
      case "number":
        out[name] = prop.number ?? 0;
        break;
      case "checkbox":
        out[name] = prop.checkbox;
        break;
      default:
        break;
    }
  }
  return out;
}

export function renderCard(item, index) {
  const category = item["분류"] || "Game";
  const status = item["상태"];
  const no = String(index + 1).padStart(2, "0");
  const tech = (item["기술 스택"] ?? [])
    .map((t) => `<span>${escapeHtml(t)}</span>`)
    .join("");
  const links = [];
  if (item["링크"]) {
    links.push(`<a href="${escapeHtml(item["링크"])}" target="_blank" rel="noopener" class="plink plink-accent">사이트 열기</a>`);
  }
  if (item["저장소"]) {
    links.push(`<a href="${escapeHtml(item["저장소"])}" target="_blank" rel="noopener" class="plink">GitHub</a>`);
  }
  const statusTag = status
    ? `<span class="status status-${STATUS_CLASS[status] ?? "proto"}">${escapeHtml(status)}</span>`
    : "";
  return `
        <article class="project-card">
          <div class="project-thumb ${THUMB[category] ?? "etc"}">
            <span class="project-no">No.${no}</span>
            <span class="project-tag">${escapeHtml(category)}</span>
          </div>
          <div class="project-body">
            <div class="project-head">
              <h3 class="project-title">${escapeHtml(item["이름"])}</h3>
              ${statusTag}
            </div>
            <p class="project-desc">${escapeHtml(item["한줄 소개"])}</p>
            <div class="project-tech">${tech}</div>
            <div class="project-links">${links.join("\n              ")}</div>
          </div>
        </article>`;
}

export function renderSection(items) {
  return items.map((item, i) => renderCard(item, i)).join("\n");
}

async function queryPublishedRows(token) {
  const rows = [];
  let cursor;
  do {
    const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { property: "노출", checkbox: { equals: true } },
        sorts: [{ property: "정렬", direction: "ascending" }],
        start_cursor: cursor,
        page_size: 100,
      }),
    });
    if (!res.ok) {
      throw new Error(`Notion query failed: ${res.status} ${await res.text()}`);
    }
    const data = await res.json();
    rows.push(...data.results.map(flattenPage));
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return rows;
}

export async function updateIndexHtml(sectionHtml) {
  const html = await readFile(INDEX_PATH, "utf8");
  const startIdx = html.indexOf(START);
  const endIdx = html.indexOf(END);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    throw new Error("index.html에 PROJECTS:START / PROJECTS:END 마커가 없습니다.");
  }
  const next =
    html.slice(0, startIdx + START.length) +
    "\n" + sectionHtml + "\n        " +
    html.slice(endIdx);
  await writeFile(INDEX_PATH, next, "utf8");
}

async function main() {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error("NOTION_TOKEN 환경 변수가 없습니다.");
  }
  const rows = await queryPublishedRows(token);
  if (rows.length === 0) {
    throw new Error("노출 체크된 항목이 0개입니다. 빈 섹션으로 덮어쓰지 않도록 중단합니다.");
  }
  await updateIndexHtml(renderSection(rows));
  console.log(`프로젝트 ${rows.length}개를 index.html에 반영했습니다.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}

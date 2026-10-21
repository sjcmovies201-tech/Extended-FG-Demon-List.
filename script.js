/* This file turns the data in data.js into a web page.
   You do NOT need to edit this file. */

// ---------- Points formula (same one the original Pointercrate-style list uses) ----------
function baseScore(p) {
  if (p >= 56) return 1.039035131 * ((185.7 * Math.exp(-0.02715 * p)) + 14.84);
  if (p >= 36) return 1.0371139743 * ((212.61 * Math.pow(1.036, 1 - p)) + 25.071);
  if (p >= 21) return ((250 - 83.389) * Math.pow(1.0099685, 2 - p) - 31.152) * 1.0371139743;
  if (p >= 4)  return ((326.1 * Math.exp(-0.0871 * p)) + 51.09) * 1.037117142;
  if (p >= 1)  return (-18.2899079915 * p) + 368.2899079915;
  return 0;
}
function levelPoints(position, requirement, progress) {
  if (position > SITE.extendedListSize) return 0;           // legacy = 0 points
  if (progress < requirement) return 0;
  const beaten = baseScore(position) * (SITE.top1Points / baseScore(1));
  if (progress === 100) return beaten;
  return (beaten * Math.pow(5, (progress - requirement) / Math.max(1, 100 - requirement))) / 10;
}

// ---------- Small helpers ----------
function esc(text) {
  const d = document.createElement("div");
  d.textContent = text == null ? "" : String(text);
  return d.innerHTML;
}
function youtubeId(url) {
  const m = String(url || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}
function videoHtml(url) {
  const id = youtubeId(url);
  if (id) return `<div class="video"><iframe src="https://www.youtube.com/embed/${id}" allowfullscreen loading="lazy"></iframe></div>`;
  if (url) return `<p><a href="${esc(url)}" target="_blank" rel="noopener">Watch video</a></p>`;
  return "";
}
function listName(position) {
  if (position <= SITE.mainListSize) return "Main List";
  if (position <= SITE.extendedListSize) return "Extended List";
  return "Legacy List";
}

// ---------- Header ----------
document.title = SITE.name;
document.getElementById("site-name").textContent = SITE.name;
document.getElementById("site-tagline").textContent = SITE.tagline;

// ---------- Prepare the data ----------
const levels = LEVELS.map((lvl, i) => ({ ...lvl, position: i + 1 }));
const byName = {};
levels.forEach(l => { byName[l.name.toLowerCase()] = l; });

const recordsByLevel = {};
const players = {};
RECORDS.forEach(r => {
  const lvl = byName[String(r.level).toLowerCase()];
  if (!lvl) { console.warn("Record points to a level that doesn't exist:", r.level); return; }
  (recordsByLevel[lvl.name] = recordsByLevel[lvl.name] || []).push(r);
  const pts = levelPoints(lvl.position, lvl.requirement, r.progress);
  const p = players[r.player] = players[r.player] || { name: r.player, points: 0, records: [] };
  p.points += pts;
  p.records.push({ ...r, level: lvl, pts });
});

// ---------- Levels tab ----------
function renderLevels(filter = "") {
  const box = document.getElementById("level-rows");
  const q = filter.trim().toLowerCase();
  let html = "", lastList = "";
  levels.forEach(l => {
    if (q && !(l.name + " " + l.creator + " " + l.verifier).toLowerCase().includes(q)) return;
    const list = listName(l.position);
    if (list !== lastList) { html += `<h2>${list}</h2>`; lastList = list; }
    const recs = (recordsByLevel[l.name] || []).filter(r => r.progress >= l.requirement);
    const pts = levelPoints(l.position, l.requirement, 100);
    html += `
      <div class="row">
        <div class="row-head">
          <span class="rank">#${l.position}</span>
          <span class="title">${esc(l.name)}<br><span class="sub">by ${esc(l.creator)}</span></span>
          <span class="pts">${pts ? pts.toFixed(2) + " pts" : "legacy"}</span>
        </div>
        <div class="details">
          ${videoHtml(l.video)}
          <p><b>Creator:</b> ${esc(l.creator)} &nbsp; <b>Verifier:</b> ${esc(l.verifier)}</p>
          ${l.levelId ? `<p><b>Level ID:</b> ${esc(l.levelId)}</p>` : ""}
          <p><b>Needed to count:</b> ${esc(l.requirement)}%</p>
          <b>Records (${recs.length})</b>
          ${recs.length ? `<table><tr><th>Player</th><th>%</th><th>Video</th></tr>${recs.map(r =>
            `<tr><td>${esc(r.player)}</td><td>${esc(r.progress)}%</td><td>${r.video ? `<a href="${esc(r.video)}" target="_blank" rel="noopener">Watch</a>` : "-"}</td></tr>`).join("")}</table>`
            : `<p class="sub">No records yet.</p>`}
        </div>
      </div>`;
  });
  box.innerHTML = html || `<p class="empty">No levels found.</p>`;
}
document.getElementById("levels").innerHTML =
  `<input type="search" id="search" placeholder="Search levels..."><div id="level-rows"></div>`;
renderLevels();
document.getElementById("search").addEventListener("input", e => renderLevels(e.target.value));
document.getElementById("level-rows").addEventListener("click", e => {
  const head = e.target.closest(".row-head");
  if (head) head.parentElement.classList.toggle("open");
});

// ---------- Players tab ----------
const sorted = Object.values(players).sort((a, b) => b.points - a.points);
document.getElementById("players").innerHTML = sorted.length
  ? sorted.map((p, i) => {
      const beaten = p.records.filter(r => r.pts > 0).sort((a, b) => a.level.position - b.level.position);
      return `
      <div class="row">
        <div class="row-head">
          <span class="rank">#${i + 1}</span>
          <span class="title">${esc(p.name)}</span>
          <span class="pts">${p.points.toFixed(2)} pts</span>
        </div>
        <div class="details">
          <table><tr><th>Level</th><th>%</th><th>Points</th></tr>
          ${beaten.map(r => `<tr><td>#${r.level.position} ${esc(r.level.name)}</td><td>${esc(r.progress)}%</td><td>${r.pts.toFixed(2)}</td></tr>`).join("")}
          </table>
        </div>
      </div>`;
    }).join("")
  : `<p class="empty">No players yet.</p>`;
document.getElementById("players").addEventListener("click", e => {
  const head = e.target.closest(".row-head");
  if (head) head.parentElement.classList.toggle("open");
});

// ---------- Tabs ----------
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("nav button").forEach(b => b.classList.toggle("active", b === btn));
    ["levels", "players"].forEach(id => { document.getElementById(id).hidden = id !== btn.dataset.tab; });
  });
});

/* This file runs the website. You do NOT need to edit it. */

const $ = id => document.getElementById(id);
const demo = !SUPABASE_URL || !SUPABASE_KEY;
let db = null;
if (!demo) {
  if (window.supabase) db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}
const state = { levels: [], records: [] };

// ---------- Points formula ----------
function baseScore(p) {
  if (p >= 56) return 1.039035131 * ((185.7 * Math.exp(-0.02715 * p)) + 14.84);
  if (p >= 36) return 1.0371139743 * ((212.61 * Math.pow(1.036, 1 - p)) + 25.071);
  if (p >= 21) return ((250 - 83.389) * Math.pow(1.0099685, 2 - p) - 31.152) * 1.0371139743;
  if (p >= 4)  return ((326.1 * Math.exp(-0.0871 * p)) + 51.09) * 1.037117142;
  if (p >= 1)  return (-18.2899079915 * p) + 368.2899079915;
  return 0;
}
function levelPoints(position, requirement, progress) {
  if (position > SITE.extendedListSize) return 0;
  if (progress < requirement) return 0;
  const beaten = baseScore(position) * (SITE.top1Points / baseScore(1));
  if (progress === 100) return beaten;
  return (beaten * Math.pow(5, (progress - requirement) / Math.max(1, 100 - requirement))) / 10;
}

// ---------- Helpers ----------
function esc(t) {
  return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function safeUrl(u) { u = String(u || "").trim(); return /^https?:\/\//i.test(u) ? u : ""; }
function youtubeId(url) {
  const m = String(url || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}
function videoHtml(url) {
  const id = youtubeId(url);
  if (id) return `<div class="video"><iframe src="https://www.youtube.com/embed/${id}" allowfullscreen loading="lazy"></iframe></div>`;
  const u = safeUrl(url);
  return u ? `<p><a href="${esc(u)}" target="_blank" rel="noopener">Watch video</a></p>` : "";
}
function linkOrDash(url) {
  const u = safeUrl(url);
  return u ? `<a href="${esc(u)}" target="_blank" rel="noopener">Watch</a>` : "-";
}
function listName(pos) {
  if (pos <= SITE.mainListSize) return "Main List";
  if (pos <= SITE.extendedListSize) return "Extended List";
  return "Legacy List";
}
let msgTimer;
function toast(text, bad) {
  const m = $("msg");
  m.textContent = text;
  m.className = "msg " + (bad ? "err" : "ok");
  m.hidden = false;
  clearTimeout(msgTimer);
  msgTimer = setTimeout(() => { m.hidden = true; }, 6000);
}
function levelById(id) { return state.levels.find(l => l.id === id); }

// ---------- Loading data ----------
async function loadData() {
  if (demo) {
    state.levels = DEMO_LEVELS.map((l, i) => ({ id: i + 1, position: i + 1, ...l }));
    const byName = {};
    state.levels.forEach(l => { byName[l.name.toLowerCase()] = l; });
    state.records = DEMO_RECORDS
      .map((r, i) => ({ id: i + 1, levelId: (byName[String(r.level).toLowerCase()] || {}).id, player: r.player, progress: r.progress, video: r.video }))
      .filter(r => r.levelId);
    return;
  }
  const [lv, rc] = await Promise.all([
    db.from("levels").select("*").order("position"),
    db.from("records").select("id, level_id, player, progress, video").eq("status", "approved")
  ]);
  if (lv.error || rc.error) throw (lv.error || rc.error);
  state.levels = lv.data.map((r, i) => ({
    id: r.id, position: i + 1, name: r.name, creator: r.creator, verifier: r.verifier,
    video: r.video, gameId: r.game_id, requirement: r.requirement
  }));
  state.records = rc.data.map(r => ({ id: r.id, levelId: r.level_id, player: r.player, progress: r.progress, video: r.video }));
}

// ---------- Levels tab ----------
function renderLevels() {
  const q = ($("search") ? $("search").value : "").trim().toLowerCase();
  let html = "", lastList = "";
  state.levels.forEach(l => {
    if (q && !(l.name + " " + l.creator + " " + l.verifier).toLowerCase().includes(q)) return;
    const list = listName(l.position);
    if (list !== lastList) { html += `<h2>${list}</h2>`; lastList = list; }
    const recs = state.records.filter(r => r.levelId === l.id && r.progress >= l.requirement);
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
          ${l.gameId ? `<p><b>Level ID:</b> ${esc(l.gameId)}</p>` : ""}
          <p><b>Needed to count:</b> ${esc(l.requirement)}%</p>
          <b>Records (${recs.length})</b>
          ${recs.length ? `<table><tr><th>Player</th><th>%</th><th>Video</th></tr>${recs.map(r =>
            `<tr><td>${esc(r.player)}</td><td>${esc(r.progress)}%</td><td>${linkOrDash(r.video)}</td></tr>`).join("")}</table>`
            : `<p class="sub">No records yet.</p>`}
        </div>
      </div>`;
  });
  $("level-rows").innerHTML = html || `<p class="empty">No levels yet.</p>`;
}

// ---------- Players tab ----------
function renderPlayers() {
  const players = {};
  state.records.forEach(r => {
    const lvl = levelById(r.levelId);
    if (!lvl) return;
    const pts = levelPoints(lvl.position, lvl.requirement, r.progress);
    const key = r.player.trim().toLowerCase();
    const p = players[key] = players[key] || { name: r.player, points: 0, records: [] };
    p.points += pts;
    p.records.push({ ...r, level: lvl, pts });
  });
  const sorted = Object.values(players).sort((a, b) => b.points - a.points);
  $("players").innerHTML = sorted.length ? sorted.map((p, i) => {
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
  }).join("") : `<p class="empty">No players yet.</p>`;
}

// ---------- Submit tab ----------
function renderSubmit() {
  if (demo) {
    $("submit").innerHTML = `<p class="empty">Record submission turns on once you connect your database in <code>config.js</code>.</p>`;
    return;
  }
  const keep = $("sub-level") ? $("sub-level").value : "";
  $("submit").innerHTML = `
    <form class="card" id="submit-form">
      <p class="note">Beat a level? Send your record! An admin will check it before it shows up.</p>
      <label for="sub-level">Level</label>
      <select id="sub-level" required>
        <option value="">Choose a level...</option>
        ${state.levels.map(l => `<option value="${l.id}">#${l.position} ${esc(l.name)} (needs ${l.requirement}%)</option>`).join("")}
      </select>
      <label for="sub-player">Your player name</label>
      <input type="text" id="sub-player" maxlength="60" required>
      <label for="sub-progress">Your percent (1 to 100)</label>
      <input type="number" id="sub-progress" min="1" max="100" value="100" required>
      <label for="sub-video">Proof video link (YouTube, etc.)</label>
      <input type="url" id="sub-video" maxlength="255" placeholder="https://..." required>
      <label for="sub-note">Notes for the admins (optional)</label>
      <textarea id="sub-note" maxlength="500" rows="3"></textarea>
      <input type="text" id="sub-website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      <button class="btn" type="submit">Send record</button>
    </form>`;
  if (keep) $("sub-level").value = keep;
}

async function submitRecord(form) {
  if ($("sub-website").value) return;                       // a bot filled the hidden box
  const levelId = Number($("sub-level").value);
  const lvl = levelById(levelId);
  const progress = parseInt($("sub-progress").value, 10);
  const video = safeUrl($("sub-video").value);
  const player = $("sub-player").value.trim();
  if (!lvl) return toast("Please choose a level.", true);
  if (!player) return toast("Please type your player name.", true);
  if (!(progress >= 1 && progress <= 100)) return toast("Percent must be between 1 and 100.", true);
  if (progress < lvl.requirement) return toast(`This level needs at least ${lvl.requirement}% to count.`, true);
  if (!video) return toast("Please paste a video link that starts with https://", true);
  const btn = form.querySelector("button");
  btn.disabled = true;
  const { error } = await db.from("records").insert({
    level_id: levelId, player, progress, video, note: $("sub-note").value.trim()
  });
  btn.disabled = false;
  if (error) return toast("Could not send: " + error.message, true);
  toast("Thanks! Your record was sent and is waiting for an admin to check it.");
  form.reset();
}

// ---------- Admin tab ----------
async function renderAdmin() {
  const box = $("admin");
  if (demo) {
    box.innerHTML = `<p class="empty">Admin turns on once you connect your database in <code>config.js</code>.</p>`;
    return;
  }
  if (!db) { box.innerHTML = `<p class="empty">The database tool didn't load. Check your internet and refresh.</p>`; return; }
  const { data: sess } = await db.auth.getSession();
  if (!sess.session) {
    box.innerHTML = `
      <form class="card" id="login-form">
        <p class="note">Admins only. Accounts are made in your Supabase dashboard.</p>
        <label for="login-email">Email</label>
        <input type="email" id="login-email" required autocomplete="username">
        <label for="login-pass">Password</label>
        <input type="password" id="login-pass" required autocomplete="current-password">
        <button class="btn" type="submit">Log in</button>
      </form>`;
    return;
  }
  const { data: ok } = await db.rpc("is_admin");
  if (!ok) {
    box.innerHTML = `<p class="empty">You're logged in, but this account isn't an admin yet.</p>
      <p style="text-align:center"><button class="btn gray" data-action="logout">Log out</button></p>`;
    return;
  }
  const { data: pending, error } = await db.from("records").select("*").eq("status", "pending").order("created_at");
  if (error) { box.innerHTML = `<p class="empty">Error: ${esc(error.message)}</p>`; return; }

  box.innerHTML = `
    <p style="text-align:right"><button class="btn small gray" data-action="logout">Log out</button></p>

    <h2>Waiting for review (${pending.length})</h2>
    ${pending.length ? pending.map(r => {
      const l = levelById(r.level_id);
      return `<div class="admin-line">
        <div class="grow"><b>${esc(r.player)}</b> got ${esc(r.progress)}% on <b>${l ? "#" + l.position + " " + esc(l.name) : "(deleted level)"}</b>
          ${linkOrDash(r.video)}${r.note ? `<br><span class="note">Note: ${esc(r.note)}</span>` : ""}</div>
        <button class="btn small" data-action="approve" data-id="${r.id}">Approve</button>
        <button class="btn small red" data-action="reject" data-id="${r.id}">Reject</button>
      </div>`; }).join("") : `<p class="note">Nothing waiting. 🎉</p>`}

    <h2>Levels (top = #1)</h2>
    ${state.levels.map((l, i) => `<div class="admin-line">
        <span class="rank">#${l.position}</span>
        <span class="grow">${esc(l.name)}</span>
        <button class="btn small gray" data-action="lvl-up" data-id="${l.id}" ${i === 0 ? "disabled" : ""}>↑</button>
        <button class="btn small gray" data-action="lvl-down" data-id="${l.id}" ${i === state.levels.length - 1 ? "disabled" : ""}>↓</button>
        <button class="btn small" data-action="lvl-edit" data-id="${l.id}">Edit</button>
        <button class="btn small red" data-action="lvl-del" data-id="${l.id}">Delete</button>
      </div>`).join("") || `<p class="note">No levels yet. Add your first one below.</p>`}

    <form class="card" id="level-form">
      <h2 id="lvl-form-title" style="margin-top:0">Add a level</h2>
      <input type="hidden" id="lvl-id">
      <label for="lvl-name">Level name</label><input type="text" id="lvl-name" maxlength="120" required>
      <label for="lvl-creator">Creator(s)</label><input type="text" id="lvl-creator" maxlength="160">
      <label for="lvl-verifier">Verifier</label><input type="text" id="lvl-verifier" maxlength="120">
      <label for="lvl-video">Verification video link</label><input type="url" id="lvl-video" maxlength="255" placeholder="https://...">
      <label for="lvl-game">In-game level ID</label><input type="text" id="lvl-game" maxlength="32">
      <label for="lvl-req">Percent needed to count (usually 100)</label><input type="number" id="lvl-req" min="1" max="100" value="100" required>
      <label for="lvl-pos">Rank (leave empty to put it at the bottom)</label><input type="number" id="lvl-pos" min="1">
      <button class="btn" type="submit">Save level</button>
      <button class="btn gray" type="button" data-action="lvl-clear">Clear form</button>
    </form>

    <h2>Approved records (${state.records.length})</h2>
    ${state.records.map(r => {
      const l = levelById(r.levelId);
      return `<div class="admin-line">
        <div class="grow">${esc(r.player)} — ${esc(r.progress)}% on ${l ? esc(l.name) : "?"} ${linkOrDash(r.video)}</div>
        <button class="btn small red" data-action="del-record" data-id="${r.id}">Delete</button>
      </div>`; }).join("") || `<p class="note">None yet.</p>`}`;
}

// Write the whole level order (and any edits) to the database in one go.
async function writeOrder(list) {
  const rows = list.map((l, i) => ({
    id: l.id, position: i + 1, name: l.name, creator: l.creator, verifier: l.verifier,
    video: l.video, game_id: l.gameId, requirement: l.requirement
  }));
  const { error } = await db.from("levels").upsert(rows);
  if (error) throw error;
}

async function refreshAll() {
  await loadData();
  renderLevels(); renderPlayers(); renderSubmit();
  if (!$("admin").hidden) await renderAdmin();
}

async function run(fn, okText) {
  try { await fn(); await refreshAll(); if (okText) toast(okText); }
  catch (e) { toast("Something went wrong: " + (e.message || e), true); }
}

async function saveLevel() {
  const f = {
    name: $("lvl-name").value.trim(), creator: $("lvl-creator").value.trim(),
    verifier: $("lvl-verifier").value.trim(), video: safeUrl($("lvl-video").value),
    gameId: $("lvl-game").value.trim(), requirement: parseInt($("lvl-req").value, 10) || 100
  };
  if ($("lvl-video").value.trim() && !f.video) return toast("The video link must start with https://", true);
  const id = $("lvl-id").value ? Number($("lvl-id").value) : null;
  const wanted = parseInt($("lvl-pos").value, 10);
  await run(async () => {
    let list = state.levels.map(l => ({ ...l }));
    if (id) {
      const mine = list.find(l => l.id === id);
      Object.assign(mine, f);
      list = list.filter(l => l.id !== id);
      list.splice(Math.min(Math.max((wanted || mine.position) - 1, 0), list.length), 0, mine);
    } else {
      const { data, error } = await db.from("levels").insert({
        position: list.length + 1, name: f.name, creator: f.creator, verifier: f.verifier,
        video: f.video, game_id: f.gameId, requirement: f.requirement
      }).select().single();
      if (error) throw error;
      const mine = { ...f, id: data.id };
      list.splice(Math.min(Math.max((wanted || list.length + 1) - 1, 0), list.length), 0, mine);
    }
    await writeOrder(list);
  }, "Level saved.");
}

// ---------- Clicks and forms ----------
document.addEventListener("click", e => {
  const head = e.target.closest(".row-head");
  if (head) { head.parentElement.classList.toggle("open"); return; }
  const b = e.target.closest("[data-action]");
  if (!b) return;
  const action = b.dataset.action, id = Number(b.dataset.id);
  const idx = state.levels.findIndex(l => l.id === id);

  if (action === "logout") run(async () => { await db.auth.signOut(); }, "Logged out.");
  else if (action === "approve" || action === "reject")
    run(async () => {
      const { error } = await db.from("records").update({ status: action === "approve" ? "approved" : "rejected" }).eq("id", id);
      if (error) throw error;
    }, action === "approve" ? "Record approved." : "Record rejected.");
  else if (action === "del-record") {
    if (confirm("Delete this record for good?")) run(async () => {
      const { error } = await db.from("records").delete().eq("id", id);
      if (error) throw error;
    }, "Record deleted.");
  }
  else if (action === "lvl-up" || action === "lvl-down") {
    const j = action === "lvl-up" ? idx - 1 : idx + 1;
    if (idx < 0 || j < 0 || j >= state.levels.length) return;
    const list = state.levels.map(l => ({ ...l }));
    [list[idx], list[j]] = [list[j], list[idx]];
    run(() => writeOrder(list));
  }
  else if (action === "lvl-edit") {
    const l = state.levels[idx]; if (!l) return;
    $("lvl-form-title").textContent = "Edit level";
    $("lvl-id").value = l.id; $("lvl-name").value = l.name; $("lvl-creator").value = l.creator;
    $("lvl-verifier").value = l.verifier; $("lvl-video").value = l.video; $("lvl-game").value = l.gameId;
    $("lvl-req").value = l.requirement; $("lvl-pos").value = l.position;
    $("level-form").scrollIntoView({ behavior: "smooth" });
  }
  else if (action === "lvl-clear") { $("level-form").reset(); $("lvl-id").value = ""; $("lvl-form-title").textContent = "Add a level"; }
  else if (action === "lvl-del") {
    if (confirm("Delete this level AND all its records for good?")) run(async () => {
      const { error } = await db.from("levels").delete().eq("id", id);
      if (error) throw error;
      await writeOrder(state.levels.filter(l => l.id !== id).map(l => ({ ...l })));
    }, "Level deleted.");
  }
});

document.addEventListener("submit", async e => {
  e.preventDefault();
  if (e.target.id === "submit-form") submitRecord(e.target);
  else if (e.target.id === "level-form") saveLevel();
  else if (e.target.id === "login-form") {
    const { error } = await db.auth.signInWithPassword({ email: $("login-email").value.trim(), password: $("login-pass").value });
    if (error) toast("Login failed: " + error.message, true); else renderAdmin();
  }
});

document.addEventListener("input", e => { if (e.target.id === "search") renderLevels(); });

document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("nav button").forEach(b => b.classList.toggle("active", b === btn));
    ["levels", "players", "submit", "admin"].forEach(id => { $(id).hidden = id !== btn.dataset.tab; });
    if (btn.dataset.tab === "admin") renderAdmin();
  });
});

// ---------- Start ----------
document.title = SITE.name;
$("site-name").textContent = SITE.name;
$("site-tagline").textContent = SITE.tagline + (demo ? "  (demo mode)" : "");
$("levels").innerHTML = `<input type="search" id="search" placeholder="Search levels..."><div id="level-rows"><p class="empty">Loading...</p></div>`;
refreshAll().catch(err => {
  $("level-rows").innerHTML = `<p class="empty">Couldn't load data: ${esc(err.message || err)}</p>`;
});

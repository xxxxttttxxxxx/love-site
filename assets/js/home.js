const session = requireLogin();
const $ = (id) => document.getElementById(id);
const pad2 = (n) => String(n).padStart(2, "0");
const today = new Date();
let calendarDate = new Date(today.getFullYear(), today.getMonth(), 1);

function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function daysBetween(a, b) {
  const one = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const two = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.round((two - one) / 86400000);
}
function dateKey(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}
function escapeHtml(text) {
  return String(text).replace(/[&<>'"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));
}

function initBase() {
  $("siteName").textContent = SITE_CONFIG.siteTitle;
  document.title = SITE_CONFIG.siteTitle;
  $("heroTitle").textContent = SITE_CONTENT.hero.title;
  $("heroSubtitle").textContent = SITE_CONTENT.hero.subtitle;
  $("heroQuote").textContent = `“${SITE_CONTENT.hero.quote}”`;
  $("dailyPassword").textContent = SITE_CONTENT.hero.dailyPassword;
  $("footerText").textContent = SITE_CONFIG.footerText;
  $("anniversaryText").textContent = `${SITE_CONFIG.coupleNames} · ${SITE_CONFIG.anniversaryDisplay}`;
  $("privateText").textContent = SITE_CONTENT.privateText;
  $("logoutBtn").addEventListener("click", logout);

  const anniversary = parseDate(SITE_CONFIG.anniversaryDate);
  const diff = daysBetween(anniversary, today);
  if (diff >= 0) {
    $("dayCardTitle").textContent = "专属纪念日已经过去";
    $("daysTogether").textContent = diff;
  } else {
    $("dayCardTitle").textContent = "距离专属纪念日还有";
    $("daysTogether").textContent = Math.abs(diff);
  }
}

function renderTicker() {
  const text = SITE_CONTENT.ticker.map(item => `<span>♥ ${escapeHtml(item)}</span>`).join("");
  $("ticker").innerHTML = text + text;
}

function renderStats() {
  $("overview").innerHTML = SITE_CONTENT.stats.map(item => `
    <article class="stat-card">
      <span class="eyebrow">${escapeHtml(item.label)}</span>
      <b>${escapeHtml(item.value)}</b>
      <small>${escapeHtml(item.note)}</small>
    </article>
  `).join("");
}

function renderEventList() {
  const sorted = [...SITE_CONTENT.events].sort((a, b) => parseDate(a.date) - parseDate(b.date));
  $("eventList").innerHTML = sorted.map(event => {
    const d = parseDate(event.date);
    const diff = daysBetween(today, d);
    const label = diff === 0 ? "就是今天" : diff > 0 ? `还有 ${diff} 天` : `已经过去 ${Math.abs(diff)} 天`;
    return `
      <article class="event-item">
        <span>${event.date} · ${label}</span>
        <b>${escapeHtml(event.title)}</b>
        <p>${escapeHtml(event.desc)}</p>
      </article>
    `;
  }).join("");
}

function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  $("calendarTitle").textContent = `${year} 年 ${month + 1} 月`;
  $("calendarHint").textContent = "粉色日期代表你们的重要节点";

  const eventsByDate = new Map(SITE_CONTENT.events.map(e => [e.date, e]));
  const first = new Date(year, month, 1);
  const firstWeekday = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - firstWeekday);
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = dateKey(d);
    const event = eventsByDate.get(key);
    const isToday = key === dateKey(today);
    const isCurrentMonth = d.getMonth() === month;
    cells.push(`
      <div class="day-cell ${isCurrentMonth ? "" : "dim"} ${isToday ? "today" : ""} ${event ? "has-event" : ""}" title="${event ? escapeHtml(event.desc) : ""}">
        ${event ? `<i class="event-dot"></i>` : ""}
        <div class="day-num">${d.getDate()}</div>
        ${event ? `<div class="day-event">${escapeHtml(event.title)}</div>` : ""}
      </div>
    `);
  }
  $("calendarGrid").innerHTML = cells.join("");
}

function renderStory() {
  $("storyTimeline").innerHTML = SITE_CONTENT.story.map(item => `
    <article class="time-item">
      <div class="time-card">
        <div class="time-date">${escapeHtml(item.date)}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
      </div>
    </article>
  `).join("");
}

function renderAlbum() {
  $("albumGrid").innerHTML = SITE_CONTENT.album.map((item, index) => {
    const media = item.src
      ? `<div class="album-media" style="background-image:url('${escapeHtml(item.src)}')"></div>`
      : `<div class="album-placeholder">${index + 1}</div>`;
    return `
      <article class="album-card">
        ${media}
        <div class="album-info">
          <div class="tag">${escapeHtml(item.tag || "PHOTO")}</div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.desc)}</p>
        </div>
      </article>
    `;
  }).join("");
}

function renderDiary() {
  $("diaryList").innerHTML = SITE_CONTENT.diary.map(item => `
    <article class="diary-card">
      <time>${escapeHtml(item.date)}</time>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </article>
  `).join("");
}

function renderWishes() {
  $("wishGrid").innerHTML = SITE_CONTENT.wishes.map(item => `
    <article class="wish-card ${item.done ? "done" : ""}">
      <span class="check">${item.done ? "✓" : "♡"}</span>
      <p>${escapeHtml(item.text)}</p>
    </article>
  `).join("");
}

function renderLetter() {
  $("letterTitle").textContent = SITE_CONTENT.letter.title;
  $("letterBody").innerHTML = SITE_CONTENT.letter.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join("");
  $("polaroidStack").innerHTML = ["日常", "旅行", "结婚"].map(t => `
    <div class="polaroid"><div class="polaroid-img">♡</div><span>${t}</span></div>
  `).join("");
}

function getMessages() {
  try { return JSON.parse(localStorage.getItem("love_site_messages_v3") || "[]"); }
  catch { return []; }
}
function saveMessages(list) {
  localStorage.setItem("love_site_messages_v3", JSON.stringify(list));
}
function renderMessages() {
  const messages = getMessages();
  const defaults = [
    { name: "系统", text: "留言墙已经准备好，第一句悄悄话可以从这里开始。" }
  ];
  const list = messages.length ? messages : defaults;
  $("messageList").innerHTML = list.map(item => `
    <article class="message-item"><b>${escapeHtml(item.name)}</b><p>${escapeHtml(item.text)}</p></article>
  `).join("");
}
function initMessages() {
  $("messageName").value = session?.displayName || "";
  $("messageForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("messageName").value.trim() || "匿名";
    const text = $("messageText").value.trim();
    if (!text) return;
    const messages = getMessages();
    messages.unshift({ name, text, time: new Date().toISOString() });
    saveMessages(messages.slice(0, 20));
    $("messageText").value = "";
    renderMessages();
  });
  renderMessages();
}

initBase();
renderTicker();
renderStats();
renderEventList();
renderCalendar();
renderStory();
renderAlbum();
renderDiary();
renderWishes();
renderLetter();
initMessages();

$("prevMonth").addEventListener("click", () => {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
  renderCalendar();
});
$("nextMonth").addEventListener("click", () => {
  calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
  renderCalendar();
});

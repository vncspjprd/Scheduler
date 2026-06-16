// utils.js - Helper functions

const DAY_INDEX_MAP = [6, 0, 1, 2, 3, 4, 5]; // JS getDay() (Sun=0) -> our DAYS index (Mon=0)

function getTodayKey() {
  const jsDay = new Date().getDay();
  return DAYS[DAY_INDEX_MAP[jsDay]];
}

function getTodayDateString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatTodayLabel() {
  const today = new Date();
  const opts = { weekday: "long", month: "long", day: "numeric" };
  return "Today is " + today.toLocaleDateString("en-US", opts);
}

function daysUntil(dateStr) {
  const target = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str == null ? "" : String(str);
  return d.innerHTML;
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

// Determine the current phase based on today's date
function getCurrentPhase() {
  const todayStr = getTodayDateString();
  for (const phase of PHASES) {
    if (todayStr >= phase.start && todayStr <= phase.end) {
      return phase;
    }
  }
  // Fallback: if before first phase, return first; if after last, return last
  const today = new Date(todayStr + "T00:00:00");
  const first = new Date(PHASES[0].start + "T00:00:00");
  if (today < first) return PHASES[0];
  return PHASES[PHASES.length - 1];
}

// Format minutes as MM:SS
function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

// Format seconds as HH:MM:SS (for longer countdowns/timers)
function formatTimeLong(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

// ===== Calendar helpers =====

function pad2(n) { return String(n).padStart(2, "0"); }

function dateToKey(year, month, day) {
  // month is 0-indexed
  return year + "-" + pad2(month + 1) + "-" + pad2(day);
}

// Get the day-of-week key (Mon..Sun) for a given date string "YYYY-MM-DD"
function dateKeyToDayOfWeek(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  return DAYS[DAY_INDEX_MAP[d.getDay()]];
}

function formatDateLabel(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

// Build a month grid: array of weeks, each week is array of {dateKey|null, dayNum|null}
function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = DAY_INDEX_MAP[firstDay.getDay()]; // 0 = Monday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}


// app.js - Main application controller

let state = Storage.load();
let currentDay = getTodayKey();
let scheduleEditMode = false;
let cseEditMode = false;

// Calendar state
const todayDate = new Date();
let calYear = todayDate.getFullYear();
let calMonth = todayDate.getMonth(); // 0-indexed
let selectedDateKey = getTodayDateString(); // "YYYY-MM-DD" - when set, shows day view instead of calendar

// Timer state
let timerType = "pomodoro"; // pomodoro | countdown | stopwatch
let pomodoro = {
  totalSeconds: 25 * 60,
  remaining: 25 * 60,
  running: false,
  intervalId: null,
  mode: 25,
  sessionsToday: 0,
  stopwatchElapsed: 0,
};

// ===================== NAVIGATION =====================

function navigateTo(pageId) {
  document.querySelectorAll(".page").forEach((p) => p.classList.add("hidden"));
  const page = document.getElementById("page-" + pageId);
  if (page) page.classList.remove("hidden");

  document.querySelectorAll("a[data-page]").forEach((a) => {
    a.classList.toggle("active", a.dataset.page === pageId);
  });

  // Render the relevant page content
  switch (pageId) {
    case "home": renderHome(); break;
    case "schedule": renderSchedulePage(); break;
    case "course": renderCoursePage(); break;
    case "cse": renderCSEPage(); break;
    case "pomodoro": renderPomodoroPage(); break;
    case "workout": renderWorkoutPage(); break;
    case "sleep": renderSleepPage(); break;
    case "journal": renderJournalPage(); break;
    case "habits": renderHabitsPage(); break;
    case "reminders": renderRemindersPage(); break;
    case "settings": renderSettingsPage(); break;
  }
}

function getPageFromHash() {
  const hash = window.location.hash.replace("#", "");
  const valid = ["home","schedule","course","cse","pomodoro","workout","sleep","journal","habits","reminders","settings"];
  return valid.includes(hash) ? hash : "home";
}

// ===================== THEME TOGGLE =====================

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  // Desktop toggle
  const label = document.getElementById("themeToggleLabel");
  const icon = document.getElementById("themeToggle").querySelector("i");
  if (label) label.textContent = theme === "dark" ? "Light mode" : "Dark mode";
  if (icon) icon.className = theme === "dark" ? "ti ti-sun" : "ti ti-moon";
  // Mobile toggle
  const mobileIcon = document.getElementById("themeIconMobile");
  if (mobileIcon) mobileIcon.className = theme === "dark" ? "ti ti-sun" : "ti ti-moon";
  localStorage.setItem("vincentOSTheme", theme);
}

function initTheme() {
  const saved = localStorage.getItem("vincentOSTheme");
  const theme = saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(theme);
}

window.addEventListener("hashchange", () => navigateTo(getPageFromHash()));

// ===================== DASHBOARD / HOME =====================

function getTodayChecklistStats() {
  const todayKey = getTodayDateString();
  if (!state.checklist[todayKey]) {
    const dow = getTodayKey();
    state.checklist[todayKey] = JSON.parse(JSON.stringify(state.checklist[dow] || []));
  }
  const items = state.checklist[todayKey];
  const done = items.filter((x) => x.done).length;
  const total = items.length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

function getCourseProgress() {
  const total = state.course.modules.length;
  const done = state.course.modules.filter((m) => m.done).length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

function updateStreak() {
  const stats = getTodayChecklistStats();
  const todayStr = getTodayDateString();
  if (!state.streak) state.streak = { count: 0, lastDate: null };

  // If today fully complete and we haven't already counted it
  if (stats.total > 0 && stats.done === stats.total) {
    if (state.streak.lastDate !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = yesterday.toISOString().slice(0, 10);
      if (state.streak.lastDate === yStr) {
        state.streak.count += 1;
      } else if (state.streak.lastDate !== todayStr) {
        state.streak.count = 1;
      }
      state.streak.lastDate = todayStr;
      Storage.save(state);
    }
  }
}

function renderHome() {
  document.getElementById("homeDateLabel").textContent = formatTodayLabel();

  const stats = getTodayChecklistStats();
  document.getElementById("homeCompletion").textContent = stats.pct + "%";

  const examDays = daysUntil("2026-08-08");
  document.getElementById("homeExamCountdown").innerHTML = examDays + ' <small>days</small>';

  updateStreak();
  document.getElementById("homeStreak").innerHTML = '<span class="streak-flame">🔥</span> ' + (state.streak.count || 0) + " days";

  const courseProgress = getCourseProgress();
  document.getElementById("homeCourseProgress").textContent = courseProgress.pct + "%";

  // Phase
  const phase = getCurrentPhase();
  document.getElementById("homePhaseLabel").textContent = phase.label;

  // Day badges - use today's day-of-week default badges
  Components.renderBadges("homeDayBadges", state.schedule[currentDay].badges);

  // Priority list = today's checklist (read-only quick view, but still toggleable)
  const todayKey = getTodayDateString();
  const el = document.getElementById("homePriorityList");
  el.innerHTML = "";
  const items = state.checklist[todayKey] || [];
  if (items.length === 0) {
    el.innerHTML = '<div class="empty">No tasks for today. Add some in the Schedule page.</div>';
  } else {
    items.forEach((item, i) => {
      const row = document.createElement("div");
      row.className = "checklist-row";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = item.done;
      cb.id = "home_chk_" + i;
      cb.onchange = () => {
        item.done = cb.checked;
        Storage.save(state);
        renderHome();
      };
      const label = document.createElement("label");
      label.htmlFor = cb.id;
      label.textContent = item.text;
      if (item.done) label.classList.add("done");
      row.appendChild(cb);
      row.appendChild(label);
      el.appendChild(row);
    });
  }

  // Quick link to today's schedule
  const linkRow = document.createElement("div");
  linkRow.style.marginTop = "10px";
  linkRow.style.paddingTop = "10px";
  linkRow.style.borderTop = "1px solid var(--border-soft)";
  const link = document.createElement("button");
  link.className = "btn";
  link.innerHTML = '<i class="ti ti-calendar" aria-hidden="true"></i> Open today\'s schedule';
  link.onclick = () => {
    selectedDateKey = todayKey;
    scheduleEditMode = false;
    const today = new Date();
    calYear = today.getFullYear();
    calMonth = today.getMonth();
    window.location.hash = "#schedule";
  };
  linkRow.appendChild(link);
  el.appendChild(linkRow);

  // Phase focus
  const focusEl = document.getElementById("homePhaseFocus");
  focusEl.innerHTML = "";
  phase.focus.forEach((f) => {
    const div = document.createElement("div");
    div.style.fontSize = "13.5px";
    div.style.padding = "6px 0";
    div.innerHTML = '<i class="ti ti-point-filled" aria-hidden="true" style="color:var(--accent); margin-right:6px;"></i>' + escapeHtml(f);
    focusEl.appendChild(div);
  });
}

// ===================== SCHEDULE PAGE (Split layout) =====================

let calPanelVisible = true;

function getDateStatus(dateKey) {
  const entry = state.dateSchedules[dateKey];
  if (entry && entry.status) return entry.status;
  // Auto-determine: past dates without an entry default to "completed"
  const today = getTodayDateString();
  if (dateKey < today) return "completed";
  return "draft";
}

function isDateLocked(dateKey) {
  const status = getDateStatus(dateKey);
  return status === "completed";
}

function getScheduleForDate(dateKey) {
  if (state.dateSchedules[dateKey]) return state.dateSchedules[dateKey];
  const dow = dateKeyToDayOfWeek(dateKey);
  const daySchedule = state.schedule[dow];
  const modeData = daySchedule.modes[daySchedule.activeMode];
  return {
    templateKey: dow === "Sun" ? "rest_day" : daySchedule.activeMode,
    blocks: JSON.parse(JSON.stringify(modeData.blocks)),
    note: modeData.note,
    badges: daySchedule.badges,
    status: getDateStatus(dateKey),
  };
}

function ensureDateScheduleEntry(dateKey) {
  if (!state.dateSchedules[dateKey]) {
    const data = getScheduleForDate(dateKey);
    state.dateSchedules[dateKey] = {
      templateKey: data.templateKey,
      blocks: JSON.parse(JSON.stringify(data.blocks)),
      note: data.note,
      status: getDateStatus(dateKey),
    };
  }
  if (!state.dateSchedules[dateKey].status) {
    state.dateSchedules[dateKey].status = getDateStatus(dateKey);
  }
  return state.dateSchedules[dateKey];
}

function renderSchedulePage() {
  // Wire up calendar toggle
  const toggleBtn = document.getElementById("calToggleBtn");
  const calPanel = document.getElementById("calPanel");
  const label = document.getElementById("calToggleLabel");
  toggleBtn.onclick = () => {
    calPanelVisible = !calPanelVisible;
    calPanel.classList.toggle("hidden", !calPanelVisible);
    label.textContent = calPanelVisible ? "Hide calendar" : "Show calendar";
    toggleBtn.querySelector("i").className = calPanelVisible ? "ti ti-layout-sidebar" : "ti ti-layout-sidebar-right";
  };
  calPanel.classList.toggle("hidden", !calPanelVisible);
  label.textContent = calPanelVisible ? "Hide calendar" : "Show calendar";

  renderCalendar();
  if (selectedDateKey) {
    renderDayPanel(selectedDateKey);
  }
}

function renderCalendar() {
  const monthLabel = new Date(calYear, calMonth, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  document.getElementById("calMonthLabel").textContent = monthLabel;

  document.getElementById("calPrevMonth").onclick = () => {
    calMonth -= 1;
    if (calMonth < 0) { calMonth = 11; calYear -= 1; }
    renderCalendar();
  };
  document.getElementById("calNextMonth").onclick = () => {
    calMonth += 1;
    if (calMonth > 11) { calMonth = 0; calYear += 1; }
    renderCalendar();
  };

  const weeks = buildMonthGrid(calYear, calMonth);
  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

  const table = document.createElement("table");
  table.style.cssText = "width:100%; border-collapse:collapse;";

  const thead = document.createElement("tr");
  ["M","T","W","T","F","S","S"].forEach((d) => {
    const th = document.createElement("th");
    th.textContent = d;
    th.style.cssText = "font-size:11px; font-weight:600; color:var(--text-secondary); padding:4px 2px; text-align:center;";
    thead.appendChild(th);
  });
  table.appendChild(thead);

  const todayKey = getTodayDateString();

  weeks.forEach((week) => {
    const tr = document.createElement("tr");
    week.forEach((dayNum) => {
      const td = document.createElement("td");
      td.style.cssText = "text-align:center; padding:2px;";
      if (dayNum === null) { tr.appendChild(td); return; }

      const dateKey = dateToKey(calYear, calMonth, dayNum);
      const status = getDateStatus(dateKey);
      const isToday = dateKey === todayKey;
      const isSelected = dateKey === selectedDateKey;

      const btn = document.createElement("button");
      btn.style.cssText = "width:32px; height:32px; border-radius:var(--radius-md); font-size:12px; font-weight:500; cursor:pointer; position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; transition:all 0.15s; gap:2px;";

      if (isSelected) {
        btn.style.background = "var(--accent)";
        btn.style.color = "#fff";
        btn.style.border = "2px solid var(--accent)";
      } else if (isToday) {
        btn.style.background = "var(--accent-light)";
        btn.style.color = "var(--accent-text)";
        btn.style.border = "2px solid var(--accent)";
        btn.style.fontWeight = "700";
      } else {
        btn.style.background = "var(--surface)";
        btn.style.color = "var(--text-primary)";
        btn.style.border = "1px solid var(--border-soft)";
      }

      btn.innerHTML = '<span>' + dayNum + '</span>';

      // Status dot
      if (status !== "draft" || state.dateSchedules[dateKey]) {
        const dot = document.createElement("span");
        dot.style.cssText = "width:5px; height:5px; border-radius:50%; flex-shrink:0;";
        dot.style.background = status === "completed" ? "var(--success)"
          : status === "confirmed" ? "var(--accent)"
          : "var(--text-tertiary)";
        btn.appendChild(dot);
      }

      btn.onmouseenter = () => { if (!isSelected) btn.style.borderColor = "var(--accent)"; };
      btn.onmouseleave = () => { if (!isSelected) btn.style.borderColor = isToday ? "var(--accent)" : "var(--border-soft)"; };
      btn.onclick = () => {
        selectedDateKey = dateKey;
        scheduleEditMode = false;
        renderCalendar();
        renderDayPanel(dateKey);
        // On mobile, scroll to day panel
        const dayPanel = document.getElementById("dayPanel");
        if (window.innerWidth <= 860) dayPanel.scrollIntoView({ behavior: "smooth" });
      };

      td.appendChild(btn);
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  grid.appendChild(table);
}

function renderDayPanel(dateKey) {
  document.getElementById("dayPanelEmpty").classList.add("hidden");
  document.getElementById("dayPanelContent").classList.remove("hidden");

  const entry = ensureDateScheduleEntry(dateKey);
  const status = entry.status;
  const locked = status === "completed";
  const today = getTodayDateString();
  const isPast = dateKey < today;

  // Header
  document.getElementById("selectedDateLabel").textContent = formatDateLabel(dateKey);

  // Status row
  const statusRow = document.getElementById("dayStatusRow");
  const statusLabels = { draft: "Draft", confirmed: "Confirmed", completed: "Completed" };
  const statusClasses = { draft: "status-draft", confirmed: "status-confirmed", completed: "status-completed" };
  statusRow.innerHTML = '<span class="status-badge ' + statusClasses[status] + '">' + statusLabels[status] + '</span>' +
    (isPast && status === "draft" ? '<span class="status-badge status-past">Past</span>' : '');

  // Action buttons
  const actionBtns = document.getElementById("dayActionBtns");
  actionBtns.innerHTML = "";

  if (status === "draft") {
    const confirmBtn = document.createElement("button");
    confirmBtn.className = "btn btn-primary";
    confirmBtn.innerHTML = '<i class="ti ti-check" aria-hidden="true"></i> Confirm';
    confirmBtn.onclick = () => { entry.status = "confirmed"; Storage.save(state); scheduleEditMode = false; renderCalendar(); renderDayPanel(dateKey); };
    actionBtns.appendChild(confirmBtn);
  }

  if (status === "confirmed") {
    const completeBtn = document.createElement("button");
    completeBtn.className = "btn";
    completeBtn.style.cssText = "border-color:var(--success); color:var(--success-text);";
    completeBtn.innerHTML = '<i class="ti ti-circle-check" aria-hidden="true"></i> Mark complete';
    completeBtn.onclick = () => { entry.status = "completed"; Storage.save(state); scheduleEditMode = false; renderCalendar(); renderDayPanel(dateKey); };
    actionBtns.appendChild(completeBtn);

    const unconfirmBtn = document.createElement("button");
    unconfirmBtn.className = "btn btn-ghost";
    unconfirmBtn.innerHTML = '<i class="ti ti-lock-open" aria-hidden="true"></i> Back to draft';
    unconfirmBtn.onclick = () => { entry.status = "draft"; Storage.save(state); renderCalendar(); renderDayPanel(dateKey); };
    actionBtns.appendChild(unconfirmBtn);
  }

  if (status === "completed") {
    const unlockBtn = document.createElement("button");
    unlockBtn.className = "btn btn-ghost";
    unlockBtn.style.cssText = "border-color:var(--coral); color:var(--coral-text);";
    unlockBtn.innerHTML = '<i class="ti ti-lock-open" aria-hidden="true"></i> Unlock';
    unlockBtn.onclick = () => {
      if (confirm("Unlock this completed day for editing? This changes it back to Draft.")) {
        entry.status = "draft";
        Storage.save(state);
        renderCalendar();
        renderDayPanel(dateKey);
      }
    };
    actionBtns.appendChild(unlockBtn);
  }

  // Template card — hide when locked
  const templateCard = document.getElementById("templateCard");
  if (locked) {
    templateCard.classList.add("hidden");
  } else {
    templateCard.classList.remove("hidden");
    // Template switcher
    const switcherEl = document.getElementById("templateSwitcher");
    const descEl = document.getElementById("templateDescription");
    switcherEl.innerHTML = "";
    Object.keys(SCHEDULE_TEMPLATES).forEach((key) => {
      const tpl = SCHEDULE_TEMPLATES[key];
      const btn = document.createElement("button");
      btn.className = "mode-btn" + (entry.templateKey === key ? " active" : "");
      btn.textContent = tpl.label;
      btn.onclick = () => {
        entry.templateKey = key;
        entry.blocks = JSON.parse(JSON.stringify(tpl.blocks));
        entry.note = tpl.note;
        Storage.save(state);
        renderDayPanel(dateKey);
      };
      switcherEl.appendChild(btn);
    });
    descEl.textContent = (SCHEDULE_TEMPLATES[entry.templateKey] || {}).description || "";

    // Edit toggle
    const editBtn = document.getElementById("editToggle");
    editBtn.innerHTML = scheduleEditMode
      ? '<i class="ti ti-check" aria-hidden="true"></i> Done editing'
      : '<i class="ti ti-pencil" aria-hidden="true"></i> Edit schedule';
    editBtn.classList.toggle("active", scheduleEditMode);
    editBtn.onclick = () => { scheduleEditMode = !scheduleEditMode; renderDayPanel(dateKey); };
  }

  // Locked notice
  const existingNotice = document.getElementById("lockedNotice");
  if (existingNotice) existingNotice.remove();
  if (locked) {
    const notice = document.createElement("div");
    notice.id = "lockedNotice";
    notice.className = "locked-notice";
    notice.innerHTML = '<i class="ti ti-lock" aria-hidden="true"></i> This day is completed and locked. Click "Unlock" to edit it.';
    document.getElementById("scheduleRows").parentElement.prepend(notice);
  }

  // Schedule blocks
  if (locked || !scheduleEditMode) {
    Components.renderScheduleView(entry.blocks, entry.note);
  } else {
    Components.renderScheduleEdit(entry.blocks, entry.note, {
      onFieldChange: (i, field, value) => { entry.blocks[i][field] = value; Storage.save(state); },
      onDeleteBlock: (i) => { entry.blocks.splice(i, 1); Storage.save(state); renderDayPanel(dateKey); },
      onAddBlock: (time, label, cls) => { entry.blocks.push({ time, label, cls }); Storage.save(state); renderDayPanel(dateKey); },
      onReorder: (from, to) => { const m = entry.blocks.splice(from, 1)[0]; entry.blocks.splice(to, 0, m); Storage.save(state); renderDayPanel(dateKey); },
      onNoteChange: (val) => { entry.note = val; Storage.save(state); },
    });
  }

  // Checklist
  const addRow = document.getElementById("checklistAddRow");
  if (locked) {
    addRow.classList.add("hidden");
  } else {
    addRow.classList.remove("hidden");
  }
  renderChecklistForDate(dateKey, locked);
}

function renderChecklistForDate(dateKey, locked) {
  if (!state.checklist[dateKey]) {
    const dow = dateKeyToDayOfWeek(dateKey);
    state.checklist[dateKey] = JSON.parse(JSON.stringify(state.checklist[dow] || []));
  }
  const items = state.checklist[dateKey];
  Components.renderChecklist(items, dateKey, {
    onToggle: (i, checked) => {
      if (locked) return;
      items[i].done = checked;
      Storage.save(state);
      renderChecklistForDate(dateKey, locked);
    },
    onDelete: (i) => {
      if (locked) return;
      items.splice(i, 1);
      Storage.save(state);
      renderChecklistForDate(dateKey, locked);
    },
  });
}

// ===================== COURSE PAGE =====================

function renderCoursePage() {
  const course = state.course;
  document.getElementById("coursePageSubtitle").textContent = course.provider;
  document.getElementById("courseName").textContent = course.name;

  const days = daysUntil(course.deadline);
  const deadlineDate = new Date(course.deadline + "T00:00:00");
  const deadlineLabel = deadlineDate.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  document.getElementById("courseDeadlineLabel").textContent =
    days >= 0 ? days + " days left (deadline " + deadlineLabel + ")" : "Deadline passed (" + deadlineLabel + ")";

  const progress = getCourseProgress();
  document.getElementById("courseProgressFill").style.width = progress.pct + "%";
  document.getElementById("courseProgressLabel").textContent = progress.pct + "% (" + progress.done + "/" + progress.total + " modules)";

  Components.renderCourseModules(course.modules, {
    onToggle: (i, checked) => {
      course.modules[i].done = checked;
      Storage.save(state);
      renderCoursePage();
    },
  });

  const detailsCard = document.getElementById("courseDetailsCard");
  const remaining = progress.total - progress.done;
  let pacing = "";
  if (days > 0 && remaining > 0) {
    const perDay = (remaining / days).toFixed(1);
    pacing = "At this pace, you need to complete roughly " + perDay + " module(s) per day to finish by the deadline.";
  } else if (remaining === 0) {
    pacing = "All modules complete. Great work!";
  } else if (days <= 0) {
    pacing = "The deadline has passed or is today - prioritize finishing remaining modules.";
  }
  detailsCard.innerHTML =
    '<div style="font-size:13.5px; line-height:1.7;">' +
    '<p><strong>Course:</strong> ' + escapeHtml(course.name) + '</p>' +
    '<p><strong>Provider:</strong> ' + escapeHtml(course.provider) + '</p>' +
    '<p><strong>Deadline:</strong> ' + deadlineLabel + '</p>' +
    '<p style="margin-top:8px; color:var(--text-secondary);">' + pacing + '</p>' +
    '</div>';
}

// ===================== CSE PAGE =====================

function getCSEOverall() {
  const subjects = state.cseSubjects;
  if (subjects.length === 0) return 0;
  const sum = subjects.reduce((acc, s) => acc + s.progress, 0);
  return Math.round(sum / subjects.length);
}

function renderCSEPage() {
  const editBtn = document.getElementById("cseEditToggle");
  editBtn.innerHTML = cseEditMode
    ? '<i class="ti ti-check" aria-hidden="true"></i> Done editing'
    : '<i class="ti ti-pencil" aria-hidden="true"></i> Edit progress';
  editBtn.classList.toggle("active", cseEditMode);
  editBtn.onclick = () => {
    cseEditMode = !cseEditMode;
    renderCSEPage();
  };

  Components.renderCSESubjects(state.cseSubjects, cseEditMode, {
    onChange: (i, value) => {
      state.cseSubjects[i].progress = value;
      Storage.save(state);
      renderCSEPage();
    },
  });

  const overall = getCSEOverall();
  document.getElementById("cseOverallFill").style.width = overall + "%";
  document.getElementById("cseOverallLabel").textContent = overall + "%";

  const weak = [...state.cseSubjects].sort((a, b) => a.progress - b.progress).slice(0, 2);
  if (weak.length > 0 && weak[0].progress < 100) {
    document.getElementById("cseWeakAreas").textContent =
      "Focus areas: " + weak.map((s) => s.name).join(", ") + ".";
  } else {
    document.getElementById("cseWeakAreas").textContent = "";
  }
}

// ===================== TIMER PAGE =====================

function renderPomodoroPage() {
  // Timer type tabs
  document.querySelectorAll("#timerTypeTabs .mode-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.timertype === timerType);
    btn.onclick = () => {
      if (pomodoro.running) return;
      timerType = btn.dataset.timertype;
      switchTimerType();
    };
  });

  switchTimerType();

  document.getElementById("pomodoroStart").onclick = startTimer;
  document.getElementById("pomodoroPause").onclick = pauseTimer;
  document.getElementById("pomodoroReset").onclick = resetTimer;

  // Pomodoro preset buttons
  document.querySelectorAll("#pomodoroPresets .mode-btn").forEach((btn) => {
    btn.classList.toggle("active", +btn.dataset.pomo === pomodoro.mode);
    btn.onclick = () => {
      if (pomodoro.running) return;
      pomodoro.mode = +btn.dataset.pomo;
      pomodoro.totalSeconds = pomodoro.mode * 60;
      pomodoro.remaining = pomodoro.totalSeconds;
      updateTimerDisplay();
      document.querySelectorAll("#pomodoroPresets .mode-btn").forEach((b) => b.classList.toggle("active", b === btn));
    };
  });

  // Countdown set button
  document.getElementById("setCountdownBtn").onclick = () => {
    if (pomodoro.running) return;
    const h = clamp(+document.getElementById("countdownHours").value || 0, 0, 23);
    const m = clamp(+document.getElementById("countdownMinutes").value || 0, 0, 59);
    const s = clamp(+document.getElementById("countdownSeconds").value || 0, 0, 59);
    const total = h * 3600 + m * 60 + s;
    pomodoro.totalSeconds = total > 0 ? total : 60;
    pomodoro.remaining = pomodoro.totalSeconds;
    updateTimerDisplay();
  };

  updateTimerDisplay();
  updatePomodoroStatus();
}

function switchTimerType() {
  const presetsEl = document.getElementById("pomodoroPresets");
  const countdownEl = document.getElementById("countdownInputRow");
  const statusEl = document.getElementById("pomodoroStatus");
  const startBtn = document.getElementById("pomodoroStart");

  pauseTimer();

  if (timerType === "pomodoro") {
    presetsEl.classList.remove("hidden");
    countdownEl.classList.add("hidden");
    pomodoro.totalSeconds = pomodoro.mode * 60;
    pomodoro.remaining = pomodoro.totalSeconds;
    statusEl.classList.remove("hidden");
    startBtn.innerHTML = '<i class="ti ti-player-play" aria-hidden="true"></i> Start';
  } else if (timerType === "countdown") {
    presetsEl.classList.add("hidden");
    countdownEl.classList.remove("hidden");
    const h = clamp(+document.getElementById("countdownHours").value || 0, 0, 23);
    const m = clamp(+document.getElementById("countdownMinutes").value || 0, 0, 59);
    const s = clamp(+document.getElementById("countdownSeconds").value || 0, 0, 59);
    const total = h * 3600 + m * 60 + s;
    pomodoro.totalSeconds = total > 0 ? total : 600;
    pomodoro.remaining = pomodoro.totalSeconds;
    statusEl.classList.add("hidden");
    startBtn.innerHTML = '<i class="ti ti-player-play" aria-hidden="true"></i> Start';
  } else if (timerType === "stopwatch") {
    presetsEl.classList.add("hidden");
    countdownEl.classList.add("hidden");
    pomodoro.stopwatchElapsed = 0;
    statusEl.classList.add("hidden");
    startBtn.innerHTML = '<i class="ti ti-player-play" aria-hidden="true"></i> Start';
  }

  updateTimerDisplay();
}

function updateTimerDisplay() {
  let seconds;
  if (timerType === "stopwatch") {
    seconds = pomodoro.stopwatchElapsed;
  } else {
    seconds = pomodoro.remaining;
  }
  document.getElementById("pomodoroDisplay").textContent = formatTimeLong(seconds);
}

function updatePomodoroStatus() {
  const statusEl = document.getElementById("pomodoroStatus");
  if (statusEl) {
    statusEl.textContent = "Sessions completed today: " + pomodoro.sessionsToday;
  }
}

function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.frequency.value = 880;
    osc.connect(ctx.destination);
    osc.start();
    setTimeout(() => osc.stop(), 300);
  } catch (e) {}
}

function startTimer() {
  if (pomodoro.running) return;
  pomodoro.running = true;

  if (timerType === "stopwatch") {
    pomodoro.intervalId = setInterval(() => {
      pomodoro.stopwatchElapsed += 1;
      updateTimerDisplay();
    }, 1000);
    return;
  }

  // pomodoro or countdown
  pomodoro.intervalId = setInterval(() => {
    pomodoro.remaining -= 1;
    if (pomodoro.remaining <= 0) {
      pomodoro.remaining = 0;
      updateTimerDisplay();
      clearInterval(pomodoro.intervalId);
      pomodoro.running = false;
      if (timerType === "pomodoro" && pomodoro.mode === 25) {
        pomodoro.sessionsToday += 1;
        updatePomodoroStatus();
      }
      playBeep();
      return;
    }
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  pomodoro.running = false;
  if (pomodoro.intervalId) clearInterval(pomodoro.intervalId);
}

function resetTimer() {
  pauseTimer();
  if (timerType === "stopwatch") {
    pomodoro.stopwatchElapsed = 0;
  } else {
    pomodoro.remaining = pomodoro.totalSeconds;
  }
  updateTimerDisplay();
}

// ===================== WORKOUT PAGE =====================

let workoutMode = null; // null = auto-detect from today's schedule mode

function renderWorkoutPage() {
  const tabsEl = document.getElementById("workoutModeTabs");
  tabsEl.innerHTML = "";

  // Auto-suggest based on today's schedule template
  const todayKey = getTodayDateString();
  const todaySchedule = getScheduleForDate(todayKey);
  const templateKey = todaySchedule.templateKey;
  let suggested = "heavy";
  if (templateKey === "heavy_laundry") suggested = "recovery";
  else if (templateKey === "light_laundry") suggested = "light";
  else if (templateKey === "rest_day") suggested = "recovery";
  else suggested = "heavy";

  if (workoutMode === null) workoutMode = suggested;

  Object.keys(WORKOUT_PRESETS).forEach((key) => {
    const preset = WORKOUT_PRESETS[key];
    const btn = document.createElement("button");
    btn.className = "mode-btn" + (workoutMode === key ? " active" : "");
    btn.textContent = preset.label + (key === suggested ? " (suggested)" : "");
    btn.onclick = () => {
      workoutMode = key;
      renderWorkoutPage();
    };
    tabsEl.appendChild(btn);
  });

  const preset = WORKOUT_PRESETS[workoutMode];
  document.getElementById("workoutDescription").textContent = preset.description;

  const listEl = document.getElementById("workoutExerciseList");
  listEl.innerHTML = "";
  preset.exercises.forEach((ex) => {
    const div = document.createElement("div");
    div.className = "exercise-item";
    div.textContent = ex;
    listEl.appendChild(div);
  });
}

// ===================== SLEEP PAGE =====================

function renderSleepPage() {
  Components.renderSleepLog(state.sleepLog, {
    onChange: (day, field, value) => {
      if (!state.sleepLog[day]) state.sleepLog[day] = { slept: "", woke: "", quality: 0 };
      state.sleepLog[day][field] = value;
      Storage.save(state);
      renderSleepPage();
    },
  });
}

// ===================== JOURNAL PAGE =====================

function renderJournalPage() {
  document.getElementById("journalDateLabel").textContent = formatTodayLabel();
  const todayKey = getTodayDateString();
  const entry = state.journal[todayKey] || { done: "", learned: "", tomorrow: "" };

  const doneEl = document.getElementById("journalDone");
  const learnedEl = document.getElementById("journalLearned");
  const tomorrowEl = document.getElementById("journalTomorrow");

  doneEl.value = entry.done;
  learnedEl.value = entry.learned;
  tomorrowEl.value = entry.tomorrow;

  const saveEntry = () => {
    state.journal[todayKey] = {
      done: doneEl.value,
      learned: learnedEl.value,
      tomorrow: tomorrowEl.value,
    };
    Storage.save(state);
  };

  doneEl.oninput = saveEntry;
  learnedEl.oninput = saveEntry;
  tomorrowEl.oninput = saveEntry;

  Components.renderJournalHistory(state.journal);
}

// ===================== HABITS PAGE =====================

function renderHabitsPage() {
  Components.renderHabitTable(state.habits, {
    onToggle: (h, d, checked) => {
      state.habits[h].checks[d] = checked;
      Storage.save(state);
    },
    onDelete: (h) => {
      state.habits.splice(h, 1);
      Storage.save(state);
      renderHabitsPage();
    },
  });

  Components.renderListSection(state.todos, "todoRows", {
    onToggle: (i, checked) => {
      state.todos[i].done = checked;
      Storage.save(state);
      renderHabitsPage();
    },
    onDelete: (i) => {
      state.todos.splice(i, 1);
      Storage.save(state);
      renderHabitsPage();
    },
  });

  document.getElementById("addHabitBtn").onclick = () => {
    const inp = document.getElementById("newHabitInput");
    if (inp.value.trim()) {
      state.habits.push({ name: inp.value.trim(), checks: [false, false, false, false, false, false, false] });
      inp.value = "";
      Storage.save(state);
      renderHabitsPage();
    }
  };
  document.getElementById("newHabitInput").onkeydown = (e) => {
    if (e.key === "Enter") document.getElementById("addHabitBtn").click();
  };

  document.getElementById("addTodoBtn").onclick = () => {
    const inp = document.getElementById("newTodoInput");
    if (inp.value.trim()) {
      state.todos.push({ text: inp.value.trim(), done: false });
      inp.value = "";
      Storage.save(state);
      renderHabitsPage();
    }
  };
  document.getElementById("newTodoInput").onkeydown = (e) => {
    if (e.key === "Enter") document.getElementById("addTodoBtn").click();
  };
}

// ===================== REMINDERS PAGE =====================

function renderRemindersPage() {
  Components.renderListSection(state.reminders, "reminderRows", {
    onToggle: (i, checked) => {
      state.reminders[i].done = checked;
      Storage.save(state);
      renderRemindersPage();
    },
    onDelete: (i) => {
      state.reminders.splice(i, 1);
      Storage.save(state);
      renderRemindersPage();
    },
  });

  document.getElementById("addReminderBtn").onclick = () => {
    const inp = document.getElementById("newReminderInput");
    if (inp.value.trim()) {
      state.reminders.push({ text: inp.value.trim(), done: false });
      inp.value = "";
      Storage.save(state);
      renderRemindersPage();
    }
  };
  document.getElementById("newReminderInput").onkeydown = (e) => {
    if (e.key === "Enter") document.getElementById("addReminderBtn").click();
  };
}

// ===================== SETTINGS PAGE (Cloud Sync) =====================

function renderSettingsPage() {
  const statusEl = document.getElementById("syncStatus");
  const linkedEl = document.getElementById("syncLinked");
  const notLinkedEl = document.getElementById("syncNotLinked");

  if (typeof CloudSync === "undefined" || !CloudSync.ready) {
    statusEl.textContent = "Cloud sync unavailable";
    document.getElementById("generateSyncBtn").disabled = true;
    document.getElementById("linkSyncBtn").disabled = true;
    return;
  }

  if (CloudSync.hasSyncCode()) {
    statusEl.textContent = "Synced";
    statusEl.style.color = "var(--success-text)";
    linkedEl.classList.remove("hidden");
    notLinkedEl.classList.add("hidden");
    document.getElementById("syncCodeDisplay").textContent = CloudSync.getSyncCode();
  } else {
    statusEl.textContent = "Not linked";
    statusEl.style.color = "var(--text-tertiary)";
    linkedEl.classList.add("hidden");
    notLinkedEl.classList.remove("hidden");
  }

  document.getElementById("generateSyncBtn").onclick = () => {
    const btn = document.getElementById("generateSyncBtn");
    btn.disabled = true;
    btn.innerHTML = '<i class="ti ti-loader-2" aria-hidden="true"></i> Generating...';
    CloudSync.generateSyncCode(state).then((code) => {
      renderSettingsPage();
      alert("Sync code generated: " + code + "\n\nEnter this exact code on your other devices to link them.");
    }).catch((err) => {
      btn.disabled = false;
      btn.innerHTML = '<i class="ti ti-cloud-upload" aria-hidden="true"></i> Generate sync code';
      alert("Failed to generate sync code. Check your internet connection and try again.");
      console.error(err);
    });
  };

  document.getElementById("linkSyncBtn").onclick = () => {
    const inp = document.getElementById("syncCodeInput");
    const code = inp.value.trim().toUpperCase();
    if (!code) return;
    const btn = document.getElementById("linkSyncBtn");
    btn.disabled = true;
    btn.innerHTML = '<i class="ti ti-loader-2" aria-hidden="true"></i> Linking...';
    CloudSync.linkToSyncCode(code).then((remoteState) => {
      btn.disabled = false;
      btn.innerHTML = '<i class="ti ti-link" aria-hidden="true"></i> Link';
      if (!remoteState) {
        alert("Sync code not found. Double-check the code and try again.");
        return;
      }
      if (!confirm("This will replace the data on THIS device with the data from your sync code. Continue?")) {
        CloudSync.unlink();
        return;
      }
      state = Storage._mergeWithDefaults(remoteState);
      Storage.save(state);
      renderSettingsPage();
      navigateTo(getPageFromHash());
      alert("Linked successfully! Your data is now synced.");
    }).catch((err) => {
      btn.disabled = false;
      btn.innerHTML = '<i class="ti ti-link" aria-hidden="true"></i> Link';
      alert("Failed to link. Check your internet connection and the code, then try again.");
      console.error(err);
    });
  };

  document.getElementById("unlinkSyncBtn").onclick = () => {
    if (confirm("Unlink this device from cloud sync? Your local data will stay, but it will stop syncing.")) {
      CloudSync.unlink();
      renderSettingsPage();
    }
  };
}

// Called whenever the cloud reports new data from another device
function handleRemoteUpdate(remoteState) {
  state = Storage._mergeWithDefaults(remoteState);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
  // Re-render whatever page is currently visible
  navigateTo(getPageFromHash());
}

// ===================== TASK ADD (Schedule page) =====================

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addTaskBtn").onclick = () => {
    const inp = document.getElementById("newTaskInput");
    if (inp.value.trim() && selectedDateKey) {
      if (!state.checklist[selectedDateKey]) state.checklist[selectedDateKey] = [];
      state.checklist[selectedDateKey].push({ text: inp.value.trim(), done: false });
      inp.value = "";
      Storage.save(state);
      renderChecklistForDate(selectedDateKey, isDateLocked(selectedDateKey));
    }
  };
  document.getElementById("newTaskInput").onkeydown = (e) => {
    if (e.key === "Enter") document.getElementById("addTaskBtn").click();
  };

  // Settings: reset
  document.getElementById("resetDataBtn").onclick = () => {
    if (confirm("This will permanently delete all your saved data. Are you sure?")) {
      Storage.reset();
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      navigateTo(getPageFromHash());
      alert("All data has been reset.");
    }
  };

  initTheme();
  document.getElementById("themeToggle").onclick = () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  };
  document.getElementById("themeToggleMobile").onclick = () => {
    const current = document.documentElement.getAttribute("data-theme");
    applyTheme(current === "dark" ? "light" : "dark");
  };

  // Init cloud sync
  CloudSync.onRemoteUpdate = handleRemoteUpdate;
  CloudSync.init().then(() => {
    CloudSync.resumeListening();
    // If linked, pull latest data from cloud on startup
    if (CloudSync.hasSyncCode()) {
      CloudSync.pull().then((remoteState) => {
        if (remoteState) {
          state = Storage._mergeWithDefaults(remoteState);
          Storage.save(state);
          navigateTo(getPageFromHash());
        }
      });
    }
  });

  // Initial navigation
  navigateTo(getPageFromHash());
});

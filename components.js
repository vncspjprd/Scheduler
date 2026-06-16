// components.js - Reusable UI rendering functions

const Components = {

  // ===== Schedule mode switcher =====
  renderModeSwitcher(state, currentDay, onModeChange) {
    const container = document.getElementById("modeSwitcher");
    const descEl = document.getElementById("modeDescription");
    container.innerHTML = "";
    const daySchedule = state.schedule[currentDay];
    const isSunday = currentDay === "Sun";

    Object.keys(SCHEDULE_MODES).forEach((modeKey) => {
      const mode = SCHEDULE_MODES[modeKey];
      const btn = document.createElement("button");
      btn.className = "mode-btn" + (daySchedule.activeMode === modeKey ? " active" : "");
      btn.textContent = mode.label;
      if (isSunday) {
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
      } else {
        btn.onclick = () => onModeChange(modeKey);
      }
      container.appendChild(btn);
    });

    if (isSunday) {
      descEl.textContent = "Sunday is always a rest day, regardless of mode.";
    } else {
      descEl.textContent = SCHEDULE_MODES[daySchedule.activeMode].description;
    }
  },

  // ===== Schedule badges =====
  renderBadges(containerId, badges) {
    const el = document.getElementById(containerId);
    el.innerHTML = "";
    (badges || []).forEach((b) => {
      const span = document.createElement("span");
      span.className = "badge " + b.c;
      span.textContent = b.t;
      el.appendChild(span);
    });
  },

  // ===== Schedule rows (view mode) =====
  renderScheduleView(blocks, note) {
    const rowsEl = document.getElementById("scheduleRows");
    rowsEl.innerHTML = "";
    blocks.forEach((b) => {
      const row = document.createElement("div");
      row.className = "schedule-row";
      row.innerHTML =
        '<div class="schedule-time">' + escapeHtml(b.time) + "</div>" +
        '<div class="schedule-pill ' + b.cls + '">' + escapeHtml(b.label) + "</div>";
      rowsEl.appendChild(row);
    });

    document.getElementById("addBlockContainer").innerHTML = "";
    const noteContainer = document.getElementById("noteContainer");
    noteContainer.innerHTML = "";
    if (note) {
      const div = document.createElement("div");
      div.className = "schedule-note";
      div.textContent = note;
      noteContainer.appendChild(div);
    }
  },

  // ===== Schedule rows (edit mode with drag reorder) =====
  renderScheduleEdit(blocks, note, callbacks) {
    const rowsEl = document.getElementById("scheduleRows");
    rowsEl.innerHTML = "";

    blocks.forEach((b, i) => {
      const row = document.createElement("div");
      row.className = "schedule-row editing";
      row.draggable = true;
      row.dataset.index = i;
      row.innerHTML =
        '<span class="drag-handle" aria-label="Drag to reorder"><i class="ti ti-grip-vertical" aria-hidden="true"></i></span>' +
        '<div class="time-picker-wrap" data-i="' + i + '">' +
          '<input type="time" class="time-start" value="' + Components._timeToInput(b.time, "start") + '" aria-label="Start time">' +
          '<span class="time-sep">to</span>' +
          '<input type="time" class="time-end" value="' + Components._timeToInput(b.time, "end") + '" aria-label="End time">' +
        '</div>' +
        '<input type="text" class="schedule-label-input" value="' + escapeHtml(b.label) + '" data-field="label" data-i="' + i + '">' +
        '<select class="tag-select" data-field="cls" data-i="' + i + '">' + Components._tagOptionsHtml(b.cls) + "</select>" +
        '<button class="del-btn" data-del-block="' + i + '" aria-label="Remove block"><i class="ti ti-trash" aria-hidden="true"></i></button>';
      rowsEl.appendChild(row);
    });

    // Label + tag field listeners
    rowsEl.querySelectorAll("[data-field]").forEach((inp) => {
      inp.addEventListener("input", () => {
        const i = +inp.dataset.i, field = inp.dataset.field;
        callbacks.onFieldChange(i, field, inp.value);
      });
    });
    rowsEl.querySelectorAll("[data-del-block]").forEach((btn) => {
      btn.onclick = () => callbacks.onDeleteBlock(+btn.dataset.delBlock);
    });

    // Time picker listeners
    rowsEl.querySelectorAll(".time-picker-wrap").forEach((wrap) => {
      const i = +wrap.dataset.i;
      const startEl = wrap.querySelector(".time-start");
      const endEl = wrap.querySelector(".time-end");
      const update = () => {
        const timeStr = Components._inputToTimeStr(startEl.value, endEl.value);
        callbacks.onFieldChange(i, "time", timeStr);
      };
      startEl.addEventListener("change", update);
      endEl.addEventListener("change", update);
    });

    // Drag-and-drop reordering
    let dragSrcIndex = null;
    const rows = rowsEl.querySelectorAll(".schedule-row.editing");
    rows.forEach((row) => {
      row.addEventListener("dragstart", (e) => {
        dragSrcIndex = +row.dataset.index;
        row.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
      });
      row.addEventListener("dragend", () => {
        row.classList.remove("dragging");
        rows.forEach((r) => r.classList.remove("drag-over"));
      });
      row.addEventListener("dragover", (e) => {
        e.preventDefault();
        row.classList.add("drag-over");
      });
      row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
      row.addEventListener("drop", (e) => {
        e.preventDefault();
        row.classList.remove("drag-over");
        const dropIndex = +row.dataset.index;
        if (dragSrcIndex === null || dragSrcIndex === dropIndex) return;
        callbacks.onReorder(dragSrcIndex, dropIndex);
      });
    });

    // Add block row
    const addContainer = document.getElementById("addBlockContainer");
    addContainer.innerHTML = "";
    const addRow = document.createElement("div");
    addRow.className = "add-block-row";
    addRow.innerHTML =
      '<div class="time-picker-wrap" id="newBlockTimePicker">' +
        '<input type="time" id="newBlockStart" aria-label="Start time">' +
        '<span class="time-sep">to</span>' +
        '<input type="time" id="newBlockEnd" aria-label="End time">' +
      '</div>' +
      '<input type="text" class="schedule-label-input" id="newBlockLabel" placeholder="Activity">' +
      '<select id="newBlockTag" class="tag-select">' + Components._tagOptionsHtml("tag-free") + "</select>" +
      '<button class="btn" id="addBlockBtn"><i class="ti ti-plus" aria-hidden="true"></i> Add block</button>';
    addContainer.appendChild(addRow);
    document.getElementById("addBlockBtn").onclick = () => {
      const startVal = document.getElementById("newBlockStart").value;
      const endVal = document.getElementById("newBlockEnd").value;
      const time = Components._inputToTimeStr(startVal, endVal);
      const label = document.getElementById("newBlockLabel").value.trim();
      const cls = document.getElementById("newBlockTag").value;
      if (time && label) callbacks.onAddBlock(time, label, cls);
    };

    // Note editor
    const noteContainer = document.getElementById("noteContainer");
    noteContainer.innerHTML = "";
    const textarea = document.createElement("textarea");
    textarea.className = "note-edit";
    textarea.placeholder = "Notes for this day...";
    textarea.value = note || "";
    textarea.oninput = () => callbacks.onNoteChange(textarea.value);
    noteContainer.appendChild(textarea);
  },

  _tagOptionsHtml(selected) {
    return TAG_OPTIONS.map((o) => '<option value="' + o.value + '"' + (o.value === selected ? " selected" : "") + ">" + o.label + "</option>").join("");
  },

  // ===== Time picker helpers =====
  _timeToInput(timeStr, which) {
    if (!timeStr) return "";
    if (/^morning$/i.test(timeStr.trim())) return which === "start" ? "06:00" : "09:00";
    if (/^afternoon$/i.test(timeStr.trim())) return which === "start" ? "12:00" : "17:00";
    if (/^evening/i.test(timeStr.trim())) return which === "start" ? "18:00" : "21:00";
    const parts = timeStr.split(/\s*[-–]\s*/);
    if (parts.length < 2) {
      return which === "start" ? Components._parseTimeTo24(parts[0]) : "";
    }
    const raw = which === "start" ? parts[0].trim() : parts[1].trim();
    return Components._parseTimeTo24(raw);
  },

  _parseTimeTo24(str) {
    if (!str) return "";
    str = str.trim().replace(/onwards|only|onwards.*$/i, "").trim();
    const isPM = /pm/i.test(str);
    const isAM = /am/i.test(str);
    str = str.replace(/[apm\s]/gi, "").trim();
    const colonIdx = str.indexOf(":");
    let h, m;
    if (colonIdx !== -1) {
      h = parseInt(str.slice(0, colonIdx));
      m = parseInt(str.slice(colonIdx + 1));
    } else {
      h = parseInt(str);
      m = 0;
    }
    if (isNaN(h) || isNaN(m)) return "";
    if (isPM && h !== 12) h += 12;
    if (isAM && h === 12) h = 0;
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
  },

  _inputToTimeStr(startVal, endVal) {
    if (!startVal && !endVal) return "";
    const fmt = (val) => {
      if (!val) return "";
      const [hStr, mStr] = val.split(":");
      let h = parseInt(hStr), m = parseInt(mStr);
      const suffix = h >= 12 ? "PM" : "AM";
      if (h > 12) h -= 12;
      if (h === 0) h = 12;
      return h + ":" + String(m).padStart(2, "0") + " " + suffix;
    };
    if (!endVal) return fmt(startVal);
    return fmt(startVal) + " - " + fmt(endVal);
  },

  // ===== Checklist =====
  renderChecklist(items, currentDay, callbacks) {
    const el = document.getElementById("checklistRows");
    el.innerHTML = "";
    if (!items || items.length === 0) {
      el.innerHTML = '<div class="empty">No tasks yet for ' + currentDay + ". Add one below.</div>";
    } else {
      items.forEach((item, i) => {
        const row = document.createElement("div");
        row.className = "checklist-row";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = item.done;
        cb.id = "chk_" + currentDay + "_" + i;
        cb.onchange = () => callbacks.onToggle(i, cb.checked);
        const label = document.createElement("label");
        label.htmlFor = cb.id;
        label.textContent = item.text;
        if (item.done) label.classList.add("done");
        const del = document.createElement("button");
        del.className = "del-btn";
        del.innerHTML = '<i class="ti ti-x" aria-hidden="true"></i>';
        del.setAttribute("aria-label", "Remove task");
        del.onclick = () => callbacks.onDelete(i);
        row.appendChild(cb);
        row.appendChild(label);
        row.appendChild(del);
        el.appendChild(row);
      });
    }
    const done = (items || []).filter((x) => x.done).length;
    const total = (items || []).length;
    document.getElementById("dayProgressLabel").textContent = done + " / " + total;
    document.getElementById("dayProgress").style.width = (total ? Math.round((done / total) * 100) : 0) + "%";
    return { done, total };
  },

  // ===== Generic list section (todos, reminders) =====
  renderListSection(items, containerId, callbacks) {
    const el = document.getElementById(containerId);
    el.innerHTML = "";
    if (items.length === 0) {
      el.innerHTML = '<div class="empty">Nothing here yet. Add one below.</div>';
      return;
    }
    items.forEach((item, i) => {
      const row = document.createElement("div");
      row.className = "checklist-row";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = item.done;
      cb.id = containerId + "_" + i;
      cb.onchange = () => callbacks.onToggle(i, cb.checked);
      const label = document.createElement("label");
      label.htmlFor = cb.id;
      label.textContent = item.text;
      if (item.done) label.classList.add("done");
      const del = document.createElement("button");
      del.className = "del-btn";
      del.innerHTML = '<i class="ti ti-x" aria-hidden="true"></i>';
      del.setAttribute("aria-label", "Remove item");
      del.onclick = () => callbacks.onDelete(i);
      row.appendChild(cb);
      row.appendChild(label);
      row.appendChild(del);
      el.appendChild(row);
    });
  },

  // ===== Habit table =====
  renderHabitTable(habits, callbacks) {
    const table = document.getElementById("habitTable");
    let html = "<tr><th>Habit</th>";
    DAYS.forEach((d) => (html += "<th>" + d + "</th>"));
    html += "<th></th></tr>";
    habits.forEach((h, hi) => {
      html += "<tr><td>" + escapeHtml(h.name) + "</td>";
      h.checks.forEach((c, di) => {
        html += '<td><input type="checkbox" ' + (c ? "checked" : "") + ' data-h="' + hi + '" data-d="' + di + '" class="habit-cb"></td>';
      });
      html += '<td><button class="del-btn" data-del-habit="' + hi + '" aria-label="Remove habit"><i class="ti ti-x" aria-hidden="true"></i></button></td></tr>';
    });
    table.innerHTML = html;
    table.querySelectorAll(".habit-cb").forEach((cb) => {
      cb.onchange = () => callbacks.onToggle(+cb.dataset.h, +cb.dataset.d, cb.checked);
    });
    table.querySelectorAll("[data-del-habit]").forEach((btn) => {
      btn.onclick = () => callbacks.onDelete(+btn.dataset.delHabit);
    });
  },

  // ===== Course module list =====
  renderCourseModules(modules, callbacks) {
    const el = document.getElementById("courseModuleList");
    el.innerHTML = "";
    modules.forEach((m, i) => {
      const row = document.createElement("div");
      row.className = "checklist-row";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = m.done;
      cb.id = "module_" + i;
      cb.onchange = () => callbacks.onToggle(i, cb.checked);
      const label = document.createElement("label");
      label.htmlFor = cb.id;
      label.textContent = "Module " + m.id + ": " + m.name;
      if (m.done) label.classList.add("done");
      row.appendChild(cb);
      row.appendChild(label);
      el.appendChild(row);
    });
  },

  // ===== CSE subjects =====
  renderCSESubjects(subjects, editMode, callbacks) {
    const el = document.getElementById("cseSubjectList");
    el.innerHTML = "";
    subjects.forEach((s, i) => {
      const row = document.createElement("div");
      row.className = "subject-row" + (editMode ? " editing" : "");
      row.innerHTML =
        '<div class="subject-head"><span class="subject-name">' + escapeHtml(s.name) + '</span><span class="subject-pct">' + s.progress + '%</span></div>' +
        '<div class="progress-bar"><div class="progress-fill" style="width:' + s.progress + '%"></div></div>' +
        '<input type="range" min="0" max="100" value="' + s.progress + '" data-i="' + i + '">';
      el.appendChild(row);
      if (editMode) {
        row.querySelector("input[type=range]").addEventListener("input", (e) => {
          callbacks.onChange(i, +e.target.value);
        });
      }
    });
  },

  // ===== Sleep tracker =====
  renderSleepLog(sleepLog, callbacks) {
    const el = document.getElementById("sleepRows");
    el.innerHTML = "";
    DAYS.forEach((day) => {
      const entry = sleepLog[day] || { slept: "", woke: "", quality: 0 };
      const row = document.createElement("div");
      row.className = "sleep-row";
      row.innerHTML =
        '<span class="sleep-day">' + day + "</span>" +
        '<input type="time" data-day="' + day + '" data-field="slept" value="' + (entry.slept || "") + '" aria-label="Sleep time">' +
        '<span class="text-tertiary" style="font-size:11px;">to</span>' +
        '<input type="time" data-day="' + day + '" data-field="woke" value="' + (entry.woke || "") + '" aria-label="Wake time">' +
        '<div class="star-rating" data-day="' + day + '" role="group" aria-label="Sleep quality"></div>';
      el.appendChild(row);

      row.querySelectorAll("input[type=time]").forEach((inp) => {
        inp.addEventListener("change", () => {
          callbacks.onChange(day, inp.dataset.field, inp.value);
        });
      });

      const starContainer = row.querySelector(".star-rating");
      for (let star = 1; star <= 5; star++) {
        const btn = document.createElement("button");
        btn.innerHTML = '<i class="ti ti-star-filled" aria-hidden="true"></i>';
        btn.setAttribute("aria-label", star + " star" + (star > 1 ? "s" : ""));
        if (star <= (entry.quality || 0)) btn.classList.add("filled");
        btn.onclick = () => callbacks.onChange(day, "quality", star);
        starContainer.appendChild(btn);
      }
    });
  },

  // ===== Journal history =====
  renderJournalHistory(journal) {
    const el = document.getElementById("journalHistory");
    const dates = Object.keys(journal).sort().reverse();
    if (dates.length === 0) {
      el.innerHTML = '<div class="empty">No past entries yet.</div>';
      return;
    }
    el.innerHTML = "";
    dates.slice(0, 14).forEach((date) => {
      const entry = journal[date];
      if (!entry.done && !entry.learned && !entry.tomorrow) return;
      const div = document.createElement("div");
      div.style.marginBottom = "1rem";
      div.style.paddingBottom = "1rem";
      div.style.borderBottom = "1px solid var(--border-soft)";
      const dateObj = new Date(date + "T00:00:00");
      const dateLabel = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      let html = '<div style="font-weight:600; font-size:13px; margin-bottom:6px;">' + dateLabel + "</div>";
      if (entry.done) html += '<div style="font-size:12.5px; margin-bottom:4px;"><strong>Finished:</strong> ' + escapeHtml(entry.done) + "</div>";
      if (entry.learned) html += '<div style="font-size:12.5px; margin-bottom:4px;"><strong>Learned:</strong> ' + escapeHtml(entry.learned) + "</div>";
      if (entry.tomorrow) html += '<div style="font-size:12.5px;"><strong>Next:</strong> ' + escapeHtml(entry.tomorrow) + "</div>";
      div.innerHTML = html;
      el.appendChild(div);
    });
    if (el.innerHTML === "") {
      el.innerHTML = '<div class="empty">No past entries yet.</div>';
    }
  },
};

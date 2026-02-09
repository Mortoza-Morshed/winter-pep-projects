import { storage } from "../storage.js";

export default function render(container) {
  const renderContent = () => {
    const subjects = storage.get("subjects") || [];
    const activeDay = localStorage.getItem("activeScheduleDay") || "Monday";

    container.innerHTML = `
            <div>
                <div class="row" style="align-items:center; margin-bottom:20px;">
                    <h2>Schedule</h2>
                    <button id="add-class-btn" class="btn-primary">Add Class</button>
                </div>

                <div class="tabs">
                    ${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                      .map(
                        (d) =>
                          `<button class="tab-btn ${d === activeDay ? "active" : ""}" data-day="${d}">${d}</button>`,
                      )
                      .join("")}
                </div>

                <div id="schedule-list" style="margin-top:20px;">
                    <!-- Schedule items -->
                </div>

                <!-- Modal -->
                <div id="sch-modal" class="modal hidden">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Add Class</h3>
                            <button class="close-modal" id="close-sch">X</button>
                        </div>
                        <form id="sch-form">
                            <div class="form-group">
                                <label>Day</label>
                                <select id="s-day">
                                    <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
                                    <option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Subject</label>
                                <select id="s-subject">
                                    ${subjects.map((s) => `<option value="${s.id}">${s.name}</option>`).join("")}
                                </select>
                            </div>
                            <div class="row">
                                <div class="form-group"><label>Start</label><input type="time" id="s-start" required></div>
                                <div class="form-group"><label>End</label><input type="time" id="s-end" required></div>
                            </div>
                            <div class="form-group">
                                <label>Room</label>
                                <input type="text" id="s-room">
                            </div>
                            <button type="submit" class="btn-primary" style="width:100%">Save</button>
                        </form>
                    </div>
                </div>
            </div>
            <style>
                .tabs { display: flex; gap: 10px; border-bottom: 1px solid #ddd; padding-bottom: 10px; overflow-x: auto;}
                .tab-btn { background: none; border: none; padding: 10px; cursor: pointer; color: #666; }
                .tab-btn.active { color: #4361ee; font-weight: bold; border-bottom: 2px solid #4361ee; }
                .sch-item { display:flex; justify-content:space-between; align-items:center; background: white; padding: 15px; margin-bottom:10px; border-radius:4px; border:1px solid #ddd; }
            </style>
        `;

    setupEvents();
    renderScheduleList(activeDay);
  };

  const setupEvents = () => {
    const modal = document.getElementById("sch-modal");
    document.getElementById("add-class-btn").onclick = () => modal.classList.remove("hidden");
    document.getElementById("close-sch").onclick = () => modal.classList.add("hidden");

    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        localStorage.setItem("activeScheduleDay", btn.dataset.day);
        renderScheduleList(btn.dataset.day);
      };
    });

    document.getElementById("sch-form").onsubmit = (e) => {
      e.preventDefault();
      const data = {
        id: crypto.randomUUID(),
        day: document.getElementById("s-day").value,
        subjectId: document.getElementById("s-subject").value,
        startTime: document.getElementById("s-start").value,
        endTime: document.getElementById("s-end").value,
        room: document.getElementById("s-room").value,
      };
      storage.addItem("schedule", data);
      modal.classList.add("hidden");
      document.getElementById("sch-form").reset();

      // If added to current view, refresh
      const active = document.querySelector(".tab-btn.active").dataset.day;
      if (data.day === active) renderScheduleList(active);
    };
  };

  const renderScheduleList = (day) => {
    const list = document.getElementById("schedule-list");
    const data = storage.load();
    const items = data.schedule
      .filter((s) => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (items.length === 0) {
      list.innerHTML = '<p style="text-align:center; padding:20px; color:gray;">Free day!</p>';
      return;
    }

    list.innerHTML = items
      .map((item) => {
        const sub = data.subjects.find((s) => s.id === item.subjectId);
        return `
                <div class="sch-item" style="border-left: 4px solid ${sub ? sub.color : "#ccc"}">
                    <div>
                        <strong>${item.startTime} - ${item.endTime}</strong>
                        <span>${sub ? sub.name : "Unknown"}</span>
                        <small>(${item.room})</small>
                    </div>
                    <button class="btn-sec del-sch" data-id="${item.id}">Remove</button>
                </div>
            `;
      })
      .join("");

    list.querySelectorAll(".del-sch").forEach((btn) => {
      btn.onclick = () => {
        if (confirm("Remove?")) {
          storage.deleteItem("schedule", btn.dataset.id);
          renderScheduleList(day);
        }
      };
    });
  };

  renderContent();
}

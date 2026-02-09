import { storage } from "../storage.js";

export default function render(container) {
  const renderContent = () => {
    const data = storage.load();
    const subjects = data.subjects || [];
    // Determine active day: default to today, or first day
    let today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    // Retrieve last active tab from memory if needed, but for now just use today

    container.innerHTML = `
            <div class="schedule-container">
                <div class="page-header">
                    <div>
                        <h2>Weekly Timetable</h2>
                        <p class="summary-text">Manage your class times and study blocks.</p>
                    </div>
                    <button id="add-schedule-btn" class="btn-primary">Add Class</button>
                </div>

                <div class="tabs-container">
                    <div class="schedule-tabs">
                        ${[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ]
                          .map(
                            (day) =>
                              `<button class="tab-btn ${day === today ? "active" : ""}" data-day="${day}">${day}</button>`,
                          )
                          .join("")}
                    </div>
                </div>

                <div id="schedule-display" class="schedule-list-view">
                    <!-- Schedule items injected here -->
                </div>

                <!-- Modal -->
                <div id="schedule-modal" class="modal hidden">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>Add Schedule Item</h2>
                            <button class="close-modal" id="close-modal-x">&times;</button>
                        </div>
                        <form id="schedule-form">
                            <div class="form-group">
                                <label>Day of Week</label>
                                <select id="sch-day">
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Sunday">Sunday</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Subject</label>
                                <select id="sch-subject" required>
                                    <option value="">Select Subject</option>
                                    ${subjects.map((s) => `<option value="${s.id}">${s.name}</option>`).join("")}
                                </select>
                            </div>

                            <div class="row">
                                <div class="form-group">
                                    <label>Start Time</label>
                                    <input type="time" id="sch-start" required>
                                </div>
                                <div class="form-group">
                                    <label>End Time</label>
                                    <input type="time" id="sch-end" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Location / Room</label>
                                <input type="text" id="sch-room" placeholder="e.g. Room 304">
                            </div>

                            <div class="modal-actions">
                                <button type="button" class="btn-sec" id="cancel-sch">Cancel</button>
                                <button type="submit" class="btn-primary">Save Schedule</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border);
                }

                .page-header h2 { font-size: 1.5rem; margin-bottom: 0.25rem; }
                .summary-text { color: var(--text-muted); font-size: 0.9rem; }

                .tabs-container {
                    margin-bottom: 1.5rem;
                    border-bottom: 1px solid var(--border);
                }

                .schedule-tabs {
                    display: flex;
                    gap: 1.5rem;
                    overflow-x: auto;
                    padding-bottom: 2px; /* For focus outline */
                }

                .tab-btn {
                    padding: 0.75rem 0;
                    border: none;
                    background: none;
                    cursor: pointer;
                    color: var(--text-muted);
                    font-weight: 500;
                    font-size: 0.95rem;
                    position: relative;
                    transition: color 0.2s;
                    white-space: nowrap;
                }

                .tab-btn:hover { color: var(--primary); }

                .tab-btn.active {
                    color: var(--primary);
                    font-weight: 600;
                }

                .tab-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: var(--primary);
                }

                .schedule-list-view {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    min-height: 200px;
                }
                
                .schedule-card {
                    display: grid;
                    grid-template-columns: 100px 1fr auto;
                    align-items: center;
                    background: var(--bg-surface);
                    padding: 1.25rem;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border);
                    transition: border-color 0.2s;
                }
                
                .schedule-card:hover {
                    border-color: var(--border-hover);
                    box-shadow: var(--shadow-sm);
                }

                .time-group {
                    display: flex;
                    flex-direction: column;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-main);
                }
                .time-group span:last-child {
                    font-weight: 400;
                    color: var(--text-muted);
                    font-size: 0.8rem;
                }

                .class-info h3 { margin: 0 0 0.25rem 0; font-size: 1.1rem; }
                .class-info p { margin: 0; color: var(--text-muted); font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem; }
                
                .room-badge {
                    background: var(--bg-body);
                    padding: 0.15rem 0.5rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    border: 1px solid var(--border);
                }

                .delete-sch-btn {
                    background: none;
                    border: none;
                    color: var(--text-light);
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 4px;
                    transition: 0.2s;
                }
                .delete-sch-btn:hover { color: var(--danger); background: #fee2e2; }

                .empty-day-state {
                    text-align: center;
                    padding: 4rem 1rem;
                    color: var(--text-muted);
                    background: var(--bg-surface);
                    border-radius: var(--radius-md);
                    border: 1px dashed var(--border);
                }
            </style>
        `;

    setupEvents(container);

    const activeBtn =
      container.querySelector(".tab-btn.active") || container.querySelector(".tab-btn");
    if (activeBtn) {
      activeBtn.click(); // Trigger load
    }
  };

  const setupEvents = (container) => {
    // Tab Switching
    container.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        showDaySchedule(btn.dataset.day);
      });
    });

    // Modal
    const modal = container.querySelector("#schedule-modal");
    const form = container.querySelector("#schedule-form");

    container.querySelector("#add-schedule-btn").onclick = () => modal.classList.remove("hidden");
    container.querySelector("#cancel-sch").onclick = () => modal.classList.add("hidden");
    container.querySelector("#close-modal-x").onclick = () => modal.classList.add("hidden");

    // Form Submit
    form.onsubmit = (e) => {
      e.preventDefault();
      const subjectId = document.getElementById("sch-subject").value;
      const day = document.getElementById("sch-day").value;
      const start = document.getElementById("sch-start").value;
      const end = document.getElementById("sch-end").value;
      const room = document.getElementById("sch-room").value;

      // Conflict Check
      const currentSchedule = storage.get("schedule") || [];
      const hasConflict = currentSchedule.some(
        (s) =>
          s.day === day &&
          ((start >= s.startTime && start < s.endTime) || (end > s.startTime && end <= s.endTime)),
      );

      if (hasConflict) {
        alert("Conflict detected: You already have a class during this time slot.");
        return;
      }

      storage.addItem("schedule", {
        id: crypto.randomUUID(),
        day,
        subjectId,
        startTime: start,
        endTime: end,
        room,
      });

      modal.classList.add("hidden");
      form.reset();

      // Refresh view if on same day
      const activeDay = container.querySelector(".tab-btn.active").dataset.day;
      if (activeDay === day) {
        showDaySchedule(day);
      } else {
        // Switch key
        container.querySelector(`.tab-btn[data-day="${day}"]`).click();
      }
    };
  };

  const showDaySchedule = (day) => {
    const display = document.getElementById("schedule-display");
    const data = storage.load();
    const schedule = (data.schedule || [])
      .filter((s) => s.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (schedule.length === 0) {
      display.innerHTML = '<div class="empty-day-state">No classes scheduled for this day.</div>';
      return;
    }

    display.innerHTML = schedule
      .map((item) => {
        const subject = data.subjects.find((s) => s.id === item.subjectId) || {
          name: "Unknown",
          color: "#ccc",
        };
        return `
                <div class="schedule-card" style="border-left: 4px solid ${subject.color}">
                    <div class="time-group">
                        <span>${item.startTime}</span>
                        <span>${item.endTime}</span>
                    </div>
                    <div class="class-info">
                        <h3>${subject.name}</h3>
                        <p>
                            <span class="room-badge">${item.room || "online"}</span>
                        </p>
                    </div>
                    <button class="delete-sch-btn" data-id="${item.id}" title="Remove Class">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
            `;
      })
      .join("");

    display.querySelectorAll(".delete-sch-btn").forEach((btn) => {
      btn.onclick = () => {
        if (confirm("Remove this class from schedule?")) {
          storage.deleteItem("schedule", btn.dataset.id);
          showDaySchedule(day);
        }
      };
    });
  };

  renderContent();
}

import { storage } from "../storage.js";

export default function render(container) {
  const data = storage.load();
  const tasks = data.tasks || [];
  const subjects = data.subjects || [];
  const schedule = data.schedule || [];

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const tasksPending = tasks.filter((t) => !t.completed).length;
  const tasksTotal = tasks.length;

  // Simple stats
  container.innerHTML = `
        <div class="dashboard-grid">
            <div class="row">
                <div class="card stat-card">
                    <h3>Active Subjects</h3>
                    <p class="stat-num">${subjects.length}</p>
                </div>
                <div class="card stat-card">
                    <h3>Pending Tasks</h3>
                    <p class="stat-num">${tasksPending}</p>
                </div>
                <div class="card stat-card">
                    <h3>Today's Classes</h3>
                    <p class="stat-num">${schedule.filter((s) => s.day === today).length}</p>
                </div>
            </div>

            <div class="row">
                <div class="card">
                    <div class="card-header">
                        <h2>Today's Schedule (${today})</h2>
                    </div>
                    <div id="today-schedule">
                         ${renderTodaySchedule(schedule, subjects, today)}
                    </div>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h2>Next Tasks</h2>
                    </div>
                    <div id="quick-tasks">
                        ${renderQuickTasks(tasks, subjects)}
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            .stat-card { text-align: center; }
            .stat-num { font-size: 2rem; font-weight: bold; color: var(--primary); margin-top: 10px; }
            .card-header { margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 10px; }
            .schedule-item { 
                padding: 10px; 
                margin-bottom: 10px; 
                background: var(--bg-body); 
                border-left: 4px solid var(--primary); 
                border-radius: 4px;
            }
            .task-item {
                padding: 10px;
                border-bottom: 1px solid var(--border);
                display: flex;
                justify-content: space-between;
            }
        </style>
    `;
}

function renderTodaySchedule(schedule, subjects, today) {
  const todays = schedule
    .filter((s) => s.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (todays.length === 0) return "<p>No classes today.</p>";

  return todays
    .map((item) => {
      const sub = subjects.find((s) => s.id === item.subjectId);
      return `
            <div class="schedule-item" style="border-color: ${sub ? sub.color : "#ccc"}">
                <strong>${item.startTime} - ${item.endTime}</strong>
                <span>${sub ? sub.name : "Unknown Subject"}</span>
                <small>(${item.room || "Room TBA"})</small>
            </div>
        `;
    })
    .join("");
}

function renderQuickTasks(tasks, subjects) {
  const pending = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  if (pending.length === 0) return "<p>No pending tasks.</p>";

  return pending
    .map((t) => {
      return `
            <div class="task-item">
                <span>${t.title}</span>
                <small>${t.dueDate}</small>
            </div>
        `;
    })
    .join("");
}

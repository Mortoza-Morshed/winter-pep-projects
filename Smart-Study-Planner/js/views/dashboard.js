import { storage } from "../storage.js";

export default function render(container) {
  const data = storage.load();
  const { subjects, tasks, schedule } = data;

  // Calculate Summary Stats
  const activeSubjects = subjects.length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const upcomingTasks = tasks
    .filter((t) => !t.completed && new Date(t.dueDate) > new Date())
    .slice(0, 3);

  // Get schedule for today
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todayName = days[new Date().getDay()];
  const todaySchedule = schedule
    .filter((s) => s.day === todayName)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const html = `
        <div class="dashboard-grid">
            <!-- Stats Cards -->
            <div class="stats-container">
                <div class="card stat-card">
                    <div class="stat-icon primary-bg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    </div>
                    <div class="stat-info">
                        <h3>${activeSubjects}</h3>
                        <p>Subjects</p>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon danger-bg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    </div>
                    <div class="stat-info">
                        <h3>${pendingTasks}</h3>
                        <p>Pending Tasks</p>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon success-bg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    </div>
                    <div class="stat-info">
                        <h3>${todaySchedule.length}</h3>
                        <p>Classes Today</p>
                    </div>
                </div>
            </div>

            <div class="content-split">
                <!-- Today's Schedule -->
                <div class="card schedule-section">
                    <div class="card-header">
                        <h2>Today's Schedule</h2>
                        <span class="sub-header">${todayName}</span>
                    </div>
                    <div class="schedule-list">
                        ${
                          todaySchedule.length > 0
                            ? todaySchedule
                                .map((s) => {
                                  const subject = subjects.find(
                                    (sub) => sub.id === s.subjectId,
                                  ) || { name: "Unknown", color: "#ccc" };
                                  return `
                                <div class="schedule-item">
                                    <div class="time-col">
                                        <span class="time-start">${s.startTime}</span>
                                        <span class="time-end">${s.endTime}</span>
                                    </div>
                                    <div class="schedule-content" style="border-left: 4px solid ${subject.color}">
                                        <h4>${subject.name}</h4>
                                        <span class="room-tag">${s.room || "online"}</span>
                                    </div>
                                </div>
                            `;
                                })
                                .join("")
                            : '<p class="empty-state">No classes scheduled for today.</p>'
                        }
                    </div>
                </div>

                <!-- Upcoming Tasks -->
                <div class="card tasks-section">
                    <div class="card-header">
                        <h2>Upcoming Deadlines</h2>
                        <button class="btn-link" onclick="document.querySelector('[data-view=\\'tasks\\']').click()">See all</button>
                    </div>
                    <div class="task-list-preview">
                        ${
                          upcomingTasks.length > 0
                            ? upcomingTasks
                                .map((t) => {
                                  const subject = subjects.find(
                                    (sub) => sub.id === t.subjectId,
                                  ) || { name: "General", color: "var(--text-muted)" };
                                  return `
                                <div class="task-preview-item">
                                    <div class="task-info">
                                        <div class="task-top">
                                            <span class="subject-dot" style="background-color: ${subject.color}"></span>
                                            <span class="subject-name">${subject.name}</span>
                                        </div>
                                        <h4>${t.title}</h4>
                                        <span class="due-date">Due: ${t.dueDate}</span>
                                    </div>
                                </div>
                            `;
                                })
                                .join("")
                            : '<p class="empty-state">No upcoming deadlines.</p>'
                        }
                    </div>
                </div>
            </div>
        </div>

        <style>
            .dashboard-grid {
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }

            .stats-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 1.5rem;
            }

            .stat-card {
                padding: 1.5rem;
                display: flex;
                align-items: center;
                gap: 1.25rem;
                background: var(--bg-surface);
                border: 1px solid var(--border);
                border-radius: var(--radius-lg);
            }

            .stat-icon {
                width: 48px;
                height: 48px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .primary-bg { background: var(--primary-light); color: var(--primary); }
            .danger-bg { background: #fee2e2; color: var(--danger); }
            .success-bg { background: #dcfce7; color: var(--success); }

            .stat-info h3 {
                font-size: 1.75rem;
                font-weight: 700;
                line-height: 1;
                margin-bottom: 0.25rem;
            }

            .stat-info p {
                color: var(--text-muted);
                font-size: 0.875rem;
                font-weight: 500;
            }

            .content-split {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1.5rem;
            }

            @media (max-width: 900px) {
                .content-split { grid-template-columns: 1fr; }
            }

            .card-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid var(--border);
            }

            .card-header h2 { font-size: 1.1rem; font-weight: 600; }
            .sub-header { color: var(--text-muted); font-size: 0.9rem; }

            .btn-link {
                background: none;
                border: none;
                color: var(--primary);
                font-size: 0.85rem;
                cursor: pointer;
                font-weight: 500;
            }

            /* Clean Schedule List */
            .schedule-item {
                display: flex;
                margin-bottom: 1rem;
            }

            .time-col {
                display: flex;
                flex-direction: column;
                min-width: 80px;
                padding-right: 1rem;
                text-align: right;
                justify-content: center;
            }

            .time-start { font-weight: 600; font-size: 0.95rem; }
            .time-end { color: var(--text-muted); font-size: 0.8rem; }

            .schedule-content {
                flex: 1;
                background: var(--bg-body);
                padding: 0.75rem 1rem;
                border-radius: 0 8px 8px 0;
            }

            .schedule-content h4 { margin: 0 0 0.25rem 0; font-size: 1rem; }
            .room-tag { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }

            /* Task Preview Clean */
            .task-preview-item {
                padding: 1rem 0;
                border-bottom: 1px solid var(--border);
            }
            .task-preview-item:last-child { border-bottom: none; }

            .task-top { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; }
            .subject-dot { width: 8px; height: 8px; border-radius: 50%; }
            .subject-name { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
            
            .task-info h4 { font-size: 1rem; margin-bottom: 0.2rem; }
            .due-date { font-size: 0.8rem; color: var(--text-light); }

            .empty-state {
                color: var(--text-muted);
                text-align: center;
                padding: 2rem;
                font-size: 0.9rem;
            }
        </style>
    `;

  container.innerHTML = html;
}

import { storage } from "../storage.js";

export default function render(container) {
  const data = storage.load();
  const tasks = data.tasks || [];
  const subjects = data.subjects || [];

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const subjectStats = subjects
    .map((sub) => {
      const subTasks = tasks.filter((t) => t.subjectId === sub.id);
      return {
        name: sub.name,
        color: sub.color,
        count: subTasks.length,
      };
    })
    .filter((s) => s.count > 0);

  const upcomingExams = tasks
    .filter((t) => t.type === "Exam" && !t.completed && new Date(t.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  container.innerHTML = `
        <div class="analytics-page">
            <h2>Analytics</h2>
            
            <div class="row" style="margin-top: 2rem;">
                <div class="card stat-card">
                    <h3>Task Completion</h3>
                    <div class="big-stat">${completionRate}%</div>
                    <p>${completedTasks} of ${totalTasks} tasks done</p>
                </div>

                <div class="card stat-card">
                    <h3>Active Subjects</h3>
                    <div class="big-stat">${subjects.length}</div>
                    <p>Currently enrolled</p>
                </div>
            </div>

            <div class="card" style="margin-top: 2rem;">
                <h3>Tasks by Subject</h3>
                ${
                  subjectStats.length > 0
                    ? `
                    <div class="subject-stats">
                        ${subjectStats
                          .map(
                            (s) => `
                            <div class="stat-row">
                                <div class="stat-label" style="border-left: 4px solid ${s.color}; padding-left: 10px;">
                                    ${s.name}
                                </div>
                                <div class="stat-value">${s.count} tasks</div>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                `
                    : '<p style="color: var(--text-muted);">No tasks yet.</p>'
                }
            </div>

            <div class="card" style="margin-top: 2rem;">
                <h3>Upcoming Exams</h3>
                ${
                  upcomingExams.length > 0
                    ? `
                    <div class="exam-list">
                        ${upcomingExams
                          .map((e) => {
                            const sub = subjects.find((s) => s.id === e.subjectId);
                            return `
                                <div class="exam-row">
                                    <div>
                                        <strong>${e.title}</strong>
                                        <div style="font-size: 0.85rem; color: var(--text-muted);">
                                            ${sub ? sub.name : "General"} - ${new Date(e.dueDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            `;
                          })
                          .join("")}
                    </div>
                `
                    : '<p style="color: var(--text-muted);">No upcoming exams.</p>'
                }
            </div>
        </div>

        <style>
            .analytics-page { max-width: 900px; margin: 0 auto; }
            .stat-card { text-align: center; }
            .big-stat { font-size: 3rem; font-weight: bold; color: var(--primary); margin: 1rem 0; }
            .stat-card p { color: var(--text-muted); font-size: 0.9rem; }
            
            .subject-stats { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
            .stat-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; background: var(--bg-body); border-radius: 6px; }
            .stat-label { font-weight: 500; }
            .stat-value { color: var(--text-muted); }
            
            .exam-list { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
            .exam-row { padding: 1rem; background: var(--bg-body); border-radius: 6px; border-left: 4px solid var(--danger); }
        </style>
    `;
}

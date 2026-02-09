import { storage } from "../storage.js";

export default function render(container) {
  const data = storage.load();
  const { subjects, tasks } = data;

  // --- Data Processing for Analytics ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Distribution by Subject
  const subjectDistribution = subjects
    .map((sub) => {
      const subTasks = tasks.filter((t) => t.subjectId === sub.id);
      return {
        name: sub.name,
        color: sub.color,
        count: subTasks.length,
        percent: totalTasks === 0 ? 0 : (subTasks.length / totalTasks) * 100,
      };
    })
    .filter((d) => d.count > 0);

  // Task Type Distribution
  const types = ["Assignment", "Exam", "Study", "Project", "Other"];
  const typeDistribution = types.map((type) => {
    const count = tasks.filter((t) => t.type === type).length;
    return { type, count, percent: totalTasks === 0 ? 0 : (count / totalTasks) * 100 };
  });

  // Upcoming Exam Alert
  const upcomingExams = tasks
    .filter((t) => t.type === "Exam" && !t.completed && new Date(t.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  container.innerHTML = `
        <div class="analytics-container">
            <div class="row">
                <!-- Completion Circle -->
                <div class="card chart-card">
                    <h3>Completion Rate</h3>
                    <div class="circle-chart-wrapper">
                        <div class="circle-chart" style="--percent: ${completionRate}">
                            <span>${completionRate}%</span>
                        </div>
                        <p class="chart-label">${completedTasks} / ${totalTasks} Tasks Completed</p>
                    </div>
                </div>

                <!-- Exam Countdown -->
                <div class="card exam-card">
                    <h3>Upcoming Exams</h3>
                    ${
                      upcomingExams.length > 0
                        ? `
                        <div class="exam-list">
                            ${upcomingExams
                              .map(
                                (e) => `
                                <div class="exam-item">
                                    <div class="exam-date">
                                        <span class="day">${new Date(e.dueDate).getDate()}</span>
                                        <span class="month">${new Date(e.dueDate).toLocaleString("default", { month: "short" })}</span>
                                    </div>
                                    <div class="exam-info">
                                        <h4>${e.title}</h4>
                                        <p>${subjects.find((s) => s.id === e.subjectId)?.name || "General"}</p>
                                    </div>
                                </div>
                            `,
                              )
                              .join("")}
                        </div>
                    `
                        : '<div class="empty-chart">No upcoming exams found. Great job staying on top!</div>'
                    }
                </div>
            </div>

            <div class="row">
                <!-- Subject Distribution Bar Chart -->
                <div class="card bar-chart-card">
                    <h3>Tasks per Subject</h3>
                    <div class="bar-chart">
                        ${
                          subjectDistribution.length > 0
                            ? subjectDistribution
                                .map(
                                  (d) => `
                            <div class="bar-row">
                                <span class="label">${d.name}</span>
                                <div class="bar-track">
                                    <div class="bar-fill" style="width: ${d.percent}%; background-color: ${d.color}"></div>
                                </div>
                                <span class="value">${d.count}</span>
                            </div>
                        `,
                                )
                                .join("")
                            : '<div class="empty-chart">No tasks data available.</div>'
                        }
                    </div>
                </div>

                <!-- Task Type Distribution -->
                <div class="card bar-chart-card">
                    <h3>Task Types</h3>
                    <div class="bar-chart">
                         ${typeDistribution
                           .map(
                             (d) => `
                            <div class="bar-row">
                                <span class="label">${d.type}</span>
                                <div class="bar-track">
                                    <div class="bar-fill" style="width: ${d.percent}%; background-color: var(--secondary)"></div>
                                </div>
                                <span class="value">${d.count}</span>
                            </div>
                        `,
                           )
                           .join("")}
                    </div>
                </div>
            </div>
        </div>

        <style>
            .analytics-container {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .row {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                gap: 1.5rem;
            }

            .chart-card, .exam-card, .bar-chart-card {
                padding: 1.5rem;
                border-radius: var(--radius-lg);
                background: var(--bg-surface);
                border: 1px solid var(--border);
            }

            .chart-card h3, .exam-card h3, .bar-chart-card h3 {
                font-size: 1.1rem;
                margin-bottom: 1.5rem;
                text-align: center;
            }
            
            .bar-chart-card h3 { text-align: left; }

            /* Simple CSS Pie Chart Logic */
            .circle-chart-wrapper {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
            }

            .circle-chart {
                width: 140px;
                height: 140px;
                border-radius: 50%;
                background: conic-gradient(var(--primary) calc(var(--percent) * 1%), var(--bg-body) 0);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            }

            .circle-chart::before {
                content: "";
                position: absolute;
                width: 110px;
                height: 110px;
                background: var(--bg-surface);
                border-radius: 50%;
            }

            .circle-chart span {
                position: relative;
                font-weight: 700;
                font-size: 1.75rem;
                z-index: 10;
                color: var(--text-main);
            }

            .chart-label { color: var(--text-muted); font-size: 0.9rem; font-weight: 500;}

            /* Bar Chart Styles */
            .bar-chart {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-top: 0.5rem;
            }

            .bar-row {
                display: flex;
                align-items: center;
                gap: 1rem;
                font-size: 0.85rem;
            }

            .bar-row .label {
                width: 100px; /* Fixed width for labels */
                text-align: right;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: var(--text-muted);
            }

            .bar-track {
                flex: 1;
                background: var(--bg-body);
                height: 8px;
                border-radius: 4px;
                overflow: hidden;
            }

            .bar-fill {
                height: 100%;
                border-radius: 4px;
                transition: width 0.5s ease-out;
            }

            .bar-row .value {
                width: 20px;
                text-align: right;
                font-weight: 600;
            }

            /* Exam List Styles */
            .exam-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .exam-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.75rem;
                background: var(--bg-body);
                border-radius: var(--radius-md);
                border: 1px solid var(--border);
            }

            .exam-date {
                background: var(--bg-surface);
                padding: 0.4rem 0.6rem;
                border-radius: 8px;
                text-align: center;
                min-width: 55px;
                border: 1px solid var(--border);
                box-shadow: var(--shadow-sm);
            }

            .exam-date .day { display: block; font-weight: 700; font-size: 1.2rem; line-height: 1; color: var(--text-main); }
            .exam-date .month { display: block; font-size: 0.7rem; text-transform: uppercase; color: var(--danger); font-weight: 600; }

            .exam-info h4 { margin: 0 0 0.15rem 0; font-size: 0.95rem; font-weight: 600; }
            .exam-info p { margin: 0; font-size: 0.8rem; color: var(--text-muted); }
            
            .empty-chart {
                text-align: center;
                color: var(--text-muted);
                font-style: italic;
                padding: 2rem 0;
            }
        </style>
    `;
}

import { storage } from "../storage.js";

export default function render(container) {
  let currentFilter = "all"; // all, pending, completed

  const renderWrapper = () => {
    // Initial wrapper structure
    container.innerHTML = `
            <div class="tasks-container">
                <div class="page-header">
                    <div>
                        <h2>Tasks & Assignments</h2>
                        <p class="summary-text">Track your homework, exams, and study goals.</p>
                    </div>
                    <button id="add-task-btn" class="btn-primary">New Task</button>
                </div>

                <div class="controls-bar">
                    <div class="filter-tabs">
                        <button class="filter-btn active" data-filter="all">All Items</button>
                        <button class="filter-btn" data-filter="pending">Pending</button>
                        <button class="filter-btn" data-filter="completed">Completed</button>
                    </div>
                </div>

                <div id="tasks-list" class="tasks-grid"></div>

                <!-- Modal -->
                <div id="task-modal" class="modal hidden">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2>Create New Task</h2>
                            <button class="close-modal" id="close-modal-x">&times;</button>
                        </div>
                        <form id="task-form">
                            <div class="form-group">
                                <label>Task Title</label>
                                <input type="text" id="task-title" required placeholder="Ex: Finish Chapter 4 Summary">
                            </div>

                            <div class="form-group">
                                <label>Related Subject</label>
                                <select id="task-subject" required>
                                    <!-- Populated dynamically -->
                                </select>
                            </div>

                            <div class="row">
                                <div class="form-group">
                                    <label>Due Date</label>
                                    <input type="date" id="task-date" required>
                                </div>
                                <div class="form-group">
                                    <label>Task Type</label>
                                    <select id="task-type">
                                        <option value="Assignment">Assignment</option>
                                        <option value="Exam">Exam</option>
                                        <option value="Study">Study Session</option>
                                        <option value="Project">Project</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div class="modal-actions">
                                <button type="button" class="btn-sec" id="cancel-task">Cancel</button>
                                <button type="submit" class="btn-primary">Create Task</button>
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
                }
                
                .page-header h2 { font-size: 1.5rem; margin-bottom: 0.25rem; }
                .summary-text { color: var(--text-muted); font-size: 0.9rem; }

                .controls-bar {
                    margin-bottom: 2rem;
                    display: flex;
                    border-bottom: 1px solid var(--border);
                    padding-bottom: 1rem;
                }

                .filter-tabs {
                    display: flex;
                    gap: 0.5rem;
                }

                .filter-btn {
                    padding: 0.5rem 1rem;
                    border: none;
                    background: none;
                    border-radius: 6px;
                    cursor: pointer;
                    color: var(--text-muted);
                    font-weight: 500;
                    font-size: 0.9rem;
                    transition: 0.2s;
                }

                .filter-btn:hover { background: var(--bg-body); color: var(--text-main); }
                
                .filter-btn.active {
                    background: var(--bg-surface);
                    color: var(--primary);
                    box-shadow: var(--shadow-sm);
                    font-weight: 600;
                    border: 1px solid var(--border);
                }

                .tasks-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                }

                .task-card {
                    background: var(--bg-surface);
                    border-radius: var(--radius-md);
                    padding: 1.25rem;
                    border: 1px solid var(--border);
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    transition: all 0.2s;
                    position: relative;
                }
                
                .task-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                    border-color: var(--border-hover);
                }

                .task-card.completed {
                    opacity: 0.7;
                    background: var(--bg-body);
                }

                .task-main {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                }

                .checkbox-wrapper {
                    padding-top: 3px;
                }

                .task-check {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                    accent-color: var(--success);
                }

                .task-content { flex: 1; }
                
                .task-title {
                    font-weight: 600;
                    font-size: 1rem;
                    line-height: 1.4;
                    margin-bottom: 0.25rem;
                    color: var(--text-main);
                }

                .completed .task-title {
                    text-decoration: line-through;
                    color: var(--text-muted);
                }

                .task-details {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.8rem;
                    padding-top: 0.75rem;
                    border-top: 1px solid var(--border);
                }
                
                .tag-group {
                    display: flex;
                    gap: 0.5rem;
                    align-items: center;
                }

                .badge-sm {
                    padding: 0.15rem 0.5rem;
                    border-radius: 4px;
                    background: var(--bg-body);
                    border: 1px solid var(--border);
                    font-weight: 500;
                }
                
                .date-label {
                    color: var(--text-muted);
                    font-weight: 500;
                }
                
                .date-label.overdue { color: var(--danger); font-weight: 600; }

                .delete-task-btn {
                    background: none;
                    border: none;
                    color: var(--text-light);
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.2s;
                    padding: 4px;
                }
                
                .task-card:hover .delete-task-btn { opacity: 1; }
                .delete-task-btn:hover { color: var(--danger); }
                
                .empty-list-state {
                    grid-column: 1/-1;
                    text-align: center;
                    padding: 4rem;
                    color: var(--text-muted);
                    border: 1px dashed var(--border);
                    border-radius: var(--radius-md);
                }
            </style>
        `;

    setupEvents();
    renderList();
  };

  const renderList = () => {
    const data = storage.load();
    const tasks = data.tasks || [];
    const subjects = data.subjects || [];

    const filtered = tasks
      .filter((t) => {
        if (currentFilter === "pending") return !t.completed;
        if (currentFilter === "completed") return t.completed;
        return true;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort by due date

    const listContainer = document.getElementById("tasks-list");

    if (filtered.length === 0) {
      listContainer.innerHTML = `
                <div class="empty-list-state">
                    <h3>No tasks found</h3>
                    <p>Change filter or create a new task.</p>
                </div>`;
      return;
    }

    listContainer.innerHTML = filtered
      .map((t) => {
        const subject = subjects.find((s) => s.id === t.subjectId) || {
          name: "General",
          color: "#64748b",
        };
        const isLate = !t.completed && new Date(t.dueDate) < new Date().setHours(0, 0, 0, 0);

        return `
                <div class="task-card ${t.completed ? "completed" : ""}" style="border-left: 3px solid ${subject.color}">
                    <div class="task-main">
                        <div class="checkbox-wrapper">
                            <input type="checkbox" class="task-check" data-id="${t.id}" ${t.completed ? "checked" : ""}>
                        </div>
                        <div class="task-content">
                            <div class="task-title">${t.title}</div>
                            <span class="badge-sm" style="color: ${subject.color}; border-color: ${subject.color}30; background: ${subject.color}05;">${subject.name}</span>
                        </div>
                        <button class="delete-task-btn" data-id="${t.id}" title="Delete Task">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                    
                    <div class="task-details">
                        <span class="badge-sm">${t.type}</span>
                        <span class="date-label ${isLate ? "overdue" : ""}">
                            ${isLate ? "Overdue " : ""}${new Date(t.dueDate).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            `;
      })
      .join("");

    // Re-attach listeners for list items
    listContainer.querySelectorAll(".task-check").forEach((box) => {
      box.onchange = (e) => {
        const id = e.target.dataset.id;
        const task = storage.get("tasks").find((t) => t.id === id);
        if (task) {
          storage.updateItem("tasks", id, { completed: e.target.checked });
          renderList(); // Refresh to update sorting/filtering
        }
      };
    });

    listContainer.querySelectorAll(".delete-task-btn").forEach((btn) => {
      btn.onclick = () => {
        if (confirm("Delete this task?")) {
          storage.deleteItem("tasks", btn.dataset.id);
          renderList();
        }
      };
    });
  };

  const setupEvents = () => {
    // Modal & Form
    const modal = document.getElementById("task-modal");
    const form = document.getElementById("task-form");

    document.getElementById("add-task-btn").onclick = () => {
      // Populate subjects
      const subjects = storage.get("subjects") || [];
      const select = document.getElementById("task-subject");
      select.innerHTML =
        '<option value="">Select Subject</option>' +
        subjects.map((s) => `<option value="${s.id}">${s.name}</option>`).join("");

      modal.classList.remove("hidden");
    };

    document.getElementById("cancel-task").onclick = () => modal.classList.add("hidden");
    document.getElementById("close-modal-x").onclick = () => modal.classList.add("hidden");

    form.onsubmit = (e) => {
      e.preventDefault();
      storage.addItem("tasks", {
        id: crypto.randomUUID(),
        title: document.getElementById("task-title").value,
        subjectId: document.getElementById("task-subject").value,
        dueDate: document.getElementById("task-date").value,
        type: document.getElementById("task-type").value,
        completed: false,
      });
      modal.classList.add("hidden");
      form.reset();
      renderList();
    };

    // Filter Tabs
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderList();
      };
    });
  };

  renderWrapper();
}

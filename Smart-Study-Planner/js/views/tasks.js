import { storage } from "../storage.js";

export default function render(container) {
  let filter = "all";

  const renderContent = () => {
    const data = storage.load();
    const tasks = data.tasks || [];
    const subjects = data.subjects || [];

    const filtered = tasks
      .filter((t) => {
        if (filter === "pending") return !t.completed;
        if (filter === "completed") return t.completed;
        return true;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    container.innerHTML = `
            <div>
                <div class="row" style="margin-bottom:20px; align-items:center;">
                    <h2>Tasks</h2>
                    <button id="new-task-btn" class="btn-primary">New Task</button>
                </div>

                <div class="filters" style="margin-bottom:20px;">
                    <button class="filter-btn ${filter === "all" ? "active" : ""}" data-f="all">All</button>
                    <button class="filter-btn ${filter === "pending" ? "active" : ""}" data-f="pending">Pending</button>
                    <button class="filter-btn ${filter === "completed" ? "active" : ""}" data-f="completed">Completed</button>
                </div>

                <div class="task-list">
                    ${
                      filtered.length === 0
                        ? "<p>No tasks.</p>"
                        : filtered
                            .map((t) => {
                              const sub = subjects.find((s) => s.id === t.subjectId);
                              return `
                            <div class="card task-row ${t.completed ? "done" : ""}" style="border-left: 4px solid ${sub ? sub.color : "#ccc"}">
                                <div style="display:flex; gap:10px; align-items:center;">
                                    <input type="checkbox" class="t-check" data-id="${t.id}" ${t.completed ? "checked" : ""}>
                                    <div>
                                        <div style="font-weight:bold;">${t.title}</div>
                                        <div style="font-size:0.85rem; color:var(--text-muted);">${sub ? sub.name : ""} - Due: ${t.dueDate}</div>
                                    </div>
                                </div>
                                <button class="btn-sec del-task" data-id="${t.id}">Delete</button>
                            </div>
                        `;
                            })
                            .join("")
                    }
                </div>

                <!-- Modal -->
                <div id="t-modal" class="modal hidden">
                    <div class="modal-content">
                        <div class="modal-header"><h3>New Task</h3><button class="close-modal" id="close-t">X</button></div>
                        <form id="t-form">
                            <div class="form-group"><label>Title</label><input type="text" id="t-title" required></div>
                            <div class="form-group"><label>Subject</label>
                                <select id="t-sub">${subjects.map((s) => `<option value="${s.id}">${s.name}</option>`).join("")}</select>
                            </div>
                            <div class="row">
                                <div class="form-group"><label>Date</label><input type="date" id="t-date" required></div>
                                <div class="form-group"><label>Type</label>
                                    <select id="t-type">
                                        <option>Assignment</option><option>Exam</option><option>Project</option>
                                    </select>
                                </div>
                            </div>
                            <button type="submit" class="btn-primary" style="width:100%">Create</button>
                        </form>
                    </div>
                </div>
            </div>
            <style>
                .filter-btn { background:none; border:1px solid #ddd; padding:5px 15px; cursor:pointer; margin-right:5px; border-radius:15px; color: #666; }
                .filter-btn.active { background: #4361ee; color:white; border-color:#4361ee; }
                .task-row { display:flex; justify-content:space-between; align-items:center; padding:15px; margin-bottom:10px; }
                .task-row.done { opacity: 0.6; text-decoration: line-through; }
            </style>
        `;

    setupEvents();
  };

  const setupEvents = () => {
    const modal = document.getElementById("t-modal");
    document.getElementById("new-task-btn").onclick = () => modal.classList.remove("hidden");
    document.getElementById("close-t").onclick = () => modal.classList.add("hidden");

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.onclick = () => {
        filter = btn.dataset.f;
        renderContent();
      };
    });

    document.getElementById("t-form").onsubmit = (e) => {
      e.preventDefault();
      storage.addItem("tasks", {
        id: crypto.randomUUID(),
        title: document.getElementById("t-title").value,
        subjectId: document.getElementById("t-sub").value,
        dueDate: document.getElementById("t-date").value,
        type: document.getElementById("t-type").value,
        completed: false,
      });
      modal.classList.add("hidden");
      renderContent();
    };

    document.querySelectorAll(".t-check").forEach((box) => {
      box.onchange = (e) => {
        storage.updateItem("tasks", e.target.dataset.id, { completed: e.target.checked });
        renderContent();
      };
    });

    document.querySelectorAll(".del-task").forEach((btn) => {
      btn.onclick = () => {
        if (confirm("Delete?")) {
          storage.deleteItem("tasks", btn.dataset.id);
          renderContent();
        }
      };
    });
  };

  renderContent();
}

import { storage } from "../storage.js";

export default function render(container) {
  const renderContent = () => {
    const subjects = storage.get("subjects") || [];

    container.innerHTML = `
            <div class="subjects-container">
                <div class="action-bar">
                    <div class="text-group">
                        <h2>Managed Subjects</h2>
                        <p class="description">Add and organize your courses.</p>
                    </div>
                    <button id="add-subject-btn" class="btn-primary">
                        Add New Subject
                    </button>
                </div>

                <div class="subjects-grid">
                    ${
                      subjects.length > 0
                        ? subjects
                            .map(
                              (sub) => `
                        <div class="card subject-card" style="border-left: 4px solid ${sub.color}">
                            <div class="subject-header">
                                <h3>${sub.name}</h3>
                                <div class="actions">
                                    <button class="icon-btn edit-btn" data-id="${sub.id}" title="Edit">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                    </button>
                                    <button class="icon-btn delete-btn" data-id="${sub.id}" title="Delete">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            </div>
                            <div class="subject-details">
                                <span class="badge priority-${sub.priority.toLowerCase()}">${sub.priority}</span>
                                <span class="credits">${sub.teacher || "No Teacher"}</span>
                            </div>
                        </div>
                    `,
                            )
                            .join("")
                        : `
                        <div class="empty-state-card">
                            <h3>No subjects yet</h3>
                            <button id="add-first-btn" class="btn-link">Create your first subject</button>
                        </div>
                    `
                    }
                </div>

                <!-- Modal Form -->
                <div id="subject-modal" class="modal hidden">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2 id="modal-title">Add Subject</h2>
                            <button class="close-modal" id="close-modal-x">&times;</button>
                        </div>
                        <form id="subject-form">
                            <input type="hidden" id="sub-id">
                            
                            <div class="form-group">
                                <label>Subject Name</label>
                                <input type="text" id="sub-name" required placeholder="Ex: Calculus II">
                            </div>

                            <div class="form-group">
                                <label>Teacher Name</label>
                                <input type="text" id="sub-teacher" placeholder="Ex: Dr. Stone">
                            </div>

                            <div class="row">
                                <div class="form-group">
                                    <label>Color Tag</label>
                                    <div class="color-input-wrapper">
                                        <input type="color" id="sub-color" value="#4f46e5">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Priority Level</label>
                                    <select id="sub-priority">
                                        <option value="High">High</option>
                                        <option value="Medium" selected>Medium</option>
                                        <option value="Low">Low</option>
                                    </select>
                                </div>
                            </div>

                            <div class="modal-actions">
                                <button type="button" class="btn-sec" id="cancel-modal">Cancel</button>
                                <button type="submit" class="btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>
                .action-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border);
                }

                .text-group h2 { font-size: 1.5rem; margin-bottom: 0.25rem; }
                .text-group .description { color: var(--text-muted); font-size: 0.9rem; }

                .subjects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.5rem;
                }

                .subject-card {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    padding: 1.5rem;
                    background: var(--bg-surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius-md);
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .subject-card:hover { 
                    transform: translateY(-2px); 
                    box-shadow: var(--shadow-md); 
                }

                .subject-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .subject-header h3 {
                    font-size: 1.15rem;
                    margin: 0;
                    font-weight: 600;
                }

                .actions { display: flex; gap: 0.5rem; }

                .delete-btn:hover { color: var(--danger); }

                .subject-details {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: auto;
                }

                .badge {
                    padding: 0.25rem 0.75rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .badge.priority-high { color: var(--danger); background: #fee2e2; }
                .badge.priority-medium { color: var(--warning); background: #fef3c7; }
                .badge.priority-low { color: var(--success); background: #dcfce7; }

                .credits { font-size: 0.85rem; color: var(--text-muted); }

                .empty-state-card {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 3rem;
                    background: var(--bg-surface);
                    border-radius: var(--radius-lg);
                    border: 1px dashed var(--border);
                }

                .empty-state-card h3 { margin-bottom: 0.5rem; color: var(--text-muted); }
                .btn-link { background: none; border: none; color: var(--primary); cursor: pointer; text-decoration: underline; }
            </style>
        `;

    attachEventListeners();
  };

  const attachEventListeners = () => {
    const modal = document.getElementById("subject-modal");
    const form = document.getElementById("subject-form");
    const modalTitle = document.getElementById("modal-title");

    const openModal = () => modal.classList.remove("hidden");
    const closeModal = () => {
      modal.classList.add("hidden");
      form.reset();
      document.getElementById("sub-id").value = "";
    };

    const addBtn = document.getElementById("add-subject-btn");
    if (addBtn)
      addBtn.onclick = () => {
        modalTitle.textContent = "Add Subject";
        openModal();
      };

    const firstBtn = document.getElementById("add-first-btn");
    if (firstBtn)
      firstBtn.onclick = () => {
        modalTitle.textContent = "Add Subject";
        openModal();
      };

    document.getElementById("cancel-modal").onclick = closeModal;
    document.getElementById("close-modal-x").onclick = closeModal;

    // Form Submit
    form.onsubmit = (e) => {
      e.preventDefault();
      const id = document.getElementById("sub-id").value;
      const subjectData = {
        id: id || crypto.randomUUID(),
        name: document.getElementById("sub-name").value,
        teacher: document.getElementById("sub-teacher").value,
        color: document.getElementById("sub-color").value,
        priority: document.getElementById("sub-priority").value,
      };

      if (id) {
        storage.updateItem("subjects", id, subjectData);
      } else {
        storage.addItem("subjects", subjectData);
      }

      closeModal();
      renderContent(); // Re-render
    };

    // Edit & Delete
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = (e) => {
        if (confirm("Delete this subject? This might affect related tasks and schedule.")) {
          storage.deleteItem("subjects", btn.dataset.id);
          renderContent();
        }
      };
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.onclick = () => {
        const sub = storage.get("subjects").find((s) => s.id === btn.dataset.id);
        if (sub) {
          document.getElementById("sub-id").value = sub.id;
          document.getElementById("sub-name").value = sub.name;
          document.getElementById("sub-teacher").value = sub.teacher || "";
          document.getElementById("sub-color").value = sub.color;
          document.getElementById("sub-priority").value = sub.priority;
          modalTitle.textContent = "Edit Subject";
          openModal();
        }
      };
    });
  };

  renderContent();
}

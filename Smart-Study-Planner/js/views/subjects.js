import { storage } from "../storage.js";

export default function render(container) {
  const renderContent = () => {
    const subjects = storage.get("subjects") || [];

    container.innerHTML = `
            <div>
                <div class="page-header" style="display:flex; justify-content:space-between; margin-bottom:20px;">
                    <h2>Subjects</h2>
                    <button id="add-subject-btn" class="btn-primary">Add Subject</button>
                </div>

                <div class="subjects-list">
                    ${subjects
                      .map(
                        (sub) => `
                        <div class="card subject-item" style="border-left: 5px solid ${sub.color}">
                            <div class="sub-info">
                                <h3>${sub.name}</h3>
                                <p>Teacher: ${sub.teacher || "N/A"}</p>
                                <small>Priority: ${sub.priority}</small>
                            </div>
                            <div class="sub-actions">
                                <button class="btn-sec edit-btn" data-id="${sub.id}">Edit</button>
                                <button class="btn-sec delete-btn" data-id="${sub.id}">Delete</button>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}
                    ${subjects.length === 0 ? "<p>No subjects added yet.</p>" : ""}
                </div>

                <!-- Modal -->
                <div id="subject-modal" class="modal hidden">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 id="modal-title">Add Subject</h3>
                            <button class="close-modal" id="close-modal-x">X</button>
                        </div>
                        <form id="subject-form">
                            <input type="hidden" id="sub-id">
                            <div class="form-group">
                                <label>Name</label>
                                <input type="text" id="sub-name" required>
                            </div>
                            <div class="form-group">
                                <label>Teacher</label>
                                <input type="text" id="sub-teacher">
                            </div>
                            <div class="row">
                                <div class="form-group">
                                    <label>Color</label>
                                    <input type="color" id="sub-color" style="height:40px;">
                                </div>
                                <div class="form-group">
                                    <label>Priority</label>
                                    <select id="sub-priority">
                                        <option>High</option>
                                        <option selected>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>
                            </div>
                            <div class="modal-actions">
                                <button type="button" id="cancel-modal" class="btn-sec">Cancel</button>
                                <button type="submit" class="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <style>
                .subject-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; margin-bottom: 10px; }
                .sub-actions { display: flex; gap: 5px; }
                .sub-info h3 { margin: 0 0 5px 0; }
                .sub-info p { margin: 0; color: #666; font-size: 0.9rem; }
            </style>
        `;

    attachEventListeners();
  };

  const attachEventListeners = () => {
    const modal = document.getElementById("subject-modal");
    const form = document.getElementById("subject-form");

    document.getElementById("add-subject-btn").onclick = () => {
      document.getElementById("modal-title").textContent = "Add Subject";
      modal.classList.remove("hidden");
    };

    const closeModal = () => {
      modal.classList.add("hidden");
      form.reset();
      document.getElementById("sub-id").value = "";
    };

    document.getElementById("close-modal-x").onclick = closeModal;
    document.getElementById("cancel-modal").onclick = closeModal;

    form.onsubmit = (e) => {
      e.preventDefault();
      const id = document.getElementById("sub-id").value;
      const data = {
        id: id || crypto.randomUUID(),
        name: document.getElementById("sub-name").value,
        teacher: document.getElementById("sub-teacher").value,
        color: document.getElementById("sub-color").value,
        priority: document.getElementById("sub-priority").value,
      };

      if (id) storage.updateItem("subjects", id, data);
      else storage.addItem("subjects", data);

      closeModal();
      renderContent();
    };

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = () => {
        if (confirm("Delete this subject?")) {
          storage.deleteItem("subjects", btn.dataset.id);
          renderContent();
        }
      };
    });

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.onclick = () => {
        const s = storage.get("subjects").find((x) => x.id === btn.dataset.id);
        if (s) {
          document.getElementById("sub-id").value = s.id;
          document.getElementById("sub-name").value = s.name;
          document.getElementById("sub-teacher").value = s.teacher;
          document.getElementById("sub-color").value = s.color;
          document.getElementById("sub-priority").value = s.priority;
          document.getElementById("modal-title").textContent = "Edit Subject";
          modal.classList.remove("hidden");
        }
      };
    });
  };

  renderContent();
}

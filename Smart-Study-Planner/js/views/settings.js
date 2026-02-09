import { storage } from "../storage.js";

export default function render(container) {
  const data = storage.load();
  const settings = data.settings || { username: "Student" };

  container.innerHTML = `
        <div class="settings-page">
            <div class="page-header">
                <h2>Settings</h2>
            </div>
            
            <div class="card settings-card">
                <h3>Appearance</h3>
                <form id="set-form">
                    <div class="form-group">
                        <label>Theme</label>
                        <select id="set-theme">
                            <option value="light" ${settings.theme === "light" ? "selected" : ""}>Light</option>
                            <option value="dark" ${settings.theme === "dark" ? "selected" : ""}>Dark</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Save Settings</button>
                    </div>
                </form>
            </div>

            <div class="card settings-card danger-zone">
                <h3>Data Management</h3>
                <p class="warning-text">Clear all subjects, tasks, and schedule data. This cannot be undone.</p>
                <button id="reset-btn" class="btn-danger">Reset All Data</button>
            </div>
        </div>

        <style>
            .settings-page { max-width: 600px; margin: 0 auto; }
            .page-header { margin-bottom: 2rem; }
            .settings-card { margin-bottom: 2rem; }
            .settings-card h3 { margin-bottom: 1rem; border-bottom: 1px solid #ddd; padding-bottom: 0.5rem; }
            .danger-zone { border: 1px solid #fee2e2; }
            .danger-zone h3 { color: #ef233c; border-color: #fee2e2; }
            .warning-text { color: #666; margin-bottom: 1rem; font-size: 0.9rem; }
            
            .btn-danger {
                background-color: white;
                color: #ef233c;
                border: 1px solid #ef233c;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                transition: 0.2s;
            }
            .btn-danger:hover { background-color: #ef233c; color: white; }
        </style>
    `;

  document.getElementById("set-form").onsubmit = (e) => {
    e.preventDefault();
    const newSet = {
      theme: document.getElementById("set-theme").value,
    };
    storage.set("settings", newSet);

    if (newSet.theme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }

    alert("Settings saved successfully!");
  };

  document.getElementById("reset-btn").onclick = () => {
    if (confirm("Are you strictly sure you want to delete ALL data?")) {
      storage.reset();
      window.location.reload();
    }
  };
}

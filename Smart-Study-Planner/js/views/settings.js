import { storage } from "../storage.js";

export default function render(container) {
  const data = storage.load();
  const settings = data.settings || { theme: "light", username: "Student" };

  container.innerHTML = `
        <div class="settings-container-centered">
            
            <div class="card settings-card">
                <div class="card-header-clean">
                    <h2>Preferences</h2>
                    <p>Manage your account settings and appearance.</p>
                </div>
                
                <form id="settings-form">
                    <div class="settings-section">
                        <h3>Profile Information</h3>
                        <div class="form-group">
                            <label>Display Name</label>
                            <input type="text" id="set-name" value="${settings.username || "Student"}" class="input-lg">
                            <span class="help-text">This name will be displayed in the sidebar.</span>
                        </div>
                    </div>

                    <div class="settings-section">
                        <h3>Appearance</h3>
                        <div class="form-group">
                            <label>Interface Theme</label>
                            <div class="theme-select-wrapper">
                                <select id="set-theme" class="input-lg">
                                    <option value="light" ${settings.theme === "light" ? "selected" : ""}>Light Mode</option>
                                    <option value="dark" ${settings.theme === "dark" ? "selected" : ""}>Dark Mode</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="actions-right">
                        <button type="submit" class="btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>

            <div class="card settings-card">
                <div class="card-header-clean">
                    <h2>Data Management</h2>
                    <p>Export your data or reset the application.</p>
                </div>

                <div class="data-actions">
                    <div class="action-item">
                        <div class="action-info">
                            <h4>Export Data</h4>
                            <p>Download a JSON backup of all your subjects and tasks.</p>
                        </div>
                        <button id="export-btn" class="btn-sec">Download JSON</button>
                    </div>
                    
                    <div class="divider"></div>

                    <div class="action-item danger-zone">
                        <div class="action-info">
                            <h4 class="text-danger">Reset Application</h4>
                            <p>This will permanently delete all your data and cannot be undone.</p>
                        </div>
                        <button id="reset-data-btn" class="btn-danger">Reset All Data</button>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .settings-container-centered {
                max-width: 650px;
                margin: 0 auto;
                display: flex;
                flex-direction: column;
                gap: 2rem;
            }

            .settings-card {
                padding: 2rem;
                background: var(--bg-surface);
                border: 1px solid var(--border);
                border-radius: var(--radius-lg);
            }

            .card-header-clean {
                margin-bottom: 2rem;
                border-bottom: 1px solid var(--border);
                padding-bottom: 1rem;
            }
            .card-header-clean h2 { margin-bottom: 0.25rem; font-size: 1.25rem; }
            .card-header-clean p { color: var(--text-muted); font-size: 0.9rem; }

            .settings-section {
                margin-bottom: 2rem;
            }

            .settings-section h3 {
                font-size: 0.95rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--text-muted);
                margin-bottom: 1rem;
                font-weight: 600;
            }

            .input-lg {
                width: 100%;
                padding: 0.75rem 1rem;
                font-size: 1rem;
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                background: var(--bg-body);
                color: var(--text-main);
                transition: border-color 0.2s;
            }
            
            .input-lg:focus {
                border-color: var(--primary);
                outline: none;
                box-shadow: 0 0 0 3px var(--primary-light);
            }

            .help-text {
                display: block;
                margin-top: 0.5rem;
                font-size: 0.8rem;
                color: var(--text-muted);
            }

            .actions-right {
                display: flex;
                justify-content: flex-end;
            }

            .data-actions {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }

            .action-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1.5rem;
            }

            .action-info h4 { margin: 0 0 0.25rem 0; font-size: 1rem; }
            .action-info p { margin: 0; font-size: 0.85rem; color: var(--text-muted); }

            .divider { height: 1px; background: var(--border); width: 100%; }

            .btn-danger {
                background-color: var(--bg-body);
                color: var(--danger);
                border: 1px solid var(--danger);
                padding: 0.6rem 1.2rem;
                border-radius: var(--radius-md);
                cursor: pointer;
                font-weight: 600;
                transition: 0.2s;
                font-size: 0.9rem;
            }

            .btn-danger:hover {
                background-color: var(--danger);
                color: white;
            }
            
            .text-danger { color: var(--danger); }
        </style>
    `;

  // Event Listeners
  document.getElementById("settings-form").onsubmit = (e) => {
    e.preventDefault();
    const newSettings = {
      ...settings,
      username: document.getElementById("set-name").value,
      theme: document.getElementById("set-theme").value,
    };
    storage.set("settings", newSettings);

    // Apply theme immediately
    document.documentElement.setAttribute("data-theme", newSettings.theme);

    // Update main toggle state if visible
    const toggle = document.getElementById("theme-toggle");
    const sun = toggle?.querySelector(".sun-icon");
    const moon = toggle?.querySelector(".moon-icon");
    if (sun && moon) {
      if (newSettings.theme === "dark") {
        sun.style.display = "none";
        moon.style.display = "block";
      } else {
        sun.style.display = "block";
        moon.style.display = "none";
      }
    }

    alert("Settings have been saved.");
  };

  document.getElementById("reset-data-btn").onclick = () => {
    if (confirm("WARNING: Are you absolutely sure? All data will be lost forever.")) {
      storage.reset();
    }
  };

  document.getElementById("export-btn").onclick = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storage.load()));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "study_planner_backup.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };
}

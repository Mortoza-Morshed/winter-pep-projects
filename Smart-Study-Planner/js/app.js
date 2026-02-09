/**
 * Main Application Logic
 * Handles initialization, routing, and global events.
 */

import { storage } from "./storage.js";

class App {
  constructor() {
    this.currentView = "dashboard";
    this.init();
  }

  init() {
    this.setupTheme();
    this.setupNavigation();
    this.setupGlobalEvents();
    this.renderCurrentView();

    // Update date
    this.updateDate();
  }

  setupTheme() {
    const settings = storage.get("settings");
    const savedTheme = settings ? settings.theme : "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
      themeBtn.innerHTML = savedTheme === "dark" ? "☀️" : "🌙";
      themeBtn.addEventListener("click", () => this.toggleTheme());
    }
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    document.getElementById("theme-toggle").innerHTML = newTheme === "dark" ? "☀️" : "🌙";

    const settings = storage.get("settings") || {};
    settings.theme = newTheme;
    storage.set("settings", settings);
  }

  setupNavigation() {
    // Sidebar Navigation
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const targetView = btn.dataset.view;
        this.navigateTo(targetView);

        // On mobile, close sidebar after click
        if (window.innerWidth <= 768) {
          document.getElementById("sidebar").classList.remove("open");
        }
      });
    });

    // Mobile Menu Toggle
    document.getElementById("menu-toggle").addEventListener("click", () => {
      document.getElementById("sidebar").classList.toggle("open");
    });
  }

  navigateTo(viewName) {
    this.currentView = viewName;

    // Update Active Nav State
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });

    this.renderCurrentView();
  }

  async renderCurrentView() {
    const appContainer = document.getElementById("app-view");
    const titleElement = document.getElementById("page-title");

    appContainer.innerHTML = '<div class="loading-state">Loading...</div>'; // Simple loading state

    try {
      // Dynamic import of view modules
      // Note: We'll create these view files next
      let viewModule;
      try {
        viewModule = await import(`./views/${this.currentView}.js`);
      } catch (error) {
        console.warn(`View ${this.currentView} not found, loading default or showing error.`);
        appContainer.innerHTML = `<div class="error">View "${this.currentView}" implementation pending.</div>`;
        titleElement.textContent = this.capitalize(this.currentView);
        return;
      }

      if (viewModule && viewModule.default) {
        appContainer.innerHTML = ""; // Clear loading
        titleElement.textContent = this.capitalize(this.currentView);
        viewModule.default(appContainer); // Render view
      }
    } catch (error) {
      console.error("Error rendering view:", error);
      appContainer.innerHTML = '<div class="error">Something went wrong loading this view.</div>';
    }
  }

  setupGlobalEvents() {
    // Click outside to close sidebar on mobile
    document.addEventListener("click", (e) => {
      const sidebar = document.getElementById("sidebar");
      const toggle = document.getElementById("menu-toggle");

      if (
        window.innerWidth <= 768 &&
        sidebar.classList.contains("open") &&
        !sidebar.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        sidebar.classList.remove("open");
      }
    });
  }

  updateDate() {
    const dateEl = document.getElementById("current-date");
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString("en-US", options);
    }
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
});

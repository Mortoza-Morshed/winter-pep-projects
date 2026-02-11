const STORAGE_KEY = "studyPlannerData";

const DEFAULT_DATA = {
  subjects: [],
  schedule: [],
  tasks: [],
  settings: {
    theme: "light",
  },
};

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      saveData(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error("Error loading data:", e);
    return DEFAULT_DATA;
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function addItem(collection, item) {
  const data = loadData();
  data[collection].push(item);
  saveData(data);
}

function updateItem(collection, id, updates) {
  const data = loadData();
  const index = data[collection].findIndex((item) => item.id === id);
  if (index !== -1) {
    data[collection][index] = { ...data[collection][index], ...updates };
    saveData(data);
  }
}

function deleteItem(collection, id) {
  const data = loadData();
  data[collection] = data[collection].filter((item) => item.id !== id);
  saveData(data);
}

function resetAllData() {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}

function initTheme() {
  const data = loadData();
  const theme = data.settings?.theme || "light";
  if (theme === "dark") {
    document.body.classList.add("dark-theme");
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  const newTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";

  const data = loadData();
  data.settings.theme = newTheme;
  saveData(data);
}

function updateDate() {
  const dateEl = document.getElementById("date-display");
  if (dateEl) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    dateEl.textContent = new Date().toLocaleDateString("en-US", options);
  }
}

function setActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
}

function exportData() {
  const data = loadData();
  const dataStr = JSON.stringify(data, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `study-planner-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function toggleMobileMenu() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("mobile-open");
}

document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  updateDate();
  setActiveNav();

  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
  }

  const menuToggle = document.getElementById("menu-toggle");
  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMobileMenu);
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      const sidebar = document.querySelector(".sidebar");
      sidebar.classList.remove("mobile-open");
    });
  });
});

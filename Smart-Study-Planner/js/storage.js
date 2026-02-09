/**
 * Storage Manager for Smart Study Planner
 * Handles all LocalStorage operations and data persistence.
 */

const STORAGE_KEY = "studyPlannerData";

const DEFAULT_DATA = {
  subjects: [], // { id, name, color, priority }
  schedule: [], // { day, startTime, endTime, subjectId }
  tasks: [], // { id, title, subjectId, dueDate, completed, type }
  settings: {
    theme: "light",
  },
};

export class StorageManager {
  constructor() {
    this.data = this.load();
  }

  /**
   * Load data from LocalStorage
   * @returns {Object} Application data
   */
  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return this.initialize();
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error loading data:", e);
      return this.initialize();
    }
  }

  /**
   * Initialize with default data
   * @returns {Object} Default data
   */
  initialize() {
    this.save(DEFAULT_DATA);
    return DEFAULT_DATA;
  }

  /**
   * Save current data to LocalStorage
   * @param {Object} data (optional) - Data to save. If not provided, saves current state.
   */
  save(data = null) {
    if (data) {
      this.data = data;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  /**
   * Get a specific collection from data
   * @param {string} key - 'subjects', 'schedule', 'tasks', 'settings'
   */
  get(key) {
    return this.data[key];
  }

  /**
   * Update a specific collection
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    this.data[key] = value;
    this.save();
  }

  /**
   * Add an item to a collection (subjects, tasks)
   * @param {string} collection
   * @param {Object} item
   */
  addItem(collection, item) {
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    this.data[collection].push(item);
    this.save();
  }

  /**
   * Update an item in a collection by ID
   * @param {string} collection
   * @param {string} id
   * @param {Object} updates
   */
  updateItem(collection, id, updates) {
    const index = this.data[collection].findIndex((item) => item.id === id);
    if (index !== -1) {
      this.data[collection][index] = { ...this.data[collection][index], ...updates };
      this.save();
      return true;
    }
    return false;
  }

  /**
   * Remove an item from a collection by ID
   * @param {string} collection
   * @param {string} id
   */
  deleteItem(collection, id) {
    this.data[collection] = this.data[collection].filter((item) => item.id !== id);
    this.save();
  }

  /**
   * Clear all data and reset to defaults
   */
  reset() {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.initialize();
    window.location.reload();
  }
}

export const storage = new StorageManager();

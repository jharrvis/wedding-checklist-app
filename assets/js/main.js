/**
 * Wedding Checklist App - Main Application Entry Point
 * Version: 2.1.0
 * Author: Wedding Checklist Team
 * Description: Main initialization and coordination
 */

// Application state
let categories = JSON.parse(localStorage.getItem("weddingCategories")) || [];
let generalNotes = JSON.parse(localStorage.getItem("weddingNotes")) || [];
let weddingDate = localStorage.getItem("weddingDate") || null;
let weddingTime = localStorage.getItem("weddingTime") || null;
let currentCategoryId = null;
let currentTaskId = null;
let currentNoteId = null;
let editMode = false;
let confirmAction = null;
let isCalendarView = false;
let currentCalendarDate = new Date();
let draggedItem = null;
let searchQuery = "";

// Initialize application
document.addEventListener("DOMContentLoaded", function () {
  init();
  setupEventListeners();
  updateWeddingDateDisplay();
  startCountdown();
});

function init() {
  // Load initial data if empty
  if (categories.length === 0) {
    categories = [...defaultCategories];
    saveData();
  }

  renderCategories();
  renderUrgentTasks();
  updateStats();
  populateCategorySuggestions();
  renderCalendar();
}

function setupEventListeners() {
  // Form submissions
  document
    .getElementById("categoryForm")
    .addEventListener("submit", handleCategorySubmit);
  document
    .getElementById("taskForm")
    .addEventListener("submit", handleTaskSubmit);
  document
    .getElementById("weddingDateForm")
    .addEventListener("submit", handleWeddingDateSubmit);

  // Modal close on outside click
  window.addEventListener("click", function (event) {
    const modals = [
      "categoryModal",
      "taskModal",
      "notesModal",
      "confirmModal",
      "weddingDateModal",
    ];
    modals.forEach((modalId) => {
      const modal = document.getElementById(modalId);
      if (event.target === modal) {
        closeModal(modalId);
      }
    });
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAllModals();
    }
    // Ctrl/Cmd + K for search focus
    if ((event.ctrlKey || event.metaKey) && event.key === "k") {
      event.preventDefault();
      document.getElementById("searchInput").focus();
    }
    // Ctrl/Cmd + N for new category
    if ((event.ctrlKey || event.metaKey) && event.key === "n") {
      event.preventDefault();
      openCategoryModal();
    }
    // Ctrl/Cmd + S for export
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      exportData();
    }
  });
}

// Utility functions
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function saveData() {
  localStorage.setItem("weddingCategories", JSON.stringify(categories));
  localStorage.setItem("weddingNotes", JSON.stringify(generalNotes));
  updateStats();
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function closeAllModals() {
  const modals = [
    "categoryModal",
    "taskModal",
    "notesModal",
    "confirmModal",
    "weddingDateModal",
  ];
  modals.forEach((modalId) => closeModal(modalId));
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  if (modalId === "categoryModal") {
    document.getElementById("categoryForm").reset();
  } else if (modalId === "taskModal") {
    document.getElementById("taskForm").reset();
  } else if (modalId === "weddingDateModal") {
    document.getElementById("weddingDateForm").reset();
  }
}

// Enhanced notification system
function showNotification(message, type = "success") {
  let notification = document.getElementById("notification");
  if (!notification) {
    notification = document.createElement("div");
    notification.id = "notification";
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
    document.body.appendChild(notification);
  }

  const colors = {
    success: "#28a745",
    error: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
  };

  notification.style.backgroundColor = colors[type] || colors.success;
  notification.textContent = message;
  notification.style.color = type === "warning" ? "#000" : "#fff";

  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";
  }, 100);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
  }, 4000);
}

// Performance monitoring
function logPerformance() {
  if (window.performance) {
    const perfData = {
      loadTime:
        window.performance.timing.loadEventEnd -
        window.performance.timing.navigationStart,
      categories: categories.length,
      totalTasks: categories.reduce((sum, cat) => sum + cat.tasks.length, 0),
      timestamp: new Date().toISOString(),
    };
    console.log("App Performance:", perfData);
  }
}

// Service Worker registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (registration) {
        console.log("ServiceWorker registration successful");
      })
      .catch(function (err) {
        console.log("ServiceWorker registration failed");
      });
  });
}

// Log performance after initialization
window.addEventListener("load", () => {
  setTimeout(logPerformance, 1000);
});

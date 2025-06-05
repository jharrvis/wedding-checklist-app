/**
 * Wedding Checklist App - Main Application
 * Version: 2.0.0
 * Author: Wedding Checklist Team
 * Description: Complete wedding planning checklist application
 */

// Application state
let categories = JSON.parse(localStorage.getItem("weddingCategories")) || [];
let generalNotes = JSON.parse(localStorage.getItem("weddingNotes")) || [];
let currentCategoryId = null;
let currentTaskId = null;
let currentNoteId = null;
let editMode = false;
let confirmAction = null;

// Initialize application
document.addEventListener("DOMContentLoaded", function () {
  init();
  setupEventListeners();
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
}

function setupEventListeners() {
  // Form submissions
  document
    .getElementById("categoryForm")
    .addEventListener("submit", handleCategorySubmit);
  document
    .getElementById("taskForm")
    .addEventListener("submit", handleTaskSubmit);

  // Modal close on outside click
  window.addEventListener("click", function (event) {
    const modals = ["categoryModal", "taskModal", "notesModal", "confirmModal"];
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
  const modals = ["categoryModal", "taskModal", "notesModal", "confirmModal"];
  modals.forEach((modalId) => closeModal(modalId));
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
  if (modalId === "categoryModal") {
    document.getElementById("categoryForm").reset();
  } else if (modalId === "taskModal") {
    document.getElementById("taskForm").reset();
  }
}

// Category management
function openCategoryModal(categoryId = null) {
  editMode = !!categoryId;
  currentCategoryId = categoryId;

  const modal = document.getElementById("categoryModal");
  const title = document.getElementById("categoryModalTitle");
  const nameInput = document.getElementById("categoryName");

  if (editMode) {
    const category = categories.find((cat) => cat.id === categoryId);
    title.textContent = "Edit Kategori";
    nameInput.value = category.name;
  } else {
    title.textContent = "Tambah Kategori";
    nameInput.value = "";
  }

  modal.style.display = "block";
  nameInput.focus();
}

function closeCategoryModal() {
  closeModal("categoryModal");
}

function populateCategorySuggestions() {
  const suggestionsDiv = document.getElementById("categorySuggestions");
  suggestionsDiv.innerHTML = "";

  categorySuggestions.forEach((suggestion) => {
    const tag = document.createElement("span");
    tag.className = "suggestion-tag";
    tag.textContent = suggestion;
    tag.onclick = () => {
      document.getElementById("categoryName").value = suggestion;
    };
    suggestionsDiv.appendChild(tag);
  });
}

function handleCategorySubmit(e) {
  e.preventDefault();
  const name = document.getElementById("categoryName").value.trim();

  if (editMode) {
    const category = categories.find((cat) => cat.id === currentCategoryId);
    category.name = name;
  } else {
    const newCategory = {
      id: generateId(),
      name: name,
      tasks: [],
    };
    categories.push(newCategory);
  }

  saveData();
  renderCategories();
  renderUrgentTasks();
  closeCategoryModal();
}

function deleteCategory(categoryId) {
  confirmAction = () => {
    categories = categories.filter((cat) => cat.id !== categoryId);
    saveData();
    renderCategories();
    renderUrgentTasks();
    closeConfirmModal();
  };

  openConfirmModal(
    "deleteCategory",
    "Hapus Kategori",
    "Apakah Anda yakin ingin menghapus kategori ini beserta semua tugasnya?"
  );
}

// Task management
function openTaskModal(categoryId, taskId = null) {
  currentCategoryId = categoryId;
  currentTaskId = taskId;
  editMode = !!taskId;

  const modal = document.getElementById("taskModal");
  const title = document.getElementById("taskModalTitle");
  const form = document.getElementById("taskForm");

  // Reset form
  form.reset();

  // Get category for suggestions
  const category = categories.find((cat) => cat.id === categoryId);
  populateTaskSuggestions(category.name);

  if (editMode) {
    const task = category.tasks.find((t) => t.id === taskId);
    title.textContent = "Edit Tugas";
    document.getElementById("taskName").value = task.name;
    document.getElementById("taskPriority").value = task.priority || "normal";
    document.getElementById("taskDate").value = task.date || "";
    document.getElementById("taskLocation").value = task.location || "";
    document.getElementById("taskNotes").value = task.notes || "";
  } else {
    title.textContent = "Tambah Tugas";
  }

  modal.style.display = "block";
  document.getElementById("taskName").focus();
}

function closeTaskModal() {
  closeModal("taskModal");
}

function populateTaskSuggestions(categoryName) {
  const suggestionsDiv = document.getElementById("taskSuggestions");
  const categoryKey = categoryName.toLowerCase().split(" ")[0];
  const suggestions = taskSuggestions[categoryKey] || [];

  suggestionsDiv.innerHTML = "";
  suggestions.slice(0, 15).forEach((suggestion) => {
    const tag = document.createElement("span");
    tag.className = "suggestion-tag";
    tag.textContent = suggestion;
    tag.onclick = () => {
      document.getElementById("taskName").value = suggestion;
    };
    suggestionsDiv.appendChild(tag);
  });
}

function handleTaskSubmit(e) {
  e.preventDefault();

  const taskData = {
    name: document.getElementById("taskName").value.trim(),
    priority: document.getElementById("taskPriority").value,
    date: document.getElementById("taskDate").value,
    location: document.getElementById("taskLocation").value.trim(),
    notes: document.getElementById("taskNotes").value.trim(),
  };

  const category = categories.find((cat) => cat.id === currentCategoryId);

  if (editMode) {
    const task = category.tasks.find((t) => t.id === currentTaskId);
    Object.assign(task, taskData);
  } else {
    const newTask = {
      id: generateId(),
      completed: false,
      createdAt: new Date().toISOString(),
      ...taskData,
    };
    category.tasks.push(newTask);
  }

  saveData();
  renderCategories();
  renderUrgentTasks();
  closeTaskModal();
}

function toggleTask(categoryId, taskId) {
  const category = categories.find((cat) => cat.id === categoryId);
  const task = category.tasks.find((t) => t.id === taskId);
  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date().toISOString() : null;

  saveData();
  renderCategories();
  renderUrgentTasks();
}

function deleteTask(categoryId, taskId) {
  confirmAction = () => {
    const category = categories.find((cat) => cat.id === categoryId);
    category.tasks = category.tasks.filter((t) => t.id !== taskId);
    saveData();
    renderCategories();
    renderUrgentTasks();
    closeConfirmModal();
  };

  openConfirmModal(
    "deleteTask",
    "Hapus Tugas",
    "Apakah Anda yakin ingin menghapus tugas ini?"
  );
}

// Rendering functions
function renderCategories() {
  const container = document.getElementById("categoriesContainer");

  if (categories.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <h3>Belum ada kategori</h3>
                <p>Mulai dengan menambahkan kategori pertama Anda!</p>
            </div>
        `;
    return;
  }

  container.innerHTML = categories
    .map((category) => {
      const completedTasks = category.tasks.filter(
        (task) => task.completed
      ).length;
      const totalTasks = category.tasks.length;
      const progressPercent =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return `
            <div class="category">
                <div class="category-header">
                    <div class="category-title">${category.name}</div>
                    <div class="category-actions">
                        <button class="btn btn-primary btn-small" onclick="openTaskModal('${
                          category.id
                        }')">
                            ➕ Tugas
                        </button>
                        <button class="btn btn-secondary btn-small" onclick="openCategoryModal('${
                          category.id
                        }')">
                            ✏️ Edit
                        </button>
                        <button class="btn btn-danger btn-small" onclick="deleteCategory('${
                          category.id
                        }')">
                            🗑️ Hapus
                        </button>
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <small style="color: #6c757d;">Progress: ${completedTasks}/${totalTasks} (${progressPercent}%)</small>
                    <div class="progress-bar" style="height: 4px; margin-top: 5px;">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
                
                <ul class="task-list">
                    ${category.tasks
                      .sort((a, b) => {
                        // Sort by priority first (urgent first), then by completion status
                        const priorityOrder = {
                          urgent: 0,
                          "very-important": 1,
                          important: 2,
                          normal: 3,
                        };
                        if (a.completed !== b.completed)
                          return a.completed - b.completed;
                        return (
                          priorityOrder[a.priority || "normal"] -
                          priorityOrder[b.priority || "normal"]
                        );
                      })
                      .map((task) => renderTaskItem(task, category.id))
                      .join("")}
                </ul>
                
                ${
                  category.tasks.length === 0
                    ? '<p style="text-align: center; color: #6c757d; font-style: italic;">Belum ada tugas</p>'
                    : ""
                }
            </div>
        `;
    })
    .join("");
}

function renderTaskItem(task, categoryId) {
  const priority = priorityLevels[task.priority || "normal"];
  const taskMeta = [];

  if (task.date) taskMeta.push(`📅 ${formatDate(task.date)}`);
  if (task.location) taskMeta.push(`📍 ${task.location}`);
  if (task.notes)
    taskMeta.push(
      `📝 ${task.notes.substring(0, 50)}${task.notes.length > 50 ? "..." : ""}`
    );

  return `
        <li class="task-item ${task.completed ? "completed" : ""} ${
    task.priority === "urgent" ? "urgent-task" : ""
  }">
            ${
              task.priority !== "normal"
                ? `<div class="priority-flag priority-${task.priority}">${priority.label}</div>`
                : ""
            }
            <input type="checkbox" class="task-checkbox" 
                   ${task.completed ? "checked" : ""}
                   onchange="toggleTask('${categoryId}', '${task.id}')">
            <div class="task-content">
                <div class="task-text">${task.name}</div>
                ${
                  taskMeta.length > 0
                    ? `<div class="task-meta">${taskMeta.join(" • ")}</div>`
                    : ""
                }
            </div>
            <div class="task-actions">
                <button class="btn btn-secondary btn-small" onclick="openTaskModal('${categoryId}', '${
    task.id
  }')">
                    ✏️
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteTask('${categoryId}', '${
    task.id
  }')">
                    🗑️
                </button>
            </div>
        </li>
    `;
}

function renderUrgentTasks() {
  const urgentTasks = [];

  categories.forEach((category) => {
    category.tasks.forEach((task) => {
      if (task.priority === "urgent" && !task.completed) {
        urgentTasks.push({
          ...task,
          categoryName: category.name,
          categoryId: category.id,
        });
      }
    });
  });

  const urgentSection = document.getElementById("urgentSection");
  const urgentTasksList = document.getElementById("urgentTasksList");

  if (urgentTasks.length === 0) {
    urgentSection.style.display = "none";
    return;
  }

  urgentSection.style.display = "block";
  urgentTasksList.innerHTML = urgentTasks
    .map(
      (task) => `
        <div class="task-item urgent-task" style="background: rgba(255,255,255,0.9); margin-bottom: 10px;">
            <input type="checkbox" class="task-checkbox" 
                   onchange="toggleTask('${task.categoryId}', '${task.id}')">
            <div class="task-content">
                <div class="task-text" style="color: #721c24; font-weight: bold;">
                    ${task.name}
                </div>
                <div class="task-meta" style="color: #721c24;">
                    Kategori: ${task.categoryName}
                    ${task.date ? ` • 📅 ${formatDate(task.date)}` : ""}
                    ${task.location ? ` • 📍 ${task.location}` : ""}
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-secondary btn-small" onclick="openTaskModal('${
                  task.categoryId
                }', '${task.id}')">
                    ✏️
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

function updateStats() {
  const totalTasks = categories.reduce((sum, cat) => sum + cat.tasks.length, 0);
  const completedTasks = categories.reduce(
    (sum, cat) => sum + cat.tasks.filter((task) => task.completed).length,
    0
  );
  const urgentTasks = categories.reduce(
    (sum, cat) =>
      sum +
      cat.tasks.filter((task) => task.priority === "urgent" && !task.completed)
        .length,
    0
  );
  const progressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  document.getElementById("totalTasks").textContent = totalTasks;
  document.getElementById("completedTasks").textContent = completedTasks;
  document.getElementById("urgentTasks").textContent = urgentTasks;
  document.getElementById("progressPercent").textContent =
    progressPercent + "%";
  document.getElementById("progressFill").style.width = progressPercent + "%";
}

// Notes management
function openNotesModal() {
  const modal = document.getElementById("notesModal");
  modal.style.display = "block";
  switchNotesTab("all");
}

function closeNotesModal() {
  closeModal("notesModal");
}

function switchNotesTab(tab) {
  // Update tab buttons
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  const notesContent = document.getElementById("notesContent");

  switch (tab) {
    case "all":
      renderAllNotes();
      break;
    case "task":
      renderTaskNotes();
      break;
    case "general":
      renderGeneralNotes();
      break;
  }
}

function renderAllNotes() {
  const notesContent = document.getElementById("notesContent");
  const taskNotes = [];

  // Collect task notes
  categories.forEach((category) => {
    category.tasks.forEach((task) => {
      if (task.notes) {
        taskNotes.push({
          type: "task",
          title: task.name,
          content: task.notes,
          categoryName: category.name,
          date: task.date || task.createdAt,
        });
      }
    });
  });

  const allNotes = [
    ...taskNotes,
    ...generalNotes.map((note) => ({ ...note, type: "general" })),
  ];
  allNotes.sort(
    (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
  );

  if (allNotes.length === 0) {
    notesContent.innerHTML =
      '<p style="text-align: center; color: #6c757d;">Belum ada catatan</p>';
    return;
  }

  notesContent.innerHTML = allNotes
    .map(
      (note) => `
        <div class="note-item">
            <div class="note-header">
                <div class="note-title">
                    ${note.type === "task" ? "📋" : "📝"} ${note.title}
                    ${note.categoryName ? ` (${note.categoryName})` : ""}
                </div>
                <div class="note-date">${formatDate(
                  note.date || note.createdAt
                )}</div>
            </div>
            <div class="note-content">${note.content}</div>
        </div>
    `
    )
    .join("");
}

function renderTaskNotes() {
  const notesContent = document.getElementById("notesContent");
  const taskNotes = [];

  categories.forEach((category) => {
    category.tasks.forEach((task) => {
      if (task.notes) {
        taskNotes.push({
          title: task.name,
          content: task.notes,
          categoryName: category.name,
          date: task.date || task.createdAt,
          taskId: task.id,
          categoryId: category.id,
        });
      }
    });
  });

  if (taskNotes.length === 0) {
    notesContent.innerHTML =
      '<p style="text-align: center; color: #6c757d;">Belum ada catatan tugas</p>';
    return;
  }

  notesContent.innerHTML = taskNotes
    .map(
      (note) => `
        <div class="note-item">
            <div class="note-header">
                <div class="note-title">📋 ${note.title} (${
        note.categoryName
      })</div>
                <div class="note-date">${formatDate(note.date)}</div>
            </div>
            <div class="note-content">${note.content}</div>
            <div class="note-actions">
                <button class="btn btn-primary btn-small" onclick="openTaskModal('${
                  note.categoryId
                }', '${note.taskId}')">
                    ✏️ Edit Tugas
                </button>
            </div>
        </div>
    `
    )
    .join("");
}

function renderGeneralNotes() {
  const notesContent = document.getElementById("notesContent");

  if (generalNotes.length === 0) {
    notesContent.innerHTML =
      '<p style="text-align: center; color: #6c757d;">Belum ada catatan umum</p>';
    return;
  }

  notesContent.innerHTML = generalNotes
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(
      (note) => `
            <div class="note-item">
                <div class="note-header">
                    <div class="note-title">📝 ${note.title}</div>
                    <div class="note-date">${formatDate(note.createdAt)}</div>
                </div>
                <div class="note-content">${note.content}</div>
                <div class="note-actions">
                    <button class="btn btn-danger btn-small" onclick="deleteGeneralNote('${
                      note.id
                    }')">
                        🗑️ Hapus
                    </button>
                </div>
            </div>
        `
    )
    .join("");
}

function addGeneralNote() {
  const title = prompt("Judul catatan:");
  if (!title) return;

  const content = prompt("Isi catatan:");
  if (!content) return;

  const newNote = {
    id: generateId(),
    title: title.trim(),
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };

  generalNotes.push(newNote);
  saveData();
  renderGeneralNotes();
}

function deleteGeneralNote(noteId) {
  confirmAction = () => {
    generalNotes = generalNotes.filter((note) => note.id !== noteId);
    saveData();
    renderGeneralNotes();
    closeConfirmModal();
  };

  openConfirmModal(
    "deleteNote",
    "Hapus Catatan",
    "Apakah Anda yakin ingin menghapus catatan ini?"
  );
}

// Confirmation modal
function openConfirmModal(type, title, message) {
  const modal = document.getElementById("confirmModal");
  const titleEl = document.getElementById("confirmTitle");
  const messageEl = document.getElementById("confirmMessage");
  const yesBtn = document.getElementById("confirmYes");

  titleEl.textContent = title;
  messageEl.textContent = message;

  // Remove existing event listeners
  yesBtn.replaceWith(yesBtn.cloneNode(true));
  const newYesBtn = document.getElementById("confirmYes");

  newYesBtn.addEventListener("click", confirmAction);

  modal.style.display = "block";
}

function closeConfirmModal() {
  closeModal("confirmModal");
}

// Reset data
function resetAllData() {
  confirmAction = () => {
    categories = [];
    generalNotes = [];
    localStorage.removeItem("weddingCategories");
    localStorage.removeItem("weddingNotes");
    renderCategories();
    renderUrgentTasks();
    updateStats();
    closeConfirmModal();
  };

  openConfirmModal(
    "resetData",
    "Reset Semua Data",
    "Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan!"
  );
}

// Export/Import functionality (bonus feature)
function exportData() {
  const data = {
    categories: categories,
    generalNotes: generalNotes,
    exportDate: new Date().toISOString(),
    version: "2.0.0",
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `wedding-checklist-backup-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);

      if (data.categories && Array.isArray(data.categories)) {
        categories = data.categories;
      }

      if (data.generalNotes && Array.isArray(data.generalNotes)) {
        generalNotes = data.generalNotes;
      }

      saveData();
      renderCategories();
      renderUrgentTasks();
      updateStats();

      alert("Data berhasil diimpor!");
    } catch (error) {
      alert("Error: File tidak valid atau rusak.");
      console.error("Import error:", error);
    }
  };

  reader.readAsText(file);
}

// Search functionality
function searchTasks(query) {
  if (!query.trim()) {
    renderCategories();
    return;
  }

  const filteredCategories = categories
    .map((category) => {
      const filteredTasks = category.tasks.filter(
        (task) =>
          task.name.toLowerCase().includes(query.toLowerCase()) ||
          (task.notes &&
            task.notes.toLowerCase().includes(query.toLowerCase())) ||
          (task.location &&
            task.location.toLowerCase().includes(query.toLowerCase()))
      );

      return {
        ...category,
        tasks: filteredTasks,
      };
    })
    .filter((category) => category.tasks.length > 0);

  const container = document.getElementById("categoriesContainer");

  if (filteredCategories.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <h3>Tidak ditemukan</h3>
                <p>Tidak ada tugas yang cocok dengan pencarian "${query}"</p>
            </div>
        `;
    return;
  }

  // Render filtered results (similar to renderCategories but with filtered data)
  container.innerHTML = filteredCategories
    .map((category) => {
      const completedTasks = category.tasks.filter(
        (task) => task.completed
      ).length;
      const totalTasks = category.tasks.length;
      const progressPercent =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return `
            <div class="category">
                <div class="category-header">
                    <div class="category-title">${
                      category.name
                    } (${totalTasks} hasil)</div>
                    <div class="category-actions">
                        <button class="btn btn-primary btn-small" onclick="openTaskModal('${
                          category.id
                        }')">
                            ➕ Tugas
                        </button>
                    </div>
                </div>
                
                <ul class="task-list">
                    ${category.tasks
                      .sort((a, b) => {
                        const priorityOrder = {
                          urgent: 0,
                          "very-important": 1,
                          important: 2,
                          normal: 3,
                        };
                        if (a.completed !== b.completed)
                          return a.completed - b.completed;
                        return (
                          priorityOrder[a.priority || "normal"] -
                          priorityOrder[b.priority || "normal"]
                        );
                      })
                      .map((task) => renderTaskItem(task, category.id))
                      .join("")}
                </ul>
            </div>
        `;
    })
    .join("");
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener("keydown", function (event) {
    // Ctrl/Cmd + K for search
    if ((event.ctrlKey || event.metaKey) && event.key === "k") {
      event.preventDefault();
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        searchInput.focus();
      }
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

// Notification system
function showNotification(message, type = "success") {
  // Create notification element if it doesn't exist
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
        `;
    document.body.appendChild(notification);
  }

  // Set notification style based on type
  const colors = {
    success: "#28a745",
    error: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
  };

  notification.style.backgroundColor = colors[type] || colors.success;
  notification.textContent = message;
  notification.style.color = type === "warning" ? "#000" : "#fff";

  // Show notification
  setTimeout(() => {
    notification.style.opacity = "1";
    notification.style.transform = "translateX(0)";
  }, 100);

  // Hide notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transform = "translateX(100%)";
  }, 3000);
}

// Enhanced stats calculation
function getDetailedStats() {
  const stats = {
    total: 0,
    completed: 0,
    urgent: 0,
    important: 0,
    overdue: 0,
    today: 0,
    thisWeek: 0,
    categories: categories.length,
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  categories.forEach((category) => {
    category.tasks.forEach((task) => {
      stats.total++;

      if (task.completed) {
        stats.completed++;
      }

      if (task.priority === "urgent") {
        stats.urgent++;
      }

      if (task.priority === "important" || task.priority === "very-important") {
        stats.important++;
      }

      if (task.date) {
        const taskDate = new Date(task.date);

        if (taskDate < today && !task.completed) {
          stats.overdue++;
        }

        if (taskDate.getTime() === today.getTime()) {
          stats.today++;
        }

        if (taskDate >= today && taskDate <= weekFromNow) {
          stats.thisWeek++;
        }
      }
    });
  });

  return stats;
}

// Initialize keyboard shortcuts
setupKeyboardShortcuts();

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

// Log performance after initialization
window.addEventListener("load", () => {
  setTimeout(logPerformance, 1000);
});

// Service Worker registration for offline capability (if service worker exists)
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

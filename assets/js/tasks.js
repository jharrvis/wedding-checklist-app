/**
 * Task Management
 * Version: 2.1.0
 */

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
  if (!suggestionsDiv) return;

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

  const taskName = document.getElementById("taskName").value.trim();
  if (!taskName) {
    showNotification("Nama tugas tidak boleh kosong!", "error");
    return;
  }

  const taskData = {
    name: taskName,
    priority: document.getElementById("taskPriority").value,
    date: document.getElementById("taskDate").value,
    location: document.getElementById("taskLocation").value.trim(),
    notes: document.getElementById("taskNotes").value.trim(),
  };

  const category = categories.find((cat) => cat.id === currentCategoryId);

  if (editMode) {
    const task = category.tasks.find((t) => t.id === currentTaskId);
    Object.assign(task, taskData);
    showNotification("Tugas berhasil diupdate!", "success");
  } else {
    const newTask = {
      id: generateId(),
      completed: false,
      createdAt: new Date().toISOString(),
      ...taskData,
    };
    category.tasks.push(newTask);
    showNotification("Tugas baru berhasil ditambahkan!", "success");
  }

  saveData();
  renderCategories();
  renderUrgentTasks();
  if (isCalendarView) renderCalendar();
  closeTaskModal();
}

function toggleTask(categoryId, taskId) {
  const category = categories.find((cat) => cat.id === categoryId);
  const task = category.tasks.find((t) => t.id === taskId);

  if (!task) return;

  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date().toISOString() : null;

  saveData();
  renderCategories();
  renderUrgentTasks();
  if (isCalendarView) renderCalendar();

  showNotification(
    task.completed
      ? "Tugas berhasil diselesaikan! 🎉"
      : "Tugas ditandai belum selesai",
    task.completed ? "success" : "info"
  );
}

function deleteTask(categoryId, taskId) {
  const category = categories.find((cat) => cat.id === categoryId);
  const task = category.tasks.find((t) => t.id === taskId);

  if (!task) return;

  confirmAction = () => {
    category.tasks = category.tasks.filter((t) => t.id !== taskId);
    saveData();
    renderCategories();
    renderUrgentTasks();
    if (isCalendarView) renderCalendar();
    closeConfirmModal();
    showNotification("Tugas berhasil dihapus!", "success");
  };

  openConfirmModal(
    "deleteTask",
    "Hapus Tugas",
    `Apakah Anda yakin ingin menghapus tugas "${task.name}"?`
  );
}

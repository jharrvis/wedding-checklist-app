/**
 * Drag and Drop Functionality
 * Version: 2.1.0
 */

// Drag and Drop Functions
function setupDragAndDrop() {
  // This will be called after rendering to setup drag events
}

function makeDraggable(element, type, id) {
  element.draggable = true;
  element.addEventListener("dragstart", function (e) {
    draggedItem = { type, id, element };
    element.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", element.outerHTML);
  });

  element.addEventListener("dragend", function (e) {
    element.classList.remove("dragging");
    draggedItem = null;
  });
}

function makeDropZone(element, targetType, targetId) {
  element.addEventListener("dragover", function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    element.classList.add("drag-over");
  });

  element.addEventListener("dragleave", function (e) {
    if (!element.contains(e.relatedTarget)) {
      element.classList.remove("drag-over");
    }
  });

  element.addEventListener("drop", function (e) {
    e.preventDefault();
    element.classList.remove("drag-over");

    if (!draggedItem) return;

    if (draggedItem.type === "task" && targetType === "category") {
      moveTaskToCategory(draggedItem.id, targetId);
    } else if (draggedItem.type === "category" && targetType === "reorder") {
      reorderCategories(draggedItem.id, targetId);
    }
  });
}

function moveTaskToCategory(taskId, targetCategoryId) {
  let sourceCategory = null;
  let task = null;

  // Find source category and task
  for (let category of categories) {
    const taskIndex = category.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex !== -1) {
      task = category.tasks[taskIndex];
      sourceCategory = category;
      category.tasks.splice(taskIndex, 1);
      break;
    }
  }

  if (!task || !sourceCategory) return;

  // Add to target category
  const targetCategory = categories.find((c) => c.id === targetCategoryId);
  if (targetCategory && targetCategory.id !== sourceCategory.id) {
    targetCategory.tasks.push(task);
    saveData();
    renderCategories();
    renderUrgentTasks();
    showNotification(
      `Tugas "${task.name}" dipindahkan ke "${targetCategory.name}"`,
      "success"
    );
  }
}

function reorderCategories(draggedCategoryId, targetCategoryId) {
  const draggedIndex = categories.findIndex((c) => c.id === draggedCategoryId);
  const targetIndex = categories.findIndex((c) => c.id === targetCategoryId);

  if (
    draggedIndex !== -1 &&
    targetIndex !== -1 &&
    draggedIndex !== targetIndex
  ) {
    const [draggedCategory] = categories.splice(draggedIndex, 1);
    categories.splice(targetIndex, 0, draggedCategory);
    saveData();
    renderCategories();
    showNotification("Urutan kategori berhasil diubah", "success");
  }
}

function setupDragAndDropAfterRender() {
  // Setup category drag and drop
  document.querySelectorAll(".category").forEach((categoryEl) => {
    const categoryId = categoryEl.dataset.categoryId;
    makeDraggable(categoryEl, "category", categoryId);
    makeDropZone(categoryEl, "category", categoryId);
  });

  // Setup task drag and drop
  document.querySelectorAll(".task-item").forEach((taskEl) => {
    const taskId = taskEl.dataset.taskId;
    makeDraggable(taskEl, "task", taskId);
  });
}

/**
 * Rendering Functions
 * Version: 2.1.0
 */

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
      const isCollapsed = category.collapsed || false;

      return `
          <div class="category ${isCollapsed ? "collapsed" : ""}" 
               data-category-id="${category.id}"
               draggable="true">
              <div class="category-header">
                  <div class="category-title">
                      <button class="category-toggle" onclick="toggleCategory('${
                        category.id
                      }')">
                          ${isCollapsed ? "▶" : "▼"}
                      </button>
                      ${category.name}
                  </div>
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
              
              <div class="category-progress">
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
                  ? '<p style="text-align: center; color: #6c757d; font-style: italic; padding: 20px;">Belum ada tugas</p>'
                  : ""
              }
          </div>
      `;
    })
    .join("");

  // Setup drag and drop after rendering
  setupDragAndDropAfterRender();
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
  }"
          data-task-id="${task.id}" draggable="true">
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

  const totalEl = document.getElementById("totalTasks");
  const completedEl = document.getElementById("completedTasks");
  const urgentEl = document.getElementById("urgentTasks");
  const progressPercentEl = document.getElementById("progressPercent");
  const progressFillEl = document.getElementById("progressFill");

  if (totalEl) totalEl.textContent = totalTasks;
  if (completedEl) completedEl.textContent = completedTasks;
  if (urgentEl) urgentEl.textContent = urgentTasks;
  if (progressPercentEl) progressPercentEl.textContent = progressPercent + "%";
  if (progressFillEl) progressFillEl.style.width = progressPercent + "%";
}

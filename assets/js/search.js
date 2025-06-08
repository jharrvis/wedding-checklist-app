/**
 * Search Functionality
 * Version: 2.1.0
 */

// Search Functions
function handleSearch(event) {
  searchQuery = event.target.value.toLowerCase().trim();
  const clearBtn = document.querySelector(".search-clear");

  if (searchQuery) {
    clearBtn.style.display = "block";
    searchTasks(searchQuery);
  } else {
    clearBtn.style.display = "none";
    renderCategories();
  }
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  document.querySelector(".search-clear").style.display = "none";
  searchQuery = "";
  renderCategories();
}

function searchTasks(query) {
  if (!query.trim()) {
    renderCategories();
    return;
  }

  const filteredCategories = categories
    .map((category) => {
      const filteredTasks = category.tasks.filter(
        (task) =>
          task.name.toLowerCase().includes(query) ||
          (task.notes && task.notes.toLowerCase().includes(query)) ||
          (task.location && task.location.toLowerCase().includes(query))
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
              <button class="btn btn-secondary" onclick="clearSearch()">Hapus Pencarian</button>
          </div>
      `;
    return;
  }

  // Render filtered results
  container.innerHTML = filteredCategories
    .map((category) => {
      const completedTasks = category.tasks.filter(
        (task) => task.completed
      ).length;
      const totalTasks = category.tasks.length;
      const progressPercent =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return `
          <div class="category" data-category-id="${category.id}">
              <div class="category-header">
                  <div class="category-title">
                      🔍 ${category.name} (${totalTasks} hasil)
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

/**
 * Category Management
 * Version: 2.1.0
 */

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
  if (!suggestionsDiv) return;

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

  if (!name) {
    showNotification("Nama kategori tidak boleh kosong!", "error");
    return;
  }

  if (editMode) {
    const category = categories.find((cat) => cat.id === currentCategoryId);
    category.name = name;
    showNotification("Kategori berhasil diupdate!", "success");
  } else {
    const newCategory = {
      id: generateId(),
      name: name,
      tasks: [],
      collapsed: false,
    };
    categories.push(newCategory);
    showNotification("Kategori baru berhasil ditambahkan!", "success");
  }

  saveData();
  renderCategories();
  renderUrgentTasks();
  closeCategoryModal();
}

function deleteCategory(categoryId) {
  const category = categories.find((cat) => cat.id === categoryId);
  if (!category) return;

  const taskCount = category.tasks.length;

  confirmAction = () => {
    categories = categories.filter((cat) => cat.id !== categoryId);
    saveData();
    renderCategories();
    renderUrgentTasks();
    closeConfirmModal();
    showNotification("Kategori berhasil dihapus!", "success");
  };

  openConfirmModal(
    "deleteCategory",
    "Hapus Kategori",
    `Apakah Anda yakin ingin menghapus kategori "${category.name}" beserta ${taskCount} tugas di dalamnya?`
  );
}

// Category collapse/expand functions
function toggleCategory(categoryId) {
  const categoryElement = document.querySelector(
    `[data-category-id="${categoryId}"]`
  );
  if (categoryElement) {
    categoryElement.classList.toggle("collapsed");

    // Save collapsed state
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      category.collapsed = categoryElement.classList.contains("collapsed");
      saveData();
    }
  }
}

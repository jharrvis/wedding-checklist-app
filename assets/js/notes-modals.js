/**
 * Notes and Modal Management
 * Version: 2.1.0
 */

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

  // Find the clicked tab button
  const tabButtons = document.querySelectorAll(".tab-btn");
  tabButtons.forEach((btn) => {
    if (btn.onclick && btn.onclick.toString().includes(tab)) {
      btn.classList.add("active");
    }
  });

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
  showNotification("Catatan berhasil ditambahkan!", "success");
}

function deleteGeneralNote(noteId) {
  confirmAction = () => {
    generalNotes = generalNotes.filter((note) => note.id !== noteId);
    saveData();
    renderGeneralNotes();
    closeConfirmModal();
    showNotification("Catatan berhasil dihapus!", "success");
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

// Reset data with enhanced warning
function resetAllData() {
  const totalTasks = categories.reduce((sum, cat) => sum + cat.tasks.length, 0);
  const totalCategories = categories.length;
  const totalNotes = generalNotes.length;

  confirmAction = () => {
    categories = [];
    generalNotes = [];
    weddingDate = null;
    weddingTime = null;
    localStorage.removeItem("weddingCategories");
    localStorage.removeItem("weddingNotes");
    localStorage.removeItem("weddingDate");
    localStorage.removeItem("weddingTime");
    renderCategories();
    renderUrgentTasks();
    updateStats();
    updateWeddingDateDisplay();
    closeConfirmModal();
    showNotification("Semua data berhasil dihapus!", "success");
  };

  openConfirmModal(
    "resetData",
    "⚠️ PERINGATAN: Reset Semua Data",
    `Anda akan menghapus SEMUA data termasuk:\n• ${totalCategories} kategori\n• ${totalTasks} tugas\n• ${totalNotes} catatan\n• Tanggal pernikahan\n\nTindakan ini TIDAK DAPAT DIBATALKAN dan semua data akan hilang permanen!`
  );
}

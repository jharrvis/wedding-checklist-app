/**
 * Data Export/Import and Analytics
 * Version: 2.1.0
 */

// Export/Import functionality
function exportData() {
  const data = {
    categories: categories,
    generalNotes: generalNotes,
    weddingDate: weddingDate,
    weddingTime: weddingTime,
    exportDate: new Date().toISOString(),
    version: "2.1.0",
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

  showNotification("Data berhasil diexport!", "success");
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

      if (data.weddingDate) {
        weddingDate = data.weddingDate;
        localStorage.setItem("weddingDate", weddingDate);
      }

      if (data.weddingTime) {
        weddingTime = data.weddingTime;
        localStorage.setItem("weddingTime", weddingTime);
      }

      saveData();
      renderCategories();
      renderUrgentTasks();
      updateStats();
      updateWeddingDateDisplay();

      showNotification("Data berhasil diimpor!", "success");
    } catch (error) {
      showNotification("Error: File tidak valid atau rusak.", "error");
      console.error("Import error:", error);
    }
  };

  reader.readAsText(file);
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

// Progress report generation
function generateProgressReport() {
  const stats = getDetailedStats();
  const progressPercent =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const report = {
    summary: {
      totalCategories: stats.categories,
      totalTasks: stats.total,
      completedTasks: stats.completed,
      progressPercent: progressPercent,
      urgentTasks: stats.urgent,
      importantTasks: stats.important,
      overdueTasks: stats.overdue,
      todayTasks: stats.today,
      thisWeekTasks: stats.thisWeek,
    },
    categoryBreakdown: categories.map((category) => {
      const categoryCompleted = category.tasks.filter(
        (t) => t.completed
      ).length;
      const categoryTotal = category.tasks.length;
      const categoryProgress =
        categoryTotal > 0
          ? Math.round((categoryCompleted / categoryTotal) * 100)
          : 0;

      return {
        name: category.name,
        totalTasks: categoryTotal,
        completedTasks: categoryCompleted,
        progressPercent: categoryProgress,
        urgentTasks: category.tasks.filter(
          (t) => t.priority === "urgent" && !t.completed
        ).length,
      };
    }),
    generatedAt: new Date().toISOString(),
    weddingDate: weddingDate,
    daysUntilWedding: weddingDate
      ? Math.ceil((new Date(weddingDate) - new Date()) / (1000 * 60 * 60 * 24))
      : null,
  };

  return report;
}

function exportProgressReport() {
  const report = generateProgressReport();
  const reportStr = JSON.stringify(report, null, 2);
  const reportBlob = new Blob([reportStr], { type: "application/json" });
  const url = URL.createObjectURL(reportBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `wedding-progress-report-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showNotification("Laporan progress berhasil diexport!", "success");
}

// Data validation
function validateData(data) {
  const errors = [];

  if (!data.categories || !Array.isArray(data.categories)) {
    errors.push("Categories data is missing or invalid");
  }

  if (!data.generalNotes || !Array.isArray(data.generalNotes)) {
    errors.push("General notes data is missing or invalid");
  }

  if (data.version && data.version !== "2.1.0") {
    errors.push(`Version mismatch: expected 2.1.0, got ${data.version}`);
  }

  return errors;
}

// Backup management
function createAutoBackup() {
  const backupData = {
    categories: categories,
    generalNotes: generalNotes,
    weddingDate: weddingDate,
    weddingTime: weddingTime,
    backupDate: new Date().toISOString(),
    version: "2.1.0",
    autoBackup: true,
  };

  localStorage.setItem("weddingBackup", JSON.stringify(backupData));
  console.log("Auto backup created successfully");
}

function restoreFromBackup() {
  const backup = localStorage.getItem("weddingBackup");
  if (!backup) {
    showNotification("Tidak ada backup yang tersedia", "error");
    return false;
  }

  try {
    const data = JSON.parse(backup);
    const errors = validateData(data);

    if (errors.length > 0) {
      showNotification("Backup tidak valid: " + errors.join(", "), "error");
      return false;
    }

    categories = data.categories || [];
    generalNotes = data.generalNotes || [];
    weddingDate = data.weddingDate || null;
    weddingTime = data.weddingTime || null;

    saveData();
    renderCategories();
    renderUrgentTasks();
    updateStats();
    updateWeddingDateDisplay();

    showNotification("Data berhasil dipulihkan dari backup!", "success");
    return true;
  } catch (error) {
    showNotification("Error saat memulihkan backup", "error");
    console.error("Backup restore error:", error);
    return false;
  }
}

// Performance monitoring
function trackUserActivity() {
  const activity = {
    timestamp: new Date().toISOString(),
    totalCategories: categories.length,
    totalTasks: categories.reduce((sum, cat) => sum + cat.tasks.length, 0),
    completedTasks: categories.reduce(
      (sum, cat) => sum + cat.tasks.filter((t) => t.completed).length,
      0
    ),
    sessionDuration: Date.now() - (window.sessionStartTime || Date.now()),
  };

  console.log("User Activity:", activity);
  return activity;
}

// Initialize session tracking
window.sessionStartTime = Date.now();

// Auto backup every 5 minutes
setInterval(createAutoBackup, 5 * 60 * 1000);

// Track activity on page unload
window.addEventListener("beforeunload", trackUserActivity);

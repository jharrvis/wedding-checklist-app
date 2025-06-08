/**
 * Calendar View Management
 * Version: 2.1.0
 */

// Calendar Functions
function toggleCalendarView() {
  isCalendarView = !isCalendarView;
  const calendarView = document.getElementById("calendarView");
  const categoriesContainer = document.getElementById("categoriesContainer");
  const toggleText = document.getElementById("calendarToggleText");

  if (isCalendarView) {
    calendarView.style.display = "block";
    categoriesContainer.style.display = "none";
    toggleText.textContent = "List View";
    renderCalendar();
  } else {
    calendarView.style.display = "none";
    categoriesContainer.style.display = "grid";
    toggleText.textContent = "Calendar View";
  }
}

function renderCalendar() {
  const monthYear = document.getElementById("calendarMonthYear");
  const calendarGrid = document.getElementById("calendarGrid");

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  monthYear.textContent = currentCalendarDate.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Create calendar grid
  let calendarHTML = "";

  // Day headers
  const dayHeaders = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  dayHeaders.forEach((day) => {
    calendarHTML += `<div class="calendar-day-header">${day}</div>`;
  });

  // Previous month days
  const prevMonth = new Date(year, month - 1, 0);
  const prevMonthDays = prevMonth.getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    calendarHTML += `<div class="calendar-day other-month">
          <div class="calendar-day-number">${day}</div>
      </div>`;
  }

  // Current month days
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDay = new Date(year, month, day);
    const isToday = currentDay.toDateString() === today.toDateString();
    const tasksForDay = getTasksForDate(currentDay);

    calendarHTML += `
          <div class="calendar-day ${
            isToday ? "today" : ""
          }" onclick="showTasksForDate('${
      currentDay.toISOString().split("T")[0]
    }')">
              <div class="calendar-day-number">${day}</div>
              ${tasksForDay
                .map(
                  (task) => `
                  <div class="calendar-task ${
                    task.priority || "normal"
                  }" title="${task.name}">
                      ${task.name.substring(0, 15)}${
                    task.name.length > 15 ? "..." : ""
                  }
                  </div>
              `
                )
                .join("")}
          </div>
      `;
  }

  // Next month days
  const totalCells = calendarHTML.split("calendar-day").length - 1;
  const remainingCells = 42 - totalCells; // 6 rows × 7 days
  for (let day = 1; day <= remainingCells; day++) {
    calendarHTML += `<div class="calendar-day other-month">
          <div class="calendar-day-number">${day}</div>
      </div>`;
  }

  calendarGrid.innerHTML = calendarHTML;
}

function getTasksForDate(date) {
  const dateString = date.toISOString().split("T")[0];
  const tasksForDate = [];

  categories.forEach((category) => {
    category.tasks.forEach((task) => {
      if (task.date === dateString) {
        tasksForDate.push({
          ...task,
          categoryName: category.name,
          categoryId: category.id,
        });
      }
    });
  });

  return tasksForDate.sort((a, b) => {
    const priorityOrder = {
      urgent: 0,
      "very-important": 1,
      important: 2,
      normal: 3,
    };
    return (
      priorityOrder[a.priority || "normal"] -
      priorityOrder[b.priority || "normal"]
    );
  });
}

function showTasksForDate(dateString) {
  const tasksForDate = getTasksForDate(new Date(dateString));
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (tasksForDate.length === 0) {
    showNotification(`Tidak ada tugas untuk ${formattedDate}`, "info");
    return;
  }

  const tasksList = tasksForDate
    .map(
      (task) => `
      <div class="task-item ${task.completed ? "completed" : ""}">
          <input type="checkbox" ${task.completed ? "checked" : ""} 
                 onchange="toggleTask('${task.categoryId}', '${task.id}')">
          <div class="task-content">
              <div class="task-text">${task.name}</div>
              <div class="task-meta">
                  <span>📁 ${task.categoryName}</span>
                  ${task.location ? `<span>📍 ${task.location}</span>` : ""}
                  ${
                    task.priority !== "normal"
                      ? `<span class="priority-${task.priority}">🏷️ ${
                          priorityLevels[task.priority].label
                        }</span>`
                      : ""
                  }
              </div>
          </div>
      </div>
  `
    )
    .join("");

  // Create a simple modal to show tasks
  const modalHTML = `
      <div class="modal" style="display: block;" onclick="this.remove()">
          <div class="modal-content" onclick="event.stopPropagation()">
              <div class="modal-header">
                  <h2>📅 Tugas untuk ${formattedDate}</h2>
                  <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
              </div>
              <div style="max-height: 400px; overflow-y: auto;">
                  ${tasksList}
              </div>
              <div style="margin-top: 15px; text-align: center;">
                  <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Tutup</button>
              </div>
          </div>
      </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function previousMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  renderCalendar();
}

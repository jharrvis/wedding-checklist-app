/**
 * Wedding Date & Countdown Management
 * Version: 2.1.0
 */

// Wedding Date & Countdown Functions
function openWeddingDateModal() {
  const modal = document.getElementById("weddingDateModal");
  const dateInput = document.getElementById("weddingDate");
  const timeInput = document.getElementById("weddingTime");

  if (weddingDate) {
    dateInput.value = weddingDate;
  }
  if (weddingTime) {
    timeInput.value = weddingTime;
  }

  modal.style.display = "block";
  dateInput.focus();
}

function closeWeddingDateModal() {
  closeModal("weddingDateModal");
}

function handleWeddingDateSubmit(e) {
  e.preventDefault();

  weddingDate = document.getElementById("weddingDate").value;
  weddingTime = document.getElementById("weddingTime").value;

  localStorage.setItem("weddingDate", weddingDate);
  localStorage.setItem("weddingTime", weddingTime);

  updateWeddingDateDisplay();
  closeWeddingDateModal();

  showNotification("Tanggal pernikahan berhasil disimpan!", "success");
}

function updateWeddingDateDisplay() {
  const dateDisplay = document.getElementById("weddingDateDisplay");
  const timeDisplay = document.getElementById("weddingTimeDisplay");

  if (weddingDate) {
    const date = new Date(weddingDate);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    dateDisplay.textContent = date.toLocaleDateString("id-ID", options);

    if (weddingTime) {
      timeDisplay.textContent = `Pukul ${weddingTime}`;
    }
  } else {
    dateDisplay.textContent = "Belum ditentukan";
    timeDisplay.textContent = "";
  }
}

function startCountdown() {
  function updateCountdown() {
    const countdownDisplay = document.getElementById("countdownDisplay");

    if (!weddingDate || !weddingTime) {
      countdownDisplay.textContent = "--";
      return;
    }

    const now = new Date();
    const weddingDateTime = new Date(`${weddingDate}T${weddingTime}`);
    const timeDiff = weddingDateTime - now;

    if (timeDiff <= 0) {
      countdownDisplay.textContent = "🎉 Hari Bahagia Telah Tiba!";
      return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      countdownDisplay.textContent = `${days} hari ${hours} jam`;
    } else if (hours > 0) {
      countdownDisplay.textContent = `${hours} jam ${minutes} menit`;
    } else {
      countdownDisplay.textContent = `${minutes} menit`;
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 60000); // Update every minute
}

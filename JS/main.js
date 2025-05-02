const daysEl = document.getElementById("days");
const monthYearEl = document.getElementById("monthYear");

const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

function renderCalendar(month, year) {
  daysEl.innerHTML = "";

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  monthYearEl.textContent = `${getMonthName(month)} ${year}`;

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    daysEl.appendChild(empty);
  }

  for (let day = 1; day <= totalDays; day++) {
    const dayEl = document.createElement("div");
    dayEl.classList.add("day");
    dayEl.textContent = day;
    daysEl.appendChild(dayEl);
  }
}

function getMonthName(month) {
  const names = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
  return names[month];
}

renderCalendar(currentMonth, currentYear);

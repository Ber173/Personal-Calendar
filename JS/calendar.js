// Grab elements
const calendarElement = document.querySelector('.container');
const monthElement    = document.querySelector('#month');
const yearElement     = document.querySelector('#year');
const nextBtn         = document.querySelector('#next');
const prevBtn         = document.querySelector('#previous');
const landingPage     = document.getElementById('landingPage');
const calendarApp     = document.getElementById('calendarApp');

// Month & day names
const months    = ['January','February','March','April','May','June',
                   'July','August','September','October','November','December'];
const days      = ['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.'];
const monthDays = [31,28,31,30,31,30,31,31,30,31,30,31];

// Default to today's month/year
const today = new Date();
let currentMonthNumber = today.getMonth();
let currentYear        = today.getFullYear();

// “Start” button: hide landing, show & center calendarApp
document.getElementById('startButton').addEventListener('click', () => {
  landingPage.style.display = 'none';
  calendarApp.style.display = 'flex';
});

// Next / Previous handlers
nextBtn.addEventListener('click', () => {
  if (currentMonthNumber < 11) {
    currentMonthNumber++;
  } else {
    currentMonthNumber = 0;
    currentYear++;
  }
  refreshCalendar();
});
prevBtn.addEventListener('click', () => {
  if (currentMonthNumber > 0) {
    currentMonthNumber--;
  } else {
    currentMonthNumber = 11;
    currentYear--;
  }
  refreshCalendar();
});

// Helpers to build the calendar
function determineDay(date) {
  const d = new Date(currentYear, currentMonthNumber, date);
  return days[d.getDay()];
}

function getDateElement(date) {
  const ele = document.createElement('div');
  ele.id = date;
  ele.className = 'date';
  if (date === 1) ele.classList.add('special');

  ele.textContent = date;
  ele.addEventListener('mouseover', ()  => ele.textContent = determineDay(date));
  ele.addEventListener('mouseleave', () => ele.textContent = date);
  ele.addEventListener('click', ()     => showEventForDate(ele));

  // Colored dot if events exist
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const dotsForDate = events.filter(ev => {
    const [y, m, d] = ev.date.split('-').map(Number);
    return y === currentYear && m - 1 === currentMonthNumber && d === date;
  });

  if (dotsForDate.length > 0) {
    const dot = document.createElement('span');
    dot.className = 'event-dot';
    dot.style.backgroundColor = dotsForDate[0].color || 'red'; // default red if no color
    ele.appendChild(dot);
  }

  return ele;
}

function populateCalendar() {
  monthElement.textContent = months[currentMonthNumber];
  yearElement.textContent  = currentYear;
  for (let d = 1; d <= monthDays[currentMonthNumber]; d++) {
    calendarElement.appendChild(getDateElement(d));
  }
}

function depopulateCalendar() {
  calendarElement.innerHTML = '';
}

function refreshCalendar() {
  depopulateCalendar();
  populateCalendar();
}

// Event storage & display
function saveEvent(date, name, start, end, color) {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  events.push({ name, date, start, end, color });
  localStorage.setItem('events', JSON.stringify(events));
  displayEvents();
  refreshCalendar();
}

function displayEvents() {
  const container = document.getElementById('eventsList');
  const events    = JSON.parse(localStorage.getItem('events')) || [];
  container.innerHTML = '';

  events.forEach((ev,i) => {
    const li = document.createElement('li');
    li.className = 'event-item';

    const span = document.createElement('span');
    span.textContent = `${ev.name}: ${ev.date} ${ev.start}-${ev.end}`;
    if (ev.color) span.style.color = ev.color;

    span.addEventListener('click', () => {
      currentYear        = Number(ev.date.split('-')[0]);
      currentMonthNumber = Number(ev.date.split('-')[1]) - 1;
      refreshCalendar();
      setTimeout(() => {
        document.querySelectorAll('.date').forEach(el => el.classList.remove('selected-date'));
        const dayCell = document.getElementById(String(Number(ev.date.split('-')[2])));
        if (dayCell) dayCell.classList.add('selected-date');
      }, 0);
    });

    const btn = document.createElement('button');
    btn.className = 'delete-button';
    btn.textContent = '🗑️';
    btn.onclick = () => deleteEvent(i);

    li.append(span, btn);
    container.appendChild(li);
  });
}

function deleteEvent(index) {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  events.splice(index, 1);
  localStorage.setItem('events', JSON.stringify(events));
  displayEvents();
  refreshCalendar();
}
function showEventForDate(ele) {
    const date = Number(ele.id);
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const list = events.filter(ev => {
      const [y, m, d] = ev.date.split('-').map(Number);
      return y === currentYear && m - 1 === currentMonthNumber && d === date;
    });
  
    // Nếu popup đã tồn tại thì không tạo lại
    if (ele.querySelector('.eventsForDay')) return;
  
    const popup = document.createElement('div');
    popup.className = 'eventsForDay';
  
    // Style gọn gàng và cuộn được
    popup.style.maxHeight = '200px';
    popup.style.overflowY = 'auto';
    popup.style.background = '#fff';
    popup.style.border = '1px solid #ccc';
    popup.style.padding = '8px';
    popup.style.borderRadius = '6px';
    popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    popup.style.marginTop = '4px';
    popup.style.zIndex = '10';
    popup.style.position = 'absolute';
  
    if (list.length) {
      const header = document.createElement('div');
      header.textContent = `${list.length} event${list.length > 1 ? 's' : ''}`;
      header.style.fontWeight = 'bold';
      header.style.marginBottom = '6px';
      popup.appendChild(header);
  
      list.forEach(ev => {
        const div = document.createElement('div');
        div.textContent = `${ev.name}: ${ev.start}–${ev.end}`;
        div.style.backgroundColor = ev.color || '#444';
        div.style.color = '#fff';
        div.style.padding = '4px 8px';
        div.style.borderRadius = '5px';
        div.style.margin = '4px 0';
        popup.appendChild(div);
      });
    } else {
      popup.textContent = 'No events for this day.';
    }
  
    ele.appendChild(popup);
  
    // 👇 Thêm xử lý ẩn popup khi rời khỏi cả .date và popup
    ele.addEventListener('mouseleave', () => {
      setTimeout(() => {
        // Nếu chuột không còn trong ele hoặc popup thì xóa
        if (!ele.matches(':hover') && !popup.matches(':hover')) {
          popup.remove();
        }
      }, 200); // delay nhẹ để tránh mất khi di chuyển vào popup
    });
  
    popup.addEventListener('mouseleave', () => {
      setTimeout(() => {
        if (!ele.matches(':hover') && !popup.matches(':hover')) {
          popup.remove();
        }
      }, 200);
    });
  }
  
  
  
// Submit button
document.querySelector('.submit-button').addEventListener('click', () => {
  const name  = document.getElementById('eventName').value;
  const date  = document.getElementById('eventDate').value;
  const start = document.getElementById('eventStart').value;
  const end   = document.getElementById('eventEnd').value;
  const color = document.getElementById('eventColor').value;

  if (!name || !date || !start || !end) {
    return alert('Please fill in all fields!');
  }

  saveEvent(date, name, start, end, color);

  // Clear inputs
  ['eventName', 'eventDate', 'eventStart', 'eventEnd', 'eventColor'].forEach(id => {
    document.getElementById(id).value = '';
  });
});

// On page load
window.addEventListener('load', () => {
  displayEvents();
  populateCalendar();
});

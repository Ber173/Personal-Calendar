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
  calendarApp.style.display = 'flex';    // ← flex to lay out side-by-side
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

  // Red dot if an event exists for this date
  const events = JSON.parse(localStorage.getItem('events')) || [];
  if (events.some(ev => {
      const [y,m,d] = ev.date.split('-').map(Number);
      return y===currentYear && m-1===currentMonthNumber && d===date;
    })) {
    const dot = document.createElement('span');
    dot.className = 'event-dot';
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
function saveEvent(date, name, start, end) {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  events.push({ name, date, start, end });
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
  events.splice(index,1);
  localStorage.setItem('events', JSON.stringify(events));
  displayEvents();
  refreshCalendar();
}

function showEventForDate(ele) {
  const date = Number(ele.id);
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const list = events.filter(ev => {
    const [y,m,d] = ev.date.split('-').map(Number);
    return y===currentYear && m-1===currentMonthNumber && d===date;
  });

  // Remove old popup
  const prev = ele.querySelector('.eventsForDay');
  if (prev) prev.remove();

  // Build new popup
  const popup = document.createElement('div');
  popup.className = 'eventsForDay';
  if (list.length) {
    list.forEach(ev => {
      const div = document.createElement('div');
      div.textContent = `${ev.name}: ${ev.start}–${ev.end}`;
      popup.appendChild(div);
    });
  } else {
    popup.textContent = 'No events for this day.';
  }
  ele.appendChild(popup);
}

document.getElementById('startButton').addEventListener('click', () => {
    // 1) fade out landing...
    landingPage.classList.add('fade-out');
  
    // 2) after fade-out ends, hide landing & start fade-in of calendarApp
    landingPage.addEventListener('animationend', () => {
      landingPage.style.display = 'none';
  
      // prepare calendarApp for fade-in
      calendarApp.style.visibility = 'visible';
      calendarApp.classList.add('fade-in');
    }, { once: true });
  });
  

// Hook up “Submit” button
document.querySelector('.submit-button').addEventListener('click', () => {
  const name  = document.getElementById('eventName').value;
  const date  = document.getElementById('eventDate').value;
  const start = document.getElementById('eventStart').value;
  const end   = document.getElementById('eventEnd').value;

  if (!name || !date || !start || !end) {
    return alert('Please fill in all fields!');
  }
  saveEvent(date, name, start, end);

  // Clear inputs
  ['eventName','eventDate','eventStart','eventEnd'].forEach(id => {
    document.getElementById(id).value = '';
  });
});

// On page load
window.addEventListener('load', () => {
  displayEvents();
  populateCalendar();
});

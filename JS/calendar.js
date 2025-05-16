// ===================== Grab elements =====================
// Truy cập các phần tử HTML chính trong giao diện người dùng
const calendarElement = document.querySelector('.container');
const monthElement    = document.querySelector('#month');
const yearElement     = document.querySelector('#year');
const nextBtn         = document.querySelector('#next');
const prevBtn         = document.querySelector('#previous');
const landingPage     = document.getElementById('landingPage');
const calendarApp     = document.getElementById('calendarApp');

// ===================== Constants =====================
// Mảng tên tháng và ngày, số ngày trong từng tháng
const months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const days      = ['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.'];
const monthDays = [31,28,31,30,31,30,31,31,30,31,30,31];

// ===================== Initial Date Setup =====================
// Khởi tạo ngày hiện tại và gán giá trị mặc định cho tháng/năm đang xem
const today = new Date();
let currentMonthNumber = today.getMonth();
let currentYear        = today.getFullYear();

// ===================== Landing Page Handler =====================
// Xử lý khi người dùng nhấn "Start" – ẩn trang chào và hiển thị ứng dụng lịch
document.getElementById('startButton').addEventListener('click', () => {
  landingPage.style.display = 'none';
  calendarApp.style.display = 'flex';
});

// ===================== Navigation Handlers =====================
// Điều hướng tháng tiếp theo
nextBtn.addEventListener('click', () => {
  if (currentMonthNumber < 11) {
    currentMonthNumber++;
  } else {
    currentMonthNumber = 0;
    currentYear++;
  }
  refreshCalendar();
});

// Điều hướng tháng trước
prevBtn.addEventListener('click', () => {
  if (currentMonthNumber > 0) {
    currentMonthNumber--;
  } else {
    currentMonthNumber = 11;
    currentYear--;
  }
  refreshCalendar();
});

// ===================== Helper Functions =====================

/**
 * Trả về tên thứ tương ứng với ngày truyền vào
 * @param {number} date - Ngày trong tháng
 * @returns {string} - Tên thứ (Mon., Tue.,...)
 */
function determineDay(date) {
  const d = new Date(currentYear, currentMonthNumber, date);
  return days[d.getDay()];
}

/**
 * Tạo một phần tử ngày trên lịch và xử lý sự kiện liên quan
 * @param {number} date - Ngày trong tháng
 * @returns {HTMLElement} - Phần tử DOM của ngày
 */
function getDateElement(date) {
  const ele = document.createElement('div');
  ele.id = date;
  ele.className = 'date';
  if (date === 1) ele.classList.add('special');

  ele.textContent = date;
  ele.addEventListener('mouseover', ()  => ele.textContent = determineDay(date));
  ele.addEventListener('mouseleave', () => ele.textContent = date);
  ele.addEventListener('click', ()     => showEventForDate(ele));

  // Kiểm tra và thêm chấm tròn màu nếu có sự kiện trong ngày này
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const dotsForDate = events.filter(ev => {
    const [y, m, d] = ev.date.split('-').map(Number);
    return y === currentYear && m - 1 === currentMonthNumber && d === date;
  });

  if (dotsForDate.length > 0) {
    const dot = document.createElement('span');
    dot.className = 'event-dot';
    dot.style.backgroundColor = dotsForDate[0].color || 'red';
    ele.appendChild(dot);
  }

  return ele;
}

/**
 * Hiển thị toàn bộ lịch của tháng hiện tại
 */
function populateCalendar() {
  monthElement.textContent = months[currentMonthNumber];
  yearElement.textContent  = currentYear;
  for (let d = 1; d <= monthDays[currentMonthNumber]; d++) {
    calendarElement.appendChild(getDateElement(d));
  }
}

/**
 * Xoá toàn bộ ngày khỏi lịch
 */
function depopulateCalendar() {
  calendarElement.innerHTML = '';
}

/**
 * Làm mới lịch bằng cách xoá cũ và tạo lại
 */
function refreshCalendar() {
  depopulateCalendar();
  populateCalendar();
}

// ===================== Event Management =====================

/**
 * Lưu một sự kiện mới vào localStorage
 * @param {string} date
 * @param {string} name
 * @param {string} start
 * @param {string} end
 * @param {string} color
 */
function saveEvent(date, name, start, end, color) {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  events.push({ name, date, start, end, color });
  localStorage.setItem('events', JSON.stringify(events));
  displayEvents();
  refreshCalendar();
}

/**
 * Hiển thị danh sách sự kiện ở sidebar
 */
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

    // Nhấn vào sự kiện để chuyển lịch đến ngày tương ứng
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

/**
 * Xoá sự kiện theo chỉ số trong mảng
 * @param {number} index
 */
function deleteEvent(index) {
  const events = JSON.parse(localStorage.getItem('events')) || [];
  events.splice(index, 1);
  localStorage.setItem('events', JSON.stringify(events));
  displayEvents();
  refreshCalendar();
}

/**
 * Hiển thị popup sự kiện cho một ngày cụ thể
 * @param {HTMLElement} ele - Phần tử DOM của ngày
 */
function showEventForDate(ele) {
  const date = Number(ele.id);
  const events = JSON.parse(localStorage.getItem('events')) || [];
  const list = events.filter(ev => {
    const [y, m, d] = ev.date.split('-').map(Number);
    return y === currentYear && m - 1 === currentMonthNumber && d === date;
  });

  if (ele.querySelector('.eventsForDay')) return;

  const popup = document.createElement('div');
  popup.className = 'eventsForDay';

  // Style cho popup
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

  // Xử lý ẩn popup nếu chuột rời khỏi
  ele.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!ele.matches(':hover') && !popup.matches(':hover')) {
        popup.remove();
      }
    }, 200);
  });

  popup.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!ele.matches(':hover') && !popup.matches(':hover')) {
        popup.remove();
      }
    }, 200);
  });
}

// ===================== Submit Event =====================
// Xử lý khi nhấn nút "Submit" để thêm sự kiện
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

  // Xoá dữ liệu trong các ô input
  ['eventName', 'eventDate', 'eventStart', 'eventEnd', 'eventColor'].forEach(id => {
    document.getElementById(id).value = '';
  });
});

// ===================== Page Load =====================
// Khởi tạo dữ liệu khi tải trang
window.addEventListener('load', () => {
  displayEvents();
  populateCalendar();
});

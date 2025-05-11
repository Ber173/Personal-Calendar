const calendarElement = document.querySelector('.container');
const monthElement = document.querySelector('#month');
const yearElement = document.querySelector('#year'); // lấy element hiển thị năm
const nextBtn = document.querySelector('#next');
const prevBtn = document.querySelector('#previous');

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const days = ['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.'];
const monthDays = [31,28,31,30,31,30,31,31,30,31,30,31];

let currentMonthNumber = 0;
let currentYear = 2025;

nextBtn.addEventListener('click',() => {
    if(currentMonthNumber < 11) {
        currentMonthNumber += 1;
    } else {
        currentMonthNumber = 0;
        currentYear += 1;
    }
    depopulateCalendar();
    populateCalendar(currentMonthNumber);
});

prevBtn.addEventListener('click', () => {
    if(currentMonthNumber > 0) {
        currentMonthNumber -= 1;
    } else {
        currentMonthNumber = 11;
        currentYear -= 1;
    }
    depopulateCalendar();
    populateCalendar(currentMonthNumber);
});

function determineDay(date) {
    const d = new Date(months[currentMonthNumber] + ' ' + date + ', ' + currentYear);
    return days[d.getDay()];
}

function getDateElement(date) {
    let ele = document.createElement('div');
    ele.id = date;
    ele.classList.add('date');
    if(date == 1) {
        ele.classList.add('special');
    }
    ele.addEventListener("mouseover", () => {
        ele.textContent = determineDay(ele.id);
    });
    ele.addEventListener('mouseleave', () => {
        ele.textContent = ele.id;
    });
    ele.textContent = date;
    return ele;
}

function populateCalendar(monthNumber) {
    monthElement.textContent = months[monthNumber];
    yearElement.textContent = currentYear; // update year
    for(let i = 1; i <= monthDays[monthNumber]; i++) {
        calendarElement.appendChild(getDateElement(i));
    }
}

function depopulateCalendar() {
    calendarElement.innerHTML = '';
}

function submit() {
    const date = document.getElementById("eventDate").value;
    const time = document.getElementById("eventTime").value;
    alert("Date: " + date + "\nTime: " + time);
}

populateCalendar(currentMonthNumber);

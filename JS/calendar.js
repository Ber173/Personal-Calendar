const calendarElement = document.querySelector('.container');
const monthElement = document.querySelector('#month');
const nextBtn = document.querySelector('#next');
const prevBtn = document.querySelector('#previous');
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const days = ['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.'];
const monthDays = [31,28,31,30,31,30,31,31,30,31,30,31];
const year=2020;
let currentMonthNumber = 0;

nextBtn.addEventListener('click',() => {
    if(currentMonthNumber<11) {
        currentMonthNumber+=1;
        depopulateCalendar();
        populateCalendar(currentMonthNumber);
    } 
});

prevBtn.addEventListener('click', () => {
    if(currentMonthNumber>0) {
        currentMonthNumber-=1;
        depopulateCalendar();
        populateCalendar(currentMonthNumber);
    }
});

function determineDay(date) {
    const d = new Date(months[currentMonthNumber]+' '+date+','+year);
    return days[d.getDay()];
}

function getDateElement(date) {
    let ele = document.createElement('div');
    ele.id = date;
    ele.classList.add('date');
    if(date==1) {
        ele.classList.add('special');
    }
    ele.addEventListener("mouseover", ($event) => {
        ele.textContent=determineDay(ele.id);
    });
    ele.addEventListener('mouseleave',($event)=>{
        ele.textContent=ele.id;
    });
    ele.textContent = date;
    return ele;
}

function populateCalendar(monthNumber) {
    monthElement.textContent= months[monthNumber];
    for(let i=1;i<=monthDays[monthNumber];i++) {
        calendarElement.appendChild(getDateElement(i));
    }
}

function depopulateCalendar() {
    calendarElement.innerHTML='';
}

populateCalendar(currentMonthNumber);


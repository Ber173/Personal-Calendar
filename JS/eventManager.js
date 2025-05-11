document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử DOM
    const eventNameInput = document.getElementById('eventName');
    const eventDateInput = document.getElementById('eventDate');
    const eventTimeInput = document.getElementById('eventTime');
    const saveEventButton = document.querySelector('.submit-button');
    const eventsListContainer = document.getElementById('eventsList');

    // Hàm lưu sự kiện vào localStorage
    function saveEvent(date, name, time) {
        let events = JSON.parse(localStorage.getItem('events')) || [];

        // Tạo đối tượng sự kiện
        const event = {
            name: name,
            date: date,
            time: time
        };

        // Thêm sự kiện vào mảng
        events.push(event);

        // Lưu lại vào localStorage
        localStorage.setItem('events', JSON.stringify(events));
    }

    // Hàm hiển thị sự kiện
    function displayEvents() {
        const events = JSON.parse(localStorage.getItem('events')) || [];
        eventsListContainer.innerHTML = ''; // Xóa danh sách cũ

        // Hiển thị các sự kiện
        events.forEach(event => {
            const eventElement = document.createElement('li');
            eventElement.textContent = `${event.name} on ${event.date} at ${event.time}`;
            eventsListContainer.appendChild(eventElement);
        });
    }

    // Hàm xử lý khi nhấn nút lưu sự kiện
    saveEventButton.addEventListener('click', () => {
        const eventName = eventNameInput.value;
        const eventDate = eventDateInput.value;
        const eventTime = eventTimeInput.value;

        // Kiểm tra nếu đã điền đủ thông tin
        if (eventName && eventDate && eventTime) {
            saveEvent(eventDate, eventName, eventTime);
            displayEvents(); // Cập nhật danh sách sự kiện
        } else {
            alert("Please fill in all fields!");
        }
    });

    // Hàm hiển thị sự kiện cho ngày khi người dùng click vào ngày
    function showEventForDate(dateElement) {
        const date = dateElement.id;
        const events = JSON.parse(localStorage.getItem('events')) || [];

        // Lọc các sự kiện cho ngày này
        const eventsForThisDay = events.filter(event => event.date === date);

        // Xử lý hiển thị sự kiện
        const eventDisplay = document.createElement('div');
        eventDisplay.classList.add('eventsForDay');

        if (eventsForThisDay.length > 0) {
            eventsForThisDay.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.classList.add('eventDetail');
                eventElement.textContent = `${event.name} at ${event.time}`;
                eventDisplay.appendChild(eventElement);
            });
        } else {
            eventDisplay.textContent = "No events for this day.";
        }

        // Gắn vào phần tử ngày
        dateElement.appendChild(eventDisplay);
    }

    // Gắn sự kiện cho các ngày
    function addEventListenersToDates() {
        const dateElements = document.querySelectorAll('.date');
        dateElements.forEach(dateElement => {
            dateElement.addEventListener('click', () => showEventForDate(dateElement));
        });
    }

    // Hiển thị sự kiện khi trang được tải
    window.onload = function() {
        displayEvents(); // Hiển thị danh sách sự kiện
        addEventListenersToDates(); // Thêm sự kiện cho các ngày
    };
});

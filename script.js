// Google Calendar API setup
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.auth2.init({
        client_id: '913547426535-069h7s0rve3ug1g46n1dn3477agasfbb.apps.googleusercontent.com'
    }).then(() => {
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        document.getElementById('sign-in-button').onclick = handleAuthClick;
        document.getElementById('sign-out-button').onclick = handleSignoutClick;
    });
}

function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        document.getElementById('sign-in-button').style.display = 'none';
        document.getElementById('sign-out-button').style.display = 'block';
        listUpcomingEvents();
    } else {
        document.getElementById('sign-in-button').style.display = 'block';
        document.getElementById('sign-out-button').style.display = 'none';
    }
}

function listUpcomingEvents() {
    gapi.client.init({
        apiKey: 'AIzaSyCWN_bevAT42a9GjwM5QcTLaTzV3FmWjLs',
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
    }).then(() => {
        gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 10,
            'orderBy': 'startTime'
        }).then(response => {
            const events = response.result.items;
            const calendarView = document.getElementById('google-calendar-view');
            calendarView.innerHTML = '';

            if (events.length > 0) {
                events.map(event => {
                    const eventElement = document.createElement('div');
                    eventElement.classList.add('event');
                    const start = event.start.dateTime || event.start.date;
                    eventElement.innerText = `${start} - ${event.summary}`;
                    calendarView.appendChild(eventElement);
                });
            } else {
                calendarView.innerText = 'No upcoming events found.';
            }
        });
    });
}

// Load the Google Calendar API script
handleClientLoad();

// Private calendar implementation
const privateCalendarView = document.getElementById('private-calendar-view');
const currentMonthSpan = document.getElementById('current-month');
const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
document.getElementById('next-month').addEventListener('click', () => changeMonth(1));

function changeMonth(delta) {
    currentMonth += delta;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar();
}

function updateCalendar() {
    privateCalendarView.innerHTML = ''; // Clear any existing content

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    currentMonthSpan.innerText = `${monthNames[currentMonth]} ${currentYear}`;

    const calendarGrid = document.createElement('div');
    calendarGrid.classList.add('calendar-grid');

    // Fill in the days of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-day');
        calendarGrid.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');
        dayCell.innerText = day;

        if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            dayCell.classList.add('today');
        }

        calendarGrid.appendChild(dayCell);
    }

    // Append the grid to the private calendar view
    privateCalendarView.appendChild(calendarGrid);
}

// Initial call to display the current month
updateCalendar();

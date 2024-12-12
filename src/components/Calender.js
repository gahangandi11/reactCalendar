import React, { useState } from 'react';
import './Calender.css'; // Optional: Add styles here or in a separate CSS file

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({});

  const getMonthDays = (year, month) => {
    const date = new Date(year, month, 1);
    const days = [];

    // Add previous month's trailing days
    const firstDayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }

    // Add current month's days
    while (date.getMonth() === month) {
      days.push({ date: new Date(date), isCurrentMonth: true });
      date.setDate(date.getDate() + 1);
    }

    // Add next month's leading days
    while (days.length % 7 !== 0) {
      days.push({ date: new Date(date), isCurrentMonth: false });
      date.setDate(date.getDate() + 1);
    }

    return days;
  };

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const today = new Date();

  const days = getMonthDays(year, month);

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = (event) => {
    event.preventDefault();
    const form = event.target;
    const eventText = form.eventText.value;
    if (eventText) {
      setEvents((prev) => ({
        ...prev,
        [selectedDate.toDateString()]: [...(prev[selectedDate.toDateString()] || []), eventText],
      }));
      form.reset();
    }
  };

  return (
    <div className="calendar-container">
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
            &lt;
          </button>
          <h2>{monthName} {year}</h2>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
            &gt;
          </button>
        </div>
        <div className="calendar-days-of-week">
          {daysOfWeek.map((day) => (
            <div key={day} className="day-name">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {days.map(({ date, isCurrentMonth }, index) => (
            <div
              key={index}
              className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${date.toDateString() === today.toDateString() ? 'today' : ''}`}
              onClick={() => handleDayClick(date)}
            >
              {date.getDate()}
            </div>
          ))}
        </div>
      </div>

      <div className="events-panel">
        {selectedDate ? (
          <div>
             <form onSubmit={handleAddEvent}>
              <input type="text" name="eventText" placeholder="Add an event" required />
              <button type="submit">Add</button>
            </form>
            <h3>Events on {selectedDate.toDateString()}</h3>
            <ul>
              {(events[selectedDate.toDateString()] || []).map((event, index) => (
                <li key={index}>{event}</li>
              ))}
            </ul>
           
          </div>
        ) : (
          <p>Select a day to view or add events.</p>
        )}
      </div>
    </div>
  );
};

export default Calendar;
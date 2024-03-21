import React, { useState } from 'react';
import './Calendar.css';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
};

const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
};

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);

  const dates = [];
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(i);
  }

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    return (
  <div className="calendar-container">
    <div className="month-navigation">
      <button onClick={handlePrevMonth} className="nav-button">←</button>
      <h2 className="month-name">{currentDate.toLocaleString('default', {month: 'long'})} {currentDate.getFullYear()}</h2>
      <button onClick={handleNextMonth} className="nav-button">→</button>
    </div>
    <div className="calendar-grid">
      {daysOfWeek.map((day, index) => (
          <div key={day} className={`day-of-week ${index >= 5 ? 'weekend' : ''}`}>{day}</div>
      ))}
      {Array.from({length: firstDayOfMonth}, (_, index) => (
          <div key={`empty${index}`}/>
      ))}
      {dates.map(date => (
        <div key={date} onClick={() => handleDateClick(date)} className={`calendar-date ${date === selectedDate?.getDate() && currentDate.getMonth() === selectedDate?.getMonth() && currentDate.getFullYear() === selectedDate?.getFullYear() ? 'selected-date' : ''} ${date === currentDate.getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear() ? 'current-date' : ''}`}>
          {date}
        </div>
      ))}
    </div>
  </div>
);
};

export default Calendar;
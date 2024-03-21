import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Table.css';

const Table = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [data, setData] = useState([]);
  const [socket, setSocket] = useState(null);

  const handleDateClick = async (date) => {
    try {
      setSelectedDate(date);

      const response = await fetch(`http://127.0.0.1:5000/api/data/${date}`);
      const jsonData = await response.json();

      setData(jsonData);

      if (socket) {
        socket.emit('new_data', date);
      }
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  useEffect(() => {
    const newSocket = io('http://127.0.0.1:5000');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('update_table', (newData) => {
        setData(newData);
      });

      socket.on('new_data', (changedDate) => {
        if (selectedDate === changedDate) {
          handleDateClick(selectedDate);
        }
      });
    }
  }, [socket, selectedDate]);

  const dates = ['2024-03-21', '2024-03-22', '2024-03-23'];

  return (
    <div className="date-buttons">
      {dates.map(date => (
          <button key={date} onClick={() => handleDateClick(date)}>
            {date}
          </button>
      ))}
      <p>Выбранная дата: {selectedDate}</p>

      <table>
        <thead>
          <tr>
            <th>Время</th>
            <th>Доступность</th>
            <th>Клиент</th>
            <th>Телефон</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              <td>{item.hour}</td>
              <td>{item.is_available ? 'Доступно' : 'Недоступно'}</td>
              <td>{item.username || '-'}</td>
              <td>{item.phonenumber || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

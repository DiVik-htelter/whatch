import React, { Component, useState, useEffect } from 'react';
import axios from 'axios';


function DataFetcher() {
  const [message, setMessage] = useState('Загрузка...');

  useEffect(() => {
    axios.get('http://localhost:5000/api').then(response => {



        // 2. Устанавливаем полученное сообщение
        setMessage(response.data.messages); 
      }).catch(error => {
        console.error('Ошибка при получении данных от Flask:', error);
        setMessage('Ошибка: не удалось подключиться к бэкенду.');
      });
  }, []); // Пустой массив зависимостей гарантирует, что запрос выполнится только один раз

  return message;
}

function Main(){
    let message = DataFetcher();
    return (
    <div>
        <h1>Main_Page </h1>
        {message}
    </div>
    )
}
export default Main;